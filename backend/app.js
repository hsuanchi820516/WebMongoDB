import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { Blog } from './models/blog.js';
import { google } from 'googleapis';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = 'mongodb+srv://dbUser:dbUser@cluster0.z9u9o.mongodb.net/mola?retryWrites=true&w=majority';

mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})
    .then((res) => console.log('connect to db'))
    .catch((err) => console.log(err));

app.post('/add', (req, res) => {
    // console.log(req.body);
    const blog = new Blog({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Answers: req.body.Answers
    })

    blog.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => console.log(err));
})



app.get('/', async (req, res) => {
    res.send("Welocome Back Ian!!");
})


app.get('/findAll', async (req, res) => {
    const allDoc = await Blog.find({});
    res.send(allDoc);
})


app.get('/questions', async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

     // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1BhzwdithHmh6pnyvKenhewQavp5iR0KWB4GAqBvu0RI";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "mfq_question",
    });

    const n = getRows.data.values.length;
    let array = getRows.data.values.slice(1, n);

    // shuffled the 36 questions
    const shuffled = array.sort(() => 0.5 - Math.random());
    
    let top10 = [];
    

    // output top 10 questions
    for (let i = 0; i < 10; i++) {
        top10.push({
            "id": shuffled[i][3], // mfq_20
            "question": shuffled[i][1], // i.e. It upsets me when people have no loyalty to their country.
            "options": shuffled[i].slice(4, 11) // Strongly Disagree....Netural...Strongly Agree
        });
    }

    res.send(top10);

})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));