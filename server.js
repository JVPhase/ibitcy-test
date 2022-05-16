import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import bodyParser from 'body-parser';
const __dirname = dirname(fileURLToPath(import.meta.url));
let app = express();
const srcPath = __dirname;
app.use(express.static(path.join(srcPath, 'build')));
let urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());

// Initial set of deals
let defaultDeals = [
  { id: 0, date: 1652621670000, value: 200 },
  { id: 1, date: 1652621671000, value: 68 },
];
let deals = [];
defaultDeals.forEach((deal) => {
  deals.push(deal);
});

app.get('/deals/:page', (req, res) => {
  const dealsRev = [...deals].reverse();
  const filtered = dealsRev.splice(req.params.page * 10, 10);
  res.send(filtered);
});

app.post('/new', urlencodedParser, (req, res) => {
  deals.push(req.body);
  res.sendStatus(200);
});

app.delete('/delete/:id', urlencodedParser, (req, res) => {
  for (let i = 0; i < deals.length; i++) {
    if (deals[i].id === +req.params.id) {
      deals.splice(i, 1);
      break;
    }
  }
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(srcPath, 'build', 'index.html'));
});

const listener = app.listen(8080, function () {
  console.log('Listening on port ' + listener.address().port);
});
