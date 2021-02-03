const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./database.json')
const conf = JSON.parse(data)
const { Pool, Client, Connection } = require('pg');

const client = new Client({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

client.connect();

const multer = require('multer');
const upload = multer({dest: './upload'});

app.get('/api/customers', (req, response) => {
    client.query(
        'SELECT * FROM CUSTOMER',
        (err, result) => {
            response.send(result.rows);
        }
    );
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    let sql = 'INSERT INTO customer(image, name, birthday, gender, job) VALUES ($1, $2, $3, $4, $5);';
    let image = 'http://localhost:5000' + '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    client.query(sql, params, (err, result) => {
        res.send(result);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`))