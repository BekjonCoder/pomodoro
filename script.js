const red = document.getElementById('red');
const blue = document.getElementById('blue');
const green = document.getElementById('green');
const body = document.body;
const minutes = document.getElementById('minute');
const seconds = document.getElementById('second');
const start = document.querySelector('.start');
const settingButton = document.querySelector('.bir1');
const setting = document.querySelector('.setting'); 
const closeButton = document.getElementById('esc'); 
const okButton = document.getElementById('ok'); 
const pomodoroInput = document.getElementById('pomodoro');
const shortBreakInput = document.getElementById('short');
const longBreakInput = document.getElementById('long');

let timeLeft = 25 * 60; 
let countdown;
let running = false;
let defaultTime = 25 * 60;


settingButton.addEventListener('click', () => {
    setting.classList.remove('hidden');
    start.classList.add('hidden');
});

closeButton.addEventListener('click', () => {
    setting.classList.add('hidden');
    start.classList.remove('hidden');

});

function updateDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    minutes.textContent = min < 10 ? '0' + min : min;
    seconds.textContent = sec < 10 ? '0' + sec : sec;
}

function toggleTimer() {
    if (running) {
        clearInterval(countdown);
        running = false;
        start.textContent = "START";
    } else {
        running = true;
        start.textContent = "PAUSE";
        countdown = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(countdown);
                running = false;
                alert("Time's up!");
            }
        }, 1000);
    }
}
function resetTimer() {
    clearInterval(countdown);
    running = false;
    timeLeft = defaultTime;
    updateDisplay();
    start.textContent = "START";
}

function setTime(newTime, color) {
    clearInterval(countdown);
    running = false;
    defaultTime = newTime;
    timeLeft = defaultTime;
    updateDisplay();
    start.textContent = "START";
    body.style.background = color;
}

red.addEventListener('click', () => setTime(25 * 60, '#d94d4d'));
blue.addEventListener('click', () => setTime(5 * 60, '#1997cd'));
green.addEventListener('click', () => setTime(15 * 60, '#2b904b'));
start.addEventListener('click', toggleTimer);

okButton.addEventListener('click', () => {
    const pomodoroTime = parseInt(pomodoroInput.value) * 60 || 25 * 60;
    const shortBreakTime = parseInt(shortBreakInput.value) * 60 || 5 * 60;
    const longBreakTime = parseInt(longBreakInput.value) * 60 || 15 * 60;

    red.addEventListener('click', () => setTime(pomodoroTime, '#d94d4d'));
    blue.addEventListener('click', () => setTime(shortBreakTime, '#1997cd'));
    green.addEventListener('click', () => setTime(longBreakTime, '#2b904b'));

    setting.classList.add('hidden'); 
    start.classList.remove('hidden'); 
});

