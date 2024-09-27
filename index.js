import express from "express";
import {PORT, mongoDBURL} from "./config.js";
import {MongoClient} from "mongodb";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import request from "request";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs'); 

app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(mongoDBURL);

app.get("/", (req, res) => {

    async function run() {
      try {
        await client.connect();
        const db = client.db("ArxivData");


    
        const collection = db.collection("embeddings");
    
        var docs = collection.find({});
        return docs.toArray();
    
      } 
      finally {
      }
    }
    (async function() {
        let docsList = await run();
        app.get('/api/mydata', (req, res) => {
          
            res.json(docsList); // Send data as JSON
          });
    })();

    return res.render('index', { text: 'John' }); 
});

let data;

app.post('/', function(req, res) {

      const queryParams = {
        key1: req.body.textInput,
    };


    // Construct the URL with query parameters
    const url = `http://localhost:5555/flask?key1=${queryParams.key1}`;

    request(url, function (error, response, body) {
     data = body;
      (async function() {
          app.get('/api/mydata2', (req, res) => {
            res.send(data); // Send data as JSON
            
          });
          console.log(data);

          return res.render("index", {text : data});
    })();
      });  

});


app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`)
})


