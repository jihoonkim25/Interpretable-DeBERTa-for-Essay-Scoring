import os
import numpy as np
import torch
import torch.nn as nn
import tokenizers
import transformers
from transformers import AutoTokenizer, AutoModel, AutoConfig

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


class CFG:
    model_checkpoint = 'microsoft/deberta-v3-base'
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    target_cols = ['cohesion', 'syntax', 'vocabulary',
                   'phraseology', 'grammar', 'conventions']
    seed = 42
    pooling = 'mean'
    OUTPUT_DIR = os.path.join(os.getcwd(), 'output_dir')
    max_len = 1427  # calculated in train script
    tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)


class MeanPooling(nn.Module):
    def __init__(self):
        super(MeanPooling, self).__init__()

    def forward(self, last_hidden_state, attention_mask):
        input_mask_expanded = attention_mask.unsqueeze(
            -1).expand(last_hidden_state.size()).float()
        sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, 1)
        sum_mask = input_mask_expanded.sum(1)
        sum_mask = torch.clamp(sum_mask, min=1e-9)
        mean_embeddings = sum_embeddings/sum_mask
        return mean_embeddings


class FB3Model(nn.Module):
    def __init__(self, CFG, cfg_path=None):
        super().__init__()
        self.CFG = CFG
        self.model = AutoModel.from_pretrained(
            CFG.model_checkpoint, config=cfg_path)
        self.config = self.model.config
        self.config.update({'output_hidden_states':True}) 
        # set fc output layer
        self.fc = nn.Linear(self.config.hidden_size, len(self.CFG.target_cols))
        self.pool = MeanPooling()

    def feature(self, inputs):
        outputs = self.model(**inputs)
        last_hidden_states = outputs[0]
        feature = self.pool(last_hidden_states, inputs['attention_mask'])
        return feature, outputs

    def forward(self, inputs):
        feature, attn = self.feature(inputs)
        output = self.fc(feature)
        return output, attn


def load_model(CFG, cfg_path, pretrained_path):
    model = FB3Model(CFG, cfg_path)
    state = torch.load(pretrained_path, map_location=torch.device('cpu'))
    # load model weights
    model.load_state_dict(state['model'])
    return model


def prepare_input(cfg, text: str):
    text = [text]
    text.append('')

    inputs = cfg.tokenizer.encode_plus(
        text,
        return_tensors=None,
        add_special_tokens=True,
        max_length=CFG.max_len,
        padding='max_length',
        truncation=True)

    for k, v in inputs.items():
        inputs[k] = torch.tensor(v, dtype=torch.long)

    return inputs


def collate(inputs):
    mask_len = int(inputs["attention_mask"].sum().max())
    for k, v in inputs.items():
        # subtract 1 because of the added whitespace in prepare_input
        inputs[k] = inputs[k][:mask_len-1].unsqueeze(0)
    return inputs


def round_output(x, prec=2, base=.5):
    return round(base * round(float(x)/base), prec)


def rubric_inference(cfg, model, text):
    out_dict = {col:-1 for col in cfg.target_cols}
    ipt = prepare_input(cfg, text)
    ipt = collate(ipt)
    with torch.no_grad():
        out = model(ipt)
    # get hidden states
    all_hidden_states = torch.stack(out[1]['hidden_states'])
    cls_embeddings = all_hidden_states[12, :, :, :]
    summed_attn = abs(torch.sum(cls_embeddings, dim=-1)[0][1:-1])
    # convert from tensor to rounded list
    scores = list(map(round_output, out[0][0].tolist()))
    return scores, summed_attn


def correct_sent(input_sent, model, tokenizer):
    batch = tokenizer([input_sent], truncation=True, padding='max_length',
                      max_length=64, return_tensors="pt").to(device)
    translated = model.generate(
        **batch, max_length=64, num_beams=2, num_return_sequences=1, temperature=1.5)
    tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)
    return tgt_text


def correct_grammar(input_text, model, tokenizer):
    # split on period, remove leading and trailing spaces
    input = list(map(lambda x: x.strip('.').strip(), input_text.split()))

    # run inference
    corrected = [correct_sent(ipt, model, tokenizer) for ipt in input]

    out = '. '.join(list(map(str, [e[0] for e in corrected])))
    return out


def get_corrected_idxs(original, corrected, window_size=5):

    idxs = []
    # original words that have been corrected
    org_words = []
    # convert from str to list of str and handle edge cases
    org = [e for word in original.strip('.').split(
        '.\n\n') for e in word.split(' ')]
    new = [e for e in corrected.strip('.').split(' ')]

    N_max = max(len(org), len(new))
    N_min = min(len(org), len(new))

    for i in range(N_max):

        org_window = [e.strip('.').strip('\n\n').lower()
                      for e in org[i - window_size: i + window_size + 1]]
        new_window = [e.strip('.').strip('\n\n').lower()
                      for e in new[i - window_size: i + window_size + 1]]
        org_e = org[i].lower()
        new_e = new[i].lower()
        # check if a word has been replaced
        if org_e != new_e and org_e not in new_window and new_e not in org_window:
            print("-----------"*5)
            print(f"org: {org_e}    new: {new_e}")
            print("new window", new_window)
            print("org window", org_window)
            print("index: ", i)
            idxs.append((i-1, i, i+1))

            # append the previous word and the actual word
            org_words.append(org[i-1])
            org_words.append(org[i])
        if i == N_min-1:
            break

    return idxs
