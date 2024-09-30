import pymongo
import pandas as pd
from sklearn.cluster import KMeans
import numpy as np

# MongoDB connection
myclient = pymongo.MongoClient("mongodb+srv://rishirkanchi:QxeAnSvizBC6VC1R@cluster0.cf3bg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mydb = myclient["ArxivData"]
mycol = mydb["embeddings"]  # Using the existing collection

# Load the data
df = pd.read_csv("arxiv_100k.csv")

# Category mapping
data_conv = {
    "astro-ph": "Astrophysics",
    "cond-mat": "Condensed Material",
    "cs": "Computer Science",
    "econ": "Economics",
    "eess": "Electrical Engineering and Systems Science",
    "gr-qc": "General Relativity and Quantum Cosmology",
    "hep-ex": "High Energy Physics - Experiment",
    "hep-lat": "High Energy Physics - Lattice",
    "hep-ph": "High Energy Physics - Phenomenology",
    "hep-th": "High Energy Physics - Theory",
    "math": "Mathematics",
    "math-ph": "Mathematical Physics",
    "nlin": "Nonlinear Sciences",
    "nucl-ex": "Nuclear Experiment",
    "nucl-th": "Nuclear Theory",
    "physics": "Physics",
    "q-bio": "Quantitative Biology",
    "q-fin": "Quantitative Finance",
    "quant-ph": "Quantum Physics",
    "stat": "Statistics"
}

# Convert categories
df["label"] = df["categories"].apply(lambda x: x.split()[0].split(".")[0]).map(data_conv)

# Perform clustering
n_clusters = 20  # You can adjust this number
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
df['cluster'] = kmeans.fit_predict(df[['Dim1', 'Dim2']])

# Calculate cluster centers and create cluster data
cluster_data = []
cluster_centers = kmeans.cluster_centers_
for i, center in enumerate(cluster_centers):
    cluster_papers = df[df['cluster'] == i]
    most_common_category = cluster_papers['label'].mode().iloc[0]
    avg_x = cluster_papers['Dim1'].mean()
    avg_y = cluster_papers['Dim2'].mean()
    
    cluster_data.append({
        "x": str(avg_x),
        "y": str(avg_y),
        "cluster_name": f"{most_common_category} {i}",
    })

# Insert cluster data at the end of the existing collection
print("Appending cluster data to the existing collection...")
mycol.insert_many(cluster_data)
print("Cluster data insertion complete.")

# Print cluster information
for cluster in cluster_data:
    print(f"Cluster: {cluster['cluster_name']}, Position: ({cluster['x']}, {cluster['y']})")

# Print total count of documents in the collection
total_count = mycol.count_documents({})
print(f"Total documents in collection after adding clusters: {total_count}")