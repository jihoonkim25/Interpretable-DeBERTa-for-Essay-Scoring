# Interpretable DeBERTa for Essay Scoring

Writing is a fundamental skill that, if mastered, directly translates into better performance in other
subjects. Unfortunately, few students are able to hone this skill due to infrequent assignments as well as a lack of constructive feedback. This is particularly present within students who are learning English as a second language, so called English Language Learners (ELLs). The currently available tools lack nuance in their feedback, which lead to a sub-optimal learning outcome for the individual.

Our solution aims to provide a simple and intuitive interface for users to receive scored, rubric-based feedback on their writing. We designed the interface with ELLs in mind, in order to make it as easy as possible for them to use. Our solution consists of a text editor hosted on a web page. Once a user inputs their manuscript, they can press a button to have our model evaluate their writing based on six rubric categories: cohesion, syntax, vocabulary, phraseology, grammar and conventions. Each of these is scored on an ordinal scale from 1 to 5, and all scores are color coded and highlighted to reveal the parts of the sentence which our model based its grading decisions on. Furthermore, our rubric scores provide helpful information related to each model’s score. In addition to being rubric-based, our system focuses on making the underlying model more transparent and interpretable.

## DeBERTa
The model we implemented is DeBERTa which improves on BERT by incorporating disentangled attention. Hence, separate vectors are kept for embeddings and positional encodings of tokens. The attention weights amongst tokens are then computed using disentangled matrices based on the content along with positions. Concretely, the model takes a tokenized text paragraph and outputs a rubric score for each category. To obtain the scores, a final linear layer is added to the model and attention pooling is performed at the last layer of the model to ensure that information is optimally propagated to the linear layer.

The model was trained for 4 epochs using leave-one-out cross validation with K=5 folds and RMSE as the objective function. For training, Adam was used as the optimizer with $\beta_1 = 0.9$, $\beta_2 = 0.999$ and $\epsilon = 10^{-6}$. Furthermore, a cosine learning rate scheduler was employed to better improve model convergence. 

## Probing Attention Layers

A highlighting mechanism which lets the user infer what parts of the input text is an important component for user transparency. In the hopes of discovering that passages with high attention correlate with poor writing, several experiments were run where attention weights were probed at different layers of the model post inference. 

Inference was run over multiple text passages from the test-set of the ELL dataset. From this, the attention weights at each layer were extracted. The values in the hidden dimension  were summed to get a numeric value of the attention for each word in all layers. Qualitative analysis was performed as a means to identify patterns between attention values of words and the original text in accordance with the rubric categories. 

## Getting Started
You can directly clone this repository and follow these steps to launch the web application. 

### Prerequisites
First, you need to install NodeJS and NPM from the website: [https://nodejs.org/en/](https://nodejs.org/en/). 

### Installation
1. Install all the packages neeeded for the frontend. Run the following line in the project directory. This will create a folder called node_modules
   ```sh
   npm install
   ```

2. Go into the api/ folder and activate the virtual environment (myvenv)
   ```sh
   source myvenv/bin/activate
   ```

**Note**: you need this version of Flask SQLAlchemy:
   ```sh
   pip install flask_sqlalchemy==2.5.1
   ```

3. In the api/ folder, create a folder to store the database
   ```sh
   mkdir tmp
   ```

4. To keep the backend on, run the following line in the api/ folder:
   ```sh
   python api.py
   ```
**Note**: This will create the database and it will appear in the tmp folder (`test.db`). 

**Note**: You can copy this link in a browser [http://0.0.0.0:8080/time](http://0.0.0.0:8080/time) to make sure that the backend is running. You can change the endpoint to visualize different outcomes (check the endpoints in the api.py script). 

5. In another terminal tab, go to the src/ folder to launch the frontend using the following line:
   ```sh
   npm start
   ```
**Note**: this will open a browser or you can open [http://localhost:3000/#/](http://localhost:3000/#/) to view it. 

**Note**: You can open the browser console (right click-Inspect-Console) to visualize log messages or errors from the frontend. 

The application supports two tasks (chosen randomly). If you want to learn how to send data to the backend, you should follow the process in task 1 at: [http://localhost:3000/#/Main1](http://localhost:3000/#/Main1).

## Installations
Text area highlighting is done using the react-highlight-within-textarea package found here: [https://www.npmjs.com/package/react-highlight-within-textarea](https://www.npmjs.com/package/react-highlight-within-textarea).
```sh
   npm install --save react-highlight-within-textarea draft-js
```
