const $timer = $("#js-timer");
const $timerFiller = $("#js-timer_filler");
const $displayStatus = $("#js-display-status");
const $displayTimeLeft = $("#js-display-time-left");

const $helpPopUp = $("#js-help-popup");
const $showHelpPopupBtn = $("#js-help-btn");
const $closeHelpPopupBtn = $("#js-help-popup_close-btn");

const $displayCompletedSessions = $("#js-display-completed");
const $displaySessionsLeftToLongBreak = $("#js-display-left-to-long-break");

const $increaseSessionLengthBtn = $("#js-increase-session-btn");
const $decreaseSessionLengthBtn = $("#js-decrease-session-btn");
const $displaySessionLength = $("#js-display-session-length");

const $increaseShortBreakLengthBtn = $("#js-increase-short-break-btn");
const $decreaseShortBreakLengthBtn = $("#js-decrease-short-break-btn");
const $displayShortBreakLength = $("#js-display-short-break-length");

const $increaseLongBreakLengthBtn = $("#js-increase-long-break-btn");
const $decreaseLongBreakLengthBtn = $("#js-decrease-long-break-btn");
const $displayLongBreakLengthBtn = $("#js-display-long-break-length");

const $resetBtn = $("#js-reset-btn");

const settingsChangeAbortedMsg = "You can't change length while the timer is running. Please, stop the timer first. Keep in mind that changing session's length will restart current session.";
const maxSessionOrBreakLength = 60;
const minSessionOrBreakLength = 0;

let secondsInterval;
let sessionTimeout;
let shortBreakTimeout;
let longBreakTimeout;

let state = {};

const initialState = {
    isTimerInitialized: false,
    isTimerRunning: false,
    status: "session",
    sessionLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    sessionsCompleted: 0,
    sessionsLeftToLongBreak: 4
};

const counter = {
    minutesToSessionEnd: 0,
    secondsToSessionEnd: 0,
    secondsInCurrentSession: 0,
    secondsInCurrentMinute: 0
};

//******************************  SETTINGS ******************************

const setInitialState = (type) => {

    switch (type) {
        case "initialization":
            state = $.extend(true, {}, initialState);
            displayInitialValues();
            break;
        case "reset":
            stopCountingTime();
            $timerFiller.css({"height": "0"});
            const sessionsCompleted = state.sessionsCompleted;
            state = $.extend(true, {}, initialState);
            state.sessionsCompleted = sessionsCompleted;
            displayInitialValues()
    }

};

const displayInitialValues = () => {

    $displaySessionLength.text(state.sessionLength);
    $displayShortBreakLength.text(state.shortBreakLength);
    $displayLongBreakLengthBtn.text(state.longBreakLength);

    $displayStatus.text("Session #1");
    state.sessionLength < 10?
        $displayTimeLeft.text(`0${state.sessionLength}:00`)
        :
        $displayTimeLeft.text(`${state.sessionLength}:00`);

    $displayCompletedSessions.text(state.sessionsCompleted);
    $displaySessionsLeftToLongBreak.text(state.sessionsLeftToLongBreak);

};

const changeSettings = (status, action) => {

    if (state.isTimerRunning) { alert(settingsChangeAbortedMsg) }

    else {

        switch (status) {

            case "session":
                setSessionLength(action);
                $displaySessionLength.text(state.sessionLength);
                displayNewLengthInsideTimer(status, state.sessionLength);
                resetCounterAfterChangingSettings(status, state.sessionLength);
                break;

            case "shortBreak":
                setShortBreakLength(action);
                $displayShortBreakLength.text(state.shortBreakLength);
                displayNewLengthInsideTimer(status, state.shortBreakLength);
                resetCounterAfterChangingSettings(status, state.shortBreakLength);
                break;

            case "longBreak":
                setLongBreakLength(action);
                $displayLongBreakLengthBtn.text(state.longBreakLength);
                displayNewLengthInsideTimer(status, state.longBreakLength);
                resetCounterAfterChangingSettings(status, state.longBreakLength)
        }

    }

};

const setSessionLength = action => {
    action === "increment" ?
        state.sessionLength ++
        :
        state.sessionLength --;

    state.sessionLength === minSessionOrBreakLength && state.sessionLength ++;
    state.sessionLength === maxSessionOrBreakLength && state.sessionLength --
};

const setShortBreakLength = action => {
    action === "increment" ?
        state.shortBreakLength ++
        :
        state.shortBreakLength --;

    state.shortBreakLength === minSessionOrBreakLength && state.shortBreakLength ++;
    state.shortBreakLength === maxSessionOrBreakLength && state.shortBreakLength --
};

const setLongBreakLength = action => {
    action === "increment" ?
        state.longBreakLength++
        :
        state.longBreakLength--;

    state.longBreakLength === minSessionOrBreakLength && state.longBreakLength ++;
    state.longBreakLength === maxSessionOrBreakLength && state.longBreakLength --
};

const resetCounterAfterChangingSettings = (status, newLength) => {

    if (status === state.status) {

        counter.secondsInCurrentSession = newLength * 60;
        counter.secondsToSessionEnd = newLength * 60;
        counter.minutesToSessionEnd = newLength;
        counter.secondsInCurrentMinute = 60

    }

};

const displayNewLengthInsideTimer = (status, newLength) => {

    if (status === state.status) {

        newLength < 10?
            $displayTimeLeft.text(`0${newLength}:00`)
            :
            $displayTimeLeft.text(`${newLength}:00`);

    }

};

//****************************** COUNTING TIME ******************************

const toggleTimer = () => {

    switch (state.isTimerRunning) {
        case true:
            stopCountingTime();
            state.isTimerRunning = false;
            break;
        case false:
            startCountingTime(state.status);
            state.isTimerRunning = true;
    }

    if (!state.isTimerInitialized) { state.isTimerInitialized = true }

};

const startCountingTime = (sessionOrBreak) => {

    switch (sessionOrBreak) {

        case "session":
            calculateTime(state.sessionLength);
            secondsInterval = setInterval(subtractSeconds, 200);
            !state.isTimerInitialized ?
                sessionTimeout = setTimeout(endSession, counter.secondsInCurrentSession * 200)
                :
                sessionTimeout = setTimeout(endSession, counter.secondsToSessionEnd * 200);
            break;

        case "shortBreak":
            calculateTime(state.shortBreakLength);
            secondsInterval = setInterval(subtractSeconds, 100);
            !state.isTimerInitialized ?
                shortBreakTimeout = setTimeout(endBreak, counter.secondsInCurrentSession * 100)
                :
                shortBreakTimeout = setTimeout(endBreak, counter.secondsToSessionEnd * 100);
            break;

        case "longBreak":
            calculateTime(state.longBreakLength);
            secondsInterval = setInterval(subtractSeconds, 100);
            !state.isTimerInitialized ?
                longBreakTimeout = setTimeout(endBreak, counter.secondsInCurrentSession * 100)
                :
                longBreakTimeout = setTimeout(endBreak, counter.secondsToSessionEnd * 100);

    }

};

const calculateTime = (initialLengthFromSettings) => {

    counter.secondsInCurrentSession = initialLengthFromSettings * 60;

    if (!state.isTimerInitialized) {
        counter.secondsInCurrentMinute = 60;
        counter.secondsToSessionEnd = initialLengthFromSettings * 60;
    }

};

const subtractSeconds = () => {

    let displayedSeconds;
    let displayedMinutes;

    counter.secondsToSessionEnd --;
    counter.secondsInCurrentMinute--;
    counter.minutesToSessionEnd = Math.ceil(counter.secondsToSessionEnd / 60);

    if (counter.secondsInCurrentMinute > 0) {

        counter.secondsInCurrentMinute < 10 ?
            displayedSeconds = `0${counter.secondsInCurrentMinute}`
            :
            displayedSeconds = counter.secondsInCurrentMinute;

        if (counter.minutesToSessionEnd === 0) {
            displayedMinutes = "00"
        }
        else if (counter.minutesToSessionEnd > 0 && counter.minutesToSessionEnd < 11) {
            displayedMinutes = `0${ counter.minutesToSessionEnd - 1}`
        }
        else {
            displayedMinutes = counter.minutesToSessionEnd - 1
        }

        $displayTimeLeft.text(`${displayedMinutes}:${displayedSeconds}`);

    }

    else {
        displayedMinutes = counter.minutesToSessionEnd;
        $displayTimeLeft.text(`${displayedMinutes}:00`);
        counter.secondsInCurrentMinute = 60
    }

    fillTimerWithColor();

};

const fillTimerWithColor = () => {

    const difference = counter.secondsInCurrentSession - counter.secondsToSessionEnd;
    const fillHeightPercentage = ((difference / counter.secondsInCurrentSession) * 100).toFixed(0);

    const sessionRed = "#D90429";
    const breakGreen = "#248232";
    let bgColor;
    state.status === "session" ? bgColor = sessionRed : bgColor = breakGreen;

    $timerFiller.css({
        "background-color": bgColor,
        "height": fillHeightPercentage + "%"
    })
};

const stopCountingTime = () => {

    clearInterval(secondsInterval);

    switch (state.status) {
        case "session":
            clearTimeout(sessionTimeout);
            break;
        case "shortBreak":
            clearTimeout(shortBreakTimeout);
            break;
        case "longBreak":
            clearTimeout(longBreakTimeout)
    }

};


//****************************** SESSION-BREAK LOOP ******************************

const startSession = () => {

    state.isTimerInitialized = false;

    const currentSessionNumber = state.sessionsCompleted + 1;

    if (state.sessionsLeftToLongBreak === 0) {
        state.sessionsLeftToLongBreak = 4;
        $displaySessionsLeftToLongBreak.text(state.sessionsLeftToLongBreak);
    }

    state.status = "session";
    $displayStatus.text(`Session #${currentSessionNumber}`);
    startCountingTime(state.status)

};

const endSession = () => {

    stopCountingTime();
    $displayTimeLeft.text("00:00");

    state.sessionsCompleted ++;
    $displayCompletedSessions.text(state.sessionsCompleted);
    state.sessionsLeftToLongBreak --;
    $displaySessionsLeftToLongBreak.text(state.sessionsLeftToLongBreak);

    startBreak()

};

const startBreak = () => {

    state.isTimerInitialized = false;

    let isLongBreak;
    state.sessionsLeftToLongBreak === 0 ? isLongBreak = true : isLongBreak = false;

    switch (isLongBreak) {
        case true:
            state.status = "longBreak";
            $displayStatus.text("Long break");
            startCountingTime(state.status);
            break;
        default:
            state.status = "shortBreak";
            $displayStatus.text("Short break");
            startCountingTime(state.status)
    }

};

const endBreak = () => {

    stopCountingTime();
    $displayTimeLeft.text("00:00");
    startSession()

};

//****************************** EVENT HANDLERS ******************************

$(document).ready(() => {

    setInitialState("initialization");

    $timer.on("click", toggleTimer);

    $increaseSessionLengthBtn.on("click", () => changeSettings("session", "increment"));
    $decreaseSessionLengthBtn.on("click", () => changeSettings("session", "decrement"));
    $increaseShortBreakLengthBtn.on("click", () => changeSettings("shortBreak", "increment"));
    $decreaseShortBreakLengthBtn.on("click", () => changeSettings("shortBreak", "decrement"));
    $increaseLongBreakLengthBtn.on("click", () => changeSettings("longBreak", "increment"));
    $decreaseLongBreakLengthBtn.on("click", () => changeSettings("longBreak", "decrement"));

    $showHelpPopupBtn.on("click", () => $helpPopUp.removeClass("hidden-item"));
    $closeHelpPopupBtn.on("click", () => $helpPopUp.addClass("hidden-item"));

    $resetBtn.on("click", () => setInitialState("reset"))

});