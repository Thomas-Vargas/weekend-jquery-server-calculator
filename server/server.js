const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}));

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

let equations = require('./modules/equations.js');

// Server side logic for equations
let math = require('./modules/math.js');


app.post('/', (req, res) => {
    console.log('Get a POST request, req.body:', req.body);
    let newEquation = {
        firstOperand: Number(req.body.firstOperand),
        secondOperand: Number(req.body.secondOperand),
        operator: req.body.operator
    }

    switch (newEquation.operator) {
        case '+': 
            newEquation.solution = math.addition(newEquation.firstOperand, newEquation.secondOperand);
            break;
        case '-':
            newEquation.solution = math.subtraction(newEquation.firstOperand, newEquation.secondOperand);
            break;
        case '÷':
            newEquation.solution = math.division(newEquation.firstOperand, newEquation.secondOperand);
            break;
        case 'x':
            newEquation.solution = math.multiplication(newEquation.firstOperand, newEquation.secondOperand);
            break;
    }

    equations.push(newEquation);
    console.log('All equations in server:', equations);
    res.sendStatus(201);
});

app.get('/equations', (req, res) => {
    console.log('Request to /equation made');
    res.send(equations);
});

app.get('/equationResult', (req, res) => {
    console.log('Request to /equationResult made');
    res.send(equations[equations.length - 1]);
});

app.delete('/deleteAllEquations', (req,res) => {
    console.log('Request to /deleteAllEquations');
    equations = [];
    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log ('Server is running on port', PORT)
});