function addition(num1, num2) {
    let result = num1 + num2;
    return Math.round(result * 10) / 10;
}

function subtraction(num1, num2) {
    let result = num1 - num2;
    return Math.round(result * 10) / 10;
}

function division(num1, num2) {
    let result = num1 / num2;
    return Math.round(result * 10) / 10;
}

function multiplication(num1, num2) {
    let result = num1 * num2;
    return Math.round(result * 10) / 10;
}

module.exports = {
    addition,
    subtraction,
    division,
    multiplication
}