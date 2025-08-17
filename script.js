document.addEventListener("DOMContentLoaded", () => {
  const minuteDisplay = document.getElementById("minute");
  const secondDisplay = document.getElementById("second");
  const startBtn = document.querySelector(".start-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const body = document.body;

  // M O D A L S (new class names!)
  const settingsModal = document.querySelector(".settings-modal");
  const reportModal = document.querySelector(".report-modal");
  const loginModal   = document.querySelector(".login-modal");

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

  function changeMode(mode) {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "START";

    modeButtons.forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`${mode}-mode`).classList.add("active");

    if (mode === "pomodoro") {
      defaultTime = 25 * 60;
      body.style.backgroundColor = "#d94d4d";
    } else if (mode === "short") {
      defaultTime = 5 * 60;
      body.style.backgroundColor = "#4d79d9";
    } else {
      defaultTime = 15 * 60;
      body.style.backgroundColor = "#4dd98b";
    }
    time = defaultTime;
    updateDisplay();
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    time = defaultTime;
    startBtn.textContent = "START";
    updateDisplay();
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
        if (color === "red") body.style.backgroundColor = "#d94d4d";
        if (color === "blue") body.style.backgroundColor = "#4d79d9";
        if (color === "green") body.style.backgroundColor = "#4dd98b";
      }
    });
    time = defaultTime;
    updateDisplay();
    closeModal(settingsModal);
  }

  function renderReport() {
    if (completedPomodoros === 0) {
      reportText.textContent = "No sessions completed yet.";
    } else {
      reportText.textContent =
        `Pomodoros completed: ${completedPomodoros}\nTotal work time: ${totalWorkTime} minutes`;
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

  // Event listeners
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

  updateDisplay();
});
