import os
import time
import random
from urllib import response

from flask import Flask, jsonify, json, request
from flask_cors import CORS

import model_util
from transformers import AutoModel, AutoTokenizer, T5Tokenizer, T5ForConditionalGeneration

os.environ['KMP_DUPLICATE_LIB_OK']='True'
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

CFG = model_util.CFG
device = CFG.device

grammar_model_name = 'deep-learning-analytics/GrammarCorrector'
grammar_tokenizer = T5Tokenizer.from_pretrained(grammar_model_name)
grammar_model = T5ForConditionalGeneration.from_pretrained(grammar_model_name).to(device)

config_path = os.path.join(os.getcwd(), 'model/config.json')
model_path = os.path.join(os.getcwd(), 'model/rubric_score_model.pth')
rubric_tokenizer = AutoTokenizer.from_pretrained(CFG.model_checkpoint)
rubric_model = model_util.load_model(CFG, config_path, model_path)


@app.route('/time')
def get_current_time():
    return jsonify({'time': time.strftime("%I:%M:%S %p", time.localtime())})


# send data from frontend to backend
@app.route('/score', methods=['POST'])
def score():
    request_data = json.loads(request.data)
    text = request_data['text']
    scores, attn = model_util.rubric_inference(CFG, rubric_model, text)
    avg_score = model_util.round_output(sum(scores)/len(scores))
    zipped = list(zip(attn.tolist(), text.split()))
    top_n = round(.2*len(zipped))
    heatmap = sorted(zipped, key = lambda x: x[0], reverse=True)[:top_n]
    words = list(zip(*heatmap))[1]
    response_body = {
        'words': list(words),
        'heatmap': heatmap,
        'cohesion': {'score': scores[0]},
        'syntax': {'score': scores[1]},
        'vocabulary': {'score': scores[2]},            
        'phraseology': {'score': scores[3]},
        'grammar': {'score': scores[4]},
        'conventions': {'score': scores[5]},
        'overall': {'score': avg_score}
    }
    return jsonify(response_body) 


@app.route('/correct', methods=['POST'])
def correct():
    request_data = json.loads(request.data)
    text = request_data['text']
    corrected = model_util.correct_grammar(text, grammar_model, grammar_tokenizer)
    response_body = {'corrected': corrected, 'words': ["examle", "test"]}
    """response_body = {
        'corrected': "This is an example of the corrected text.",
        'words': ["examle", "test"]
    }"""
    return jsonify(response_body) 

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
