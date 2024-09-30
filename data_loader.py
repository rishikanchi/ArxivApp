import pymongo
import pandas as pd

myclient = pymongo.MongoClient("mongodb+srv://rishirkanchi:QxeAnSvizBC6VC1R@cluster0.cf3bg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mydb = myclient["ArxivData"]
mycol = mydb["embeddings"]

df = pd.read_csv("arxiv_100k.csv")

data_conv = {
    "astro-ph" : "Astrophysics",
    "cond-mat" : "Condensed Material",
    "cs" : "Computer Science",
    "econ" : "Economics",
    "eess" : "Electrical Engineering and Systems Science",
    "gr-qc" : "General Relativity and Quantum Cosmology",
    "hep-ex" : "High Energy Physics - Experiment",
    "hep-lat" : "High Energy Physics - Lattice",
    "hep-ph" : "High Energy Physics - Phenomenology",
    "hep-th" : "High Energy Physics - Theory",
    "math" : "Mathematics",
    "math-ph" : "Mathematical Physics",
    "nlin" : "Nonlinear Sciences",
    "nucl-ex" : "Nuclear Experiment",
    "nucl-th" : "Nuclear Theory",
    "physics" : "Physics",
    "q-bio" : "Quantitative Biology",
    "q-fin" : "Quantitative Finance",
    "quant-ph" : "Quantum Physics",
    "stat" : "Statistics"
}

df["label"] = df["categories"].apply(lambda x: x.split()[0].split(".")[0]).map(data_conv)

df["id"] = "0" + df["id"].astype(str)

data = []


for row in df.iterrows():
    row = row[1]
    data.append({"x" : str(row["Dim1"]), "y" : str(row["Dim2"]), "category" : row["label"], "description" : f"Paper Title: {row['title']}", "url" : f"URL: https://arxiv.org/abs/{row['id']}"})

print("here")

mycol.insert_many(data)