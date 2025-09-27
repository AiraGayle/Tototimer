// Get elements
const changeBtn = document.querySelector(".set-timer-btn");
const setTimerSection = document.querySelector(".set-timer-section");
const setTimerFields = document.querySelector(".set-timer-fields");
const hoursInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");
const setTimerBtn = document.querySelector(".set-time-confirm");
const cancelTimerBtn = document.querySelector(".set-time-cancel");

const timerDisplay = document.querySelector(".timer-display .timer-text");

const startBtn = document.querySelector(".start-timer-btn");
const timerControls = document.querySelector(".timer-controls");
const timerOn = document.querySelector(".timer-on");
const pauseBtn = document.querySelector(".pause-timer-btn");
const stopBtn = document.querySelector(".stop-timer-btn");

const timerDone = document.querySelector(".timer-done");
const restartTimerBtn = document.querySelector(".restart-timer-btn");
const backBtn = document.querySelector(".back-btn");

const nameHeader = document.querySelector(".name");

const bgMusic = document.getElementById("bg-music");
const alarmSound = document.getElementById("alarm-sound");

const bgImg = document.querySelector('img');

// State
let totalSeconds = 0;       // float! not just integer
let initialSeconds = 0;
let timeoutId = null;
let endTime = null;
let lastRenderedSecond = null;

// Split time for rendering
function splitTime(s) {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return { hrs, mins, secs };
}

// Render into section
function renderToSection(sectionEl, s) {
    const { hrs, mins, secs } = splitTime(s);
    const h = sectionEl.querySelector(".hours");
    const m = sectionEl.querySelector(".minutes");
    const sec = sectionEl.querySelector(".seconds");
    const hColon = sectionEl.querySelector("#h-colon");
    const mColon = sectionEl.querySelector("#m-colon");

    h.textContent = String(hrs).padStart(2, "0");
    m.textContent = String(mins).padStart(2, "0");
    sec.textContent = String(secs).padStart(2, "0");

    if (hrs == 0) {
        if (mins == 0) {
            h.style.display = "none";
            if (hColon) hColon.style.display = "none";
            m.style.display = "none";
            if (mColon) mColon.style.display = "none";
        } else {
            h.style.display = "none";
            if (hColon) hColon.style.display = "none";
            m.style.display = "inline";
            if (mColon) mColon.style.display = "inline";
        }
    } else {
        h.style.display = "inline";
        if (hColon) hColon.style.display = "inline";
        m.style.display = "inline";
        if (mColon) mColon.style.display = "inline";
    }
}

// Countdown loop
function tick() {
    const remaining = Math.max(0, (endTime - Date.now()) / 1000); // float seconds
    const display = Math.ceil(remaining); // only round for display

    if (display !== lastRenderedSecond) {
        renderToSection(timerOn, display);
        lastRenderedSecond = display;
    }

    if (remaining > 0) {
        timeoutId = setTimeout(tick, 200); // check ~5 times/sec
    } else {
        timeoutId = null;
        endTimer();
    }
}

// Start countdown
function startCountdown() {
    renderToSection(timerOn, totalSeconds);

    endTime = Date.now() + totalSeconds * 1000;
    lastRenderedSecond = null;

    tick();
}

// Pause timer
function pauseTimer() {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;

        totalSeconds = Math.max(0, (endTime - Date.now()) / 1000); // save float!

        pauseBtn.textContent = "Resume";
        pauseBtn.removeEventListener("click", pauseTimer);
        pauseBtn.addEventListener("click", resumeTimer);
        bgMusic.pause();
    }
}

// Resume timer
function resumeTimer() {
    if (totalSeconds > 0 && timeoutId === null) {
        endTime = Date.now() + totalSeconds * 1000; // rebuild endTime with float
        lastRenderedSecond = null;

        pauseBtn.textContent = "Pause";
        pauseBtn.removeEventListener("click", resumeTimer);
        pauseBtn.addEventListener("click", pauseTimer);

        bgMusic.play();
        tick();
    }
}

// Stop timer
function stopTimer() {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    totalSeconds = initialSeconds;
    renderToSection(timerControls, Math.ceil(totalSeconds));
    stopMusic();
    nameHeader.textContent = "Totoro wants to take a nap";
    bgImg.src = "assets/Totoro.PNG"
    timerOn.style.display = "none";
    timerControls.style.display = "flex";
}

// Timer has ended
function endTimer() {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    totalSeconds = initialSeconds;
    renderToSection(timerControls, Math.ceil(totalSeconds));
    stopMusic();
    startAlarm();
    nameHeader.textContent = "Totoro is startled awake";
    bgImg.src = "assets/Totoro_Startled.PNG";
    timerOn.style.display = "none";
    timerDone.style.display = "flex";
}

function startMusic() {
    bgMusic.currentTime = 0;
    bgMusic.play();
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function startAlarm() {
    alarmSound.currentTime = 0;
    alarmSound.play();
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 6;
}

// Changing time, show section
changeBtn.addEventListener("click", () => {
    setTimerSection.style.display = "flex";
    timerControls.style.display = "none";
    const firstInput = setTimerSection.querySelector("input");
    if (firstInput) firstInput.focus();
});

// Get timer input
setTimerBtn.addEventListener("click", () => {
    const hrs = parseInt(hoursInput.value) || 0;
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;

    totalSeconds = hrs * 3600 + mins * 60 + secs;
    initialSeconds = totalSeconds;

    renderToSection(timerControls, Math.ceil(totalSeconds));
    setTimerSection.style.display = "none";
    timerControls.style.display = "flex";
});

// Cancel setting timer
cancelTimerBtn.addEventListener("click", () => {
    setTimerSection.style.display = "none";
    timerControls.style.display = "flex";
});

// Start timer
startBtn.addEventListener("click", () => {
    if (totalSeconds <= 0) {
        totalSeconds = initialSeconds;
    }

    if (totalSeconds > 0) {
        nameHeader.textContent = "Totoro is sleeping";
        bgImg.src = "assets/Totoro_Sleeping.PNG";
        timerControls.style.display = "none";
        timerOn.style.display = "flex";

        pauseBtn.textContent = "Pause";
        pauseBtn.removeEventListener("click", resumeTimer);
        pauseBtn.addEventListener("click", pauseTimer);

        startMusic();
        startCountdown();
    }
});

stopBtn.addEventListener("click", stopTimer);

// Restart timer after it ends
restartTimerBtn.addEventListener("click", () => {
    nameHeader.textContent = "Totoro is sleeping";
    bgImg.src = "assets/Totoro_Sleeping.PNG"
    timerDone.style.display = "none";
    timerOn.style.display = "flex";

    pauseBtn.textContent = "Pause";
    pauseBtn.removeEventListener("click", resumeTimer);
    pauseBtn.addEventListener("click", pauseTimer);

    totalSeconds = initialSeconds;
    renderToSection(timerOn, Math.ceil(totalSeconds));
    stopAlarm();
    startMusic();
    startCountdown();
});

// Go back to home after timer ends
backBtn.addEventListener("click", () => {
    nameHeader.textContent = "Totoro wants to take a nap";
    bgImg.src = "assets/Totoro.PNG"
    timerDone.style.display = "none";
    timerControls.style.display = "flex";
    stopMusic();
    stopAlarm();
    renderToSection(timerControls, Math.ceil(totalSeconds));
});
