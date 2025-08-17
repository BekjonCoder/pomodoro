document.addEventListener("DOMContentLoaded", () => {
  // DISPLAY ELEMENTS
  const minuteDisplay = document.getElementById("minute");
  const secondDisplay = document.getElementById("second");
  const startBtn = document.querySelector(".start-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const body = document.body;
  const progressBar = document.querySelector(".progress-inner");
  const quoteText = document.getElementById("quote-text");

  // MODALS & BUTTONS
  const settingsModal = document.querySelector(".settings-modal");
  const reportModal = document.querySelector(".report-modal");
  const loginModal = document.querySelector(".login-modal");

  const openSettingsBtn = document.querySelector(".settings-open-btn");
  const closeSettingsBtn = document.querySelector(".close-settings");
  const saveSettingsBtn = document.querySelector(".save-settings-btn");

  const openReportBtn = document.querySelector(".report-btn");
  const closeReportBtn = document.querySelector(".close-report");

  const openLoginBtn = document.querySelector(".login-btn");
  const closeLoginBtn = document.querySelector(".close-login");
  const saveLoginBtn = document.querySelector(".save-login-btn");
  const usernameInput = document.getElementById("username-input");

  // INPUTS
  const pomodoroInput = document.getElementById("pomodoro-input");
  const shortInput = document.getElementById("short-input");
  const longInput = document.getElementById("long-input");
  const colorInputs = document.querySelectorAll("input[name='color']");

  // REPORT text
  const reportText = document.getElementById("report-text");

  // Quotes
  const quotes = [
    "Stay focused and keep going!",
    "You're doing great!",
    "One step at a time.",
    "Keep pushing forward!",
    "Small progress is still progress."
  ];

  let time = 25 * 60;
  let timer;
  let isRunning = false;
  let defaultTime = 25 * 60;

  let completedPomodoros = 0;
  let totalWorkTime = 0;

  function updateDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    minuteDisplay.textContent = String(minutes).padStart(2, "0");
    secondDisplay.textContent = String(seconds).padStart(2, "0");
    updateProgressBar();
  }

  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.textContent = "STOP";
      timer = setInterval(() => {
        if (time > 0) {
          time--;
          updateDisplay();
        } else {
          clearInterval(timer);
          isRunning = false;
          startBtn.textContent = "START";
          completedPomodoros++;
          totalWorkTime += defaultTime / 60;
          renderReport();
          displayNewQuote(); // show new motivational quote
          time = defaultTime;
          updateDisplay();
        }
      }, 1000);
    } else {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "START";
    }
  }

  function updateProgressBar() {
    if (defaultTime === 0) return;
    const percent = ((defaultTime - time) / defaultTime) * 100;
    progressBar.style.width = `${percent}%`;
  }

  function displayNewQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = randomQuote;
  }

  function changeMode(mode) {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "START";

    modeButtons.forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`${mode}-mode`).classList.add("active");

    if (mode === "pomodoro") {
      defaultTime = 25 * 60;
      body.style.background = "linear-gradient(135deg, #d94d4d, #ff5757)";
    } else if (mode === "short") {
      defaultTime = 5 * 60;
      body.style.background = "linear-gradient(135deg, #4d79d9, #6d95ff)";
    } else {
      defaultTime = 15 * 60;
      body.style.background = "linear-gradient(135deg, #4dd98b, #6ff5af)";
    }
    time = defaultTime;
    updateDisplay();
    progressBar.style.width = "0%";
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    time = defaultTime;
    startBtn.textContent = "START";
    updateDisplay();
    progressBar.style.width = "0%";
  }

  function openModal(modal) {
    modal.classList.remove("hidden");
  }
  function closeModal(modal) {
    modal.classList.add("hidden");
  }

  function applySettings() {
    if (pomodoroInput.value) defaultTime = pomodoroInput.value * 60;
    if (shortInput.value && document.getElementById("short-mode").classList.contains("active")) {
      defaultTime = shortInput.value * 60;
    }
    if (longInput.value && document.getElementById("long-mode").classList.contains("active")) {
      defaultTime = longInput.value * 60;
    }
    colorInputs.forEach((input) => {
      if (input.checked) {
        let color = input.getAttribute("data-color");
        if (color === "red") body.style.background = "linear-gradient(135deg, #d94d4d, #ff5757)";
        if (color === "blue") body.style.background = "linear-gradient(135deg, #4d79d9, #6d95ff)";
        if (color === "green") body.style.background = "linear-gradient(135deg, #4dd98b, #6ff5af)";
      }
    });
    time = defaultTime;
    updateDisplay();
    progressBar.style.width = "0%";
    closeModal(settingsModal);
  }

  function renderReport() {
    if (completedPomodoros === 0) {
      reportText.textContent = "No sessions completed yet.";
    } else {
      reportText.textContent = `Pomodoros completed: ${completedPomodoros}\nTotal work time: ${totalWorkTime} minutes`;
    }
  }

  function saveLogin() {
    const username = usernameInput.value.trim();
    if (username) {
      localStorage.setItem("pomodoroUser", username);
      document.querySelector(".login-btn").innerHTML =
        `<i class="fa-solid fa-circle-user"></i> ${username}`;
      closeModal(loginModal);
    }
  }

  const savedUser = localStorage.getItem("pomodoroUser");
  if (savedUser) {
    document.querySelector(".login-btn").innerHTML =
      `<i class="fa-solid fa-circle-user"></i> ${savedUser}`;
  }

  /* ------------------- EVENT LISTENERS -------------------- */
  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);

  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.id.split("-")[0];
      changeMode(mode);
    });
  });

  openSettingsBtn.addEventListener("click", () => openModal(settingsModal));
  closeSettingsBtn.addEventListener("click", () => closeModal(settingsModal));
  saveSettingsBtn.addEventListener("click", applySettings);

  openReportBtn.addEventListener("click", () => { renderReport(); openModal(reportModal) });
  closeReportBtn.addEventListener("click", () => closeModal(reportModal));

  openLoginBtn.addEventListener("click", () => openModal(loginModal));
  closeLoginBtn.addEventListener("click", () => closeModal(loginModal));
  saveLoginBtn.addEventListener("click", saveLogin);

  /* Initial */
  updateDisplay();
  displayNewQuote();
});
