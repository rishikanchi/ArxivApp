from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel
import torch

app = Flask(__name__)

MODEL_PTH = 'sentence-transformers/paraphrase-albert-small-v2'

tokenizer = AutoTokenizer.from_pretrained(MODEL_PTH)
model = AutoModel.from_pretrained(MODEL_PTH)

def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

def embed_abstracts(abstracts, model, tokenizer):
    encoded_input = tokenizer(abstracts, padding=True, truncation=True, return_tensors='pt')

    encoded_input = {k : v for k, v in encoded_input.items()}

    with torch.no_grad():
        model_output = model(**encoded_input)

    return mean_pooling(model_output, encoded_input['attention_mask'])

import torch.nn as nn

class MLP(nn.Module):
    def __init__(self):
        super(MLP, self).__init__()
        self.mlp = nn.Sequential(
            nn.Linear(768, 1024),
            nn.SELU(),
            nn.Linear(1024, 512),
            nn.SELU(),
            nn.Linear(512, 256),
            nn.SELU(),
            nn.Linear(256, 2),
        )
    def forward(self, x):
        out = self.mlp(x)
        return out

mlp = MLP()
mlp.load_state_dict(torch.load("umap_estimator.pth", map_location="cpu"))

@app.route('/flask', methods=['GET', 'POST'])
def index():
    text = request.args.get('key1')

    embeddings = embed_abstracts([str(text)], model, tokenizer).cpu().detach().squeeze().unsqueeze(0)

    out = mlp(embeddings).squeeze().detach().cpu().numpy()
    print(out)
    return {
        "x" : str(out[0]),
        "y" : str(out[1]),
    }


if __name__ == "__main__":
    app.run(port=5555, debug=True)