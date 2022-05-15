// init project
import express from 'express';
import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import bodyParser from 'body-parser';
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
let app = express();
const srcPath = __dirname;
app.use(express.static(path.join(srcPath, 'dist')));

let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Initial set of users to populate the database with
let defaultDeals = [
  { id: 0, date: 1652621670000, value: 200 },
  { id: 1, date: 1652621671000, value: 68 },
  { id: 2, date: 1652621673000, value: 69 },
  { id: 3, date: 1652621674000, value: 70 },
  { id: 4, date: 1652621675000, value: 90 },
  { id: 5, date: 1652621676000, value: 34 },
  { id: 6, date: 1652621678000, value: 26 },
  { id: 7, date: 1652621685000, value: 178 },
  { id: 8, date: 1652621694000, value: 223 },
  { id: 9, date: 1652621745000, value: 700 },
  { id: 10, date: 1652621746000, value: 68 },
  { id: 11, date: 1652621747000, value: 49 },
  { id: 12, date: 1652621750000, value: 170 },
  { id: 13, date: 1652621753000, value: 45 },
  { id: 14, date: 1652622167000, value: 200 },
  { id: 15, date: 1652622175000, value: 68 },
  { id: 16, date: 1652622179000, value: 69 },
  { id: 17, date: 1652622184000, value: 70 },
  { id: 18, date: 1652622185000, value: 90 },
  { id: 19, date: 1652622198000, value: 34 },
  { id: 20, date: 1652622200000, value: 26 },
  { id: 21, date: 1652622223000, value: 178 },
  { id: 22, date: 1652622234000, value: 223 },
  { id: 23, date: 1652622245000, value: 200 },
  { id: 24, date: 1652622265000, value: 68 },
  { id: 25, date: 1652622273000, value: 49 },
  { id: 26, date: 1652622276000, value: 170 },
  { id: 27, date: 1652622287000, value: 45 },
];
db.data.deals = [];
db.write();
defaultDeals.forEach((deal) => {
  db.data.deals.push(deal);
  db.write();
});

// Send user data - used by client.js
app.get('/deals/:page', (req, res) => {
  const deals = [...db.data.deals].reverse();
  const filtered = deals.splice(req.params.page * 10, 10);
  res.send(filtered); // sends users back to the page
});

// Create a new entry in the users table
app.post('/new', urlencodedParser, (req, res) => {
  db.data.deals.push({ name: req.body.deal }).write();
  res.redirect('/');
});

// Create a new entry in the users table
app.delete('/delete/:index', urlencodedParser, (req, res) => {
  db.data.deals.splice(req.params.index, 1);
  db.write();
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(srcPath, 'dist', 'index.html'));
});

var listener = app.listen(8080, function () {
  console.log('Listening on port ' + listener.address().port);
});
