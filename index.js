import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import request from "request";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(mongoDBURL);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

// Function to get documents from MongoDB
async function getDocumentsFromMongoDB() {
  try {
    const db = client.db("ArxivData");
    const collection = db.collection("embeddings");
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching documents from MongoDB:", error);
    return [];
  }
}

// Root route
app.get("/", (req, res) => {
  res.render('index', { text: 'John' });
});

// API route to get MongoDB data
app.get('/api/mydata', async (req, res) => {
  const docsList = await getDocumentsFromMongoDB();
  res.json(docsList);
});

// POST route
app.post('/', (req, res) => {
  const queryParams = {
    key1: req.body.textInput,
  };

  const url = `http://localhost:5555/flask?key1=${queryParams.key1}`;

  request(url, function (error, response, body) {
    if (error) {
      console.error("Error in request:", error);
      return res.status(500).send("Error processing request");
    }
    
    res.render("index", { text: body });
  });
});

// API route to get data from Flask
app.get('/api/mydata2', (req, res) => {
  const url = `http://localhost:5555/flask?key1=default`;

  request(url, function (error, response, body) {
    if (error) {
      console.error("Error in request:", error);
      return res.status(500).send("Error processing request");
    }
    
    res.send(body);
  });
});

app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});