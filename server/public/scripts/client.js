$(document).ready(onReady);

function onReady() {
    console.log('jq loaded');

    $('.number').on('click', getBtnNumber);
    $('.operator').on('click', getBtnOperator);
    $('#equals-btn').on('click', runCalculation);
    $('#clear').on('click', clearAll);
}

let firstOperand = '';
let secondOperand = '';
let operator = '';
let currentEquation = '';
let lastEquation = '';


function runCalculation() {
    if(firstOperand && secondOperand && operator) {
        lastEquation = currentEquation;
        currentEquation = '';
        $('#lastOperationScreen').text(lastEquation);
    
        let equationObj = {
            firstOperand: Number(firstOperand),
            secondOperand: Number(secondOperand),
            operator
        }   
    
        addNewEquation(equationObj);
        clearAll()
    }
}

function clearAll() {
    currentEquation = '';
    firstOperand = '';
    secondOperand = '';
    operator = '';
    currentEquation = '';
    lastEquation = '';
    $('#currentOperationScreen').text('');
}

function getBtnNumber() {
    //console.log($(this).text());
    let num = $(this).text()
    if (operator.length === 0) {
        firstOperand += num;
        currentEquation += num;
        $('#currentOperationScreen').text(currentEquation);
    }
    else {
        secondOperand+= num;
        currentEquation += ` ${secondOperand}`
        $('#currentOperationScreen').text(currentEquation);
    }
    console.log('First operand:',firstOperand);
    console.log('Second operand:', secondOperand);
    console.log('Operator', operator);

}

function getBtnOperator() {
    if(operator.length === 0) {
        operator = $(this).text();
        currentEquation += ` ${operator}`
        $('#currentOperationScreen').text(currentEquation);
    }
}

function addNewEquation(equation){
    $.ajax({
        method: 'POST',
        url: '/',
        data: equation
    }).then(function(response) {
        console.log('post request success (POST to /)');
        //console.log(response);
        getAllEquations();
        getEquationResult();
    }).catch(function(response) {
        alert('Request failed');
    })
}

function getEquationResult() {
    $.ajax({
        method: 'GET',
        url: '/equationResult',
    }).then(function(response) {
        console.log('Success', response);
        renderResult(response);
    }).catch(function(response) {
        console.log(response);
        alert('Request failed!');
    });
}

function getAllEquations() {
    $.ajax({
        method: 'GET',
        url: '/equations',
    }).then(function(response) {
        console.log('Success', response);
        renderAllEquations(response)
    }).catch(function(response) {
        console.log(response);
        alert('Request failed!');
    });
}

function renderResult(equation) {
    console.log('Most recent equation solution', equation.solution);
    $('#currentOperationScreen').text(`${equation.solution}`);
}

function renderAllEquations(equations) {
    for(let i = 0; i < equations.length; i++) {
        $('#all-equations').append(`
            <li>${equations[i].firstOperand} ${equations[i].operator} ${equations[i].secondOperand} = ${equations[i].solution}</li>
        `);
    }
}

