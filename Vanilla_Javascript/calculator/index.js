const display = document.getElementById("display");
function appendToDisplay(input) {
    if (display.value == "ERROR") {
        display.value = "";
    }
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        let result = display.value.replaceAll("÷", "/");
        result = result.replaceAll("×", "*");
        result = eval(result);
        if (result == Infinity) {
            throw new Error();
        }

        result = parseFloat(result.toFixed(5));

        display.value = result;
    } catch (error) {
        display.value = "ERROR";
    }
}
