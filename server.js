const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./database.json')
const conf = JSON.parse(data)
const { Pool, Client } = require('pg');

const client = new Client({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

client.connect();

app.get('/api/customers', (req, response) => {
    client.query(
        'SELECT * FROM CUSTOMER',
        (err, result) => {
            response.send(result.rows);
        }
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`))