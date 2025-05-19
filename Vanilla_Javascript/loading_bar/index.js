const barContainer = document.getElementById("barContainer");
const bar = document.getElementById("bar");
const percentage = document.getElementById("percentage");
const loadButton = document.getElementById("loadButton");
const resetButton = document.getElementById("resetButton");
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const secondsInput = document.getElementById("secondsInput");
bar.style.width = "0%";
const load = async () => {
    let clickedReset = false;
    if (Number(secondsInput.value) === 0) {
        bar.style.width = "100%";
        percentage.textContent = "100%";
        return;
    }
    if (Number(secondsInput.value) < 0) {
        reset();
        return;
    }
    resetButton.addEventListener("click", () => {
        clickedReset = true;
    });
    loadButton.disabled = true;
    loadButton.style.backgroundColor = "gray";
    loadButton.style.color = "black";
    let percent = 0;
    bar.style.width = `${percent}%`;
    percentage.textContent = `${percent}%`;
    const seconds = Number(secondsInput.value);
    for (let i = 0; i <= 100; i++) {
        if (clickedReset) {
            break;
        }
        bar.style.width = `${percent}%`;
        percentage.textContent = `${percent}%`;
        percent++;
        await sleep(seconds * 10);
    }
    loadButton.style.backgroundColor = "hsl(114, 100%, 50%)";
    loadButton.disabled = false;
};
function reset() {
    bar.style.width = "0%";
    percentage.textContent = "0%";
}
