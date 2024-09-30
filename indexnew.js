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

// Variable to store MongoDB data
let mongoData = null;

// Connect to MongoDB and fetch data
async function connectToMongoDBAndFetchData() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("ArxivData");
    const collection = db.collection("embeddings");
    mongoData = await collection.find({}).toArray();
    console.log("Data fetched from MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB or fetching data:", error);
  }
}

// Call this function when the server starts
connectToMongoDBAndFetchData();

// Root route
app.get("/", (req, res) => {
  res.render('index', { text: 'John' });
});

// API route to get MongoDB data
app.get('/api/mydata', (req, res) => {
  if (mongoData) {
    res.json(mongoData);
  } else {
    res.status(503).json({ error: "Data not yet loaded" });
  }
});

// POST route
app.post('/', (req, res) => {
  const queryParams = {
    key1: req.body.textInput,
  };

  const url = `http://127.0.0.1:5555/flask?key1=${queryParams.key1}`;

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
  const url = `http://127.0.0.1:5555/flask?key1=default`;

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