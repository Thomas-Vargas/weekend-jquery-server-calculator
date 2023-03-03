const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}));

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

let equations = []

app.post('/', (req, res) => {
    console.log('Get a POST request', req.body);
    equations.push(req.body);
    
    console.log('All equations in server:', equations);
    res.sendStatus(201);
})

app.listen(PORT, () => {
    console.log ('Server is running on port', PORT)
});