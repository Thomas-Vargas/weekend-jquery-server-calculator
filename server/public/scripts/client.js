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

// Global variables
let firstOperand = '';
let secondOperand = '';
let operator = '';
let currentEquation = '';
let lastEquation = '';

// Allows user to run past equations in history with var\
function runPastEquation() {
    currentEquation = $(this).text();
    runCalculation();
}

// Allows user to delete most recent digit in equation
    // If statements allows the user to delete operator and empty spaces
function deleteDigit() {
    // Store thing to delete
    let thingToDelete = currentEquation[currentEquation.length - 1];
    
    // If it's an operator, remove it and the empty space before it. 
        // Clear value stored in operator var
    if (thingToDelete === '+' || thingToDelete === '-' || thingToDelete === 'x' || thingToDelete === '÷') {
        currentEquation = currentEquation.slice(0, -2);
        operator = ''
    };

     // If it's an empty space, remove it and the character before it. 
        // If the previous character is an operator, clear the value stored in operator var.
    if (thingToDelete === ' ') {
        currentEquation = currentEquation.slice(0, -2);
        operator = ''
    }

    // Else remove the first chara
    currentEquation = currentEquation.slice(0, -1);
    // console.log(currentEquation);
    $('#currentOperationScreen').text(currentEquation);
}

function runCalculation() {
    // Create array out of currentEquation string
    let equationArr = currentEquation.split(' ');
    // console.log(equationArr);
    firstOperand = equationArr[0];
    operator = equationArr[1];
    secondOperand = equationArr[2];

    // Only run POST request if its a valid equation
    if(firstOperand && secondOperand && operator) {
        lastEquation = currentEquation;
        currentEquation = '';
        // Display last equation
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

// Updates currentEquation var with each number btn click and updates currentOperationScreen
function getBtnNumber() {
    //console.log($(this).text());
    let num = $(this).text();

    // Refactored to use current equation only
    currentEquation += num;
    $('#currentOperationScreen').text(currentEquation);

    // Tests
    // console.log('First operand:',firstOperand);
    // console.log('Second operand:', secondOperand);
    // console.log('Operator', operator);
    // console.log('current equation:', currentEquation);
}

// Updates operator var when operator btn clicked
    // Only allows for single operation equations
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

// Get the result of most recent equation
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

// Updates currentEquation screen and allows equation result to be used for next equation
function renderResult(equation) {
    console.log('Most recent equation solution', equation.solution);
    $('#currentOperationScreen').text(`${equation.solution}`);
    currentEquation += equation.solution;
}

function renderAllEquations(equations) {
    $('#all-equations').empty();
    for(let i = 0; i < equations.length; i++) {
        $('#all-equations').append(`
            <button id=${i} class="equation">${equations[i].firstOperand} ${equations[i].operator} ${equations[i].secondOperand}</button>
        `);
    }
}

