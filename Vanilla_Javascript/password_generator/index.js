function generatePassword() {
    const passwordLength = document.getElementById("length").value;
    const includeLower = document.getElementById("lowercase").checked;
    const includeUpper = document.getElementById("uppercase").checked;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSymbols = document.getElementById("symbols").checked;
    let password = [];
    let options = [];
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "1234567890";
    const symbols = "!@#$%^&*/+=-_";
    if (includeLower) {
        options = [...options, ...characters];
    }
    if (includeUpper) {
        options = [...options, ...characters.toUpperCase()];
    }
    if (includeNumbers) {
        options = [...options, ...numbers];
    }
    if (includeSymbols) {
        options = [...options, ...symbols];
    }
    for (let i = 0; i < Number(passwordLength); i++) {
        let randomIndex = Math.floor(Math.random() * options.length);
        password.push(options[randomIndex]);
    }
    document.getElementById("result").textContent = password.join("");
}
