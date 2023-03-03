$(document).ready(onReady);

function onReady() {
    console.log('jq loaded');

    $('.number').on('click', getBtnNumber);
    $('.operator').on('click', getBtnOperator);
    $('#equals-btn').on('click', runCalculation);
    $('#clear').on('click', clearAll);
    $('#delete-all-equations').on('click', deleteAllEquations);
    $('#delete').on('click', deleteDigit);
    $('#all-equations-container').on('click', '.equation', runPastEquation);

    getAllEquations();
}

let firstOperand = '';
let secondOperand = '';
let operator = '';

let currentEquation = '';
let lastEquation = '';

function runPastEquation() {
    currentEquation = $(this).text();
    runCalculation();
}

function deleteDigit() {
    currentEquation = currentEquation.slice(0, -1);
    // console.log(currentEquation);
    $('#currentOperationScreen').text(currentEquation);
}


function runCalculation() {
    let equationArr = currentEquation.split(' ');
    // console.log(equationArr);
    firstOperand = equationArr[0];
    operator = equationArr[1];
    secondOperand = equationArr[2];

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
    let num = $(this).text();
    // if (operator.length === 0) {
    //     firstOperand += num; 
    //     currentEquation += num;
    //     $('#currentOperationScreen').text(currentEquation);
    // }
    // else {
    //     secondOperand+= num;
    //     currentEquation += num;
    //     $('#currentOperationScreen').text(currentEquation);
    // }

    // Refactored to use current equation only
    currentEquation += num;
    $('#currentOperationScreen').text(currentEquation);

    // Tests
    // console.log('First operand:',firstOperand);
    // console.log('Second operand:', secondOperand);
    // console.log('Operator', operator);
    // console.log('current equation:', currentEquation);
}

function getBtnOperator() {
    if(operator.length === 0) {
        operator = $(this).text();
        currentEquation += ` ${operator} `
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

function deleteAllEquations() {
    $.ajax({
        method: 'DELETE',
        url: '/deleteALLEquations'
    }).then(function(response) {
        console.log('post request success (POST to /deleteEquations)');
        getAllEquations();
    }).catch(function(response) {
        alert('Request failed');
    })
}

function renderResult(equation) {
    console.log('Most recent equation solution', equation.solution);
    $('#currentOperationScreen').text(`${equation.solution}`);
}

function renderAllEquations(equations) {
    $('#all-equations').empty();
    for(let i = 0; i < equations.length; i++) {
        $('#all-equations').append(`
            <button id=${i} class="equation">${equations[i].firstOperand} ${equations[i].operator} ${equations[i].secondOperand}</button>
        `);
    }
}

