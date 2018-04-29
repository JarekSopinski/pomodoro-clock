/*
TODO:
1) Help pop-up
2) Reset button?
 */

const $timer = $("#js-timer");
const $displayStatus = $("#js-display-status");
const $displayTimeLeft = $("#js-display-time-left");

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

const settingsChangeAbortedMsg = "You can't change length while the timer is running. Please, stop the timer first. Keep in mind that changing session's length will restart current session.";

// variables keeping setIntervals, need to be declared outside so that startOrStopTimer() can access them:
let subtractMinutes;
let subtractSeconds;

const maxSessionOrBreakLength = 60;
const minSessionOrBreakLength = 0;

let state = {};

const initialState = {
    isTimerRunning: false,
    isTimerPaused: false,
    status: "session",
    sessionLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    sessionsCompleted: 0,
    sessionsLeftToLongBreak: 4
};

/*
isTimerRunning and isTimerPaused are totally different things!
isTimerPaused is false before user starts timer for the very first time, than it's true every time user stops the timer.
It determines if startCounter() should be based on session's / breaks' length values or previous counter values.
*/

const counter = {
    minutes: 0,
    seconds: 0
};

const setInitialState = () => state = $.extend(true, {}, initialState);

const changeSettings = (sessionOrBreak, action) => {

    if (state.isTimerRunning) { alert(settingsChangeAbortedMsg) }

    else {
        switch (sessionOrBreak) {
            case "session":
                setSessionLength(action);
                $displaySessionLength.text(state.sessionLength);
                state.sessionLength < 10?
                    $displayTimeLeft.text(`0${state.sessionLength}:00`)
                    :
                    $displayTimeLeft.text(`${state.sessionLength}:00`);
                break;
            case "shortBreak":
                setShortBreakLength(action);
                $displayShortBreakLength.text(state.shortBreakLength);
                break;
            case "longBreak":
                setLongBreakLength(action);
                $displayLongBreakLengthBtn.text(state.longBreakLength)
        }
    }

    state.isTimerPaused = false // required, otherwise timer would start with paused time

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

const toggleTimer = () => {

    switch (state.isTimerRunning) {
        case true:
            clearInterval(subtractMinutes);
            clearInterval(subtractSeconds);
            state.isTimerRunning = false;
            state.isTimerPaused = true;
            break;
        case false:
            state.isTimerRunning = true;
            startCounter(state.status);
            state.isTimerPaused = false; // has to be after startCounter, otherwise restarting from current time won't work!
    }


};

const startCounter = (sessionOrBreak) => {

    switch (sessionOrBreak) {
        case "session":
            if (!state.isTimerPaused) { counter.minutes = state.sessionLength }
            subtractMinutesAndSeconds();
            setTimeout(endSession, (counter.minutes * 60) * 100); //TODO: add 0 to end debugging
            break;
        case "shortBreak":
            if (!state.isTimerPaused) { counter.minutes = state.shortBreakLength }
            subtractMinutesAndSeconds();
            setTimeout(endBreak, (counter.minutes * 60) * 100); //TODO: add 0 to end debugging
            break;
        case "longBreak":
            if (!state.isTimerPaused) { counter.minutes = state.longBreakLength }
            subtractMinutesAndSeconds();
            setTimeout(endBreak, (counter.minutes * 60) * 100); //TODO: add 0 to end debugging
    }

};

const subtractMinutesAndSeconds = () => {

    // After pause if over, seconds always restart with previous value.
    // The only exception is initial launch, when they need to start from whole minute (60):
    if (!state.isTimerPaused) { counter.seconds = 60 }

    if (state.isTimerRunning) {

        subtractMinutes = setInterval(() => counter.minutes--, 6000); //TODO: add 0 to end debugging
        // runs every 60 000 milliseconds = one minute

        subtractSeconds = setInterval(() => {

            counter.seconds--;

            let displayedSeconds;
            let displayedMinutes;

            // if seconds is a one digit number, it has to be preceded by 0;
            counter.seconds < 10 ?
                displayedSeconds = `0${counter.seconds}`
                :
                displayedSeconds = counter.seconds;

            // in case of minutes, it's replaced by 00 if 1 or also preceded by 0 (if 2-9)
            if (counter.minutes === 1) {displayedMinutes = "00"}
            else if (counter.minutes > 1 && counter.minutes < 10) {displayedMinutes = `0${counter.minutes - 1}`}
            else {displayedMinutes = counter.minutes - 1}
            // displayed minute (bigger than 1) always has to be subtracted by 1!

            $displayTimeLeft.text(`${displayedMinutes}:${displayedSeconds}`);

            if (counter.seconds === 0) {counter.seconds = 60} // minute reset after 60 seconds

        }, 100); //TODO: add 0 to end debugging
        // runs every one second

    }

};

const startSession = () => {

    const currentSessionNumber = state.sessionsCompleted + 1;

    if (state.sessionsLeftToLongBreak === 0) {
        state.sessionsLeftToLongBreak = 4;
        $displaySessionsLeftToLongBreak.text(state.sessionsLeftToLongBreak);
    }

    state.status = "session";
    $displayStatus.text(`Session #${currentSessionNumber}`);
    startCounter(state.status)

};

const endSession = () => {

    clearInterval(subtractMinutes);
    clearInterval(subtractSeconds);
    $displayTimeLeft.text("00:00");

    state.sessionsCompleted ++;
    $displayCompletedSessions.text(state.sessionsCompleted);
    state.sessionsLeftToLongBreak --;
    $displaySessionsLeftToLongBreak.text(state.sessionsLeftToLongBreak);

    startBreak()

};

const startBreak = () => {

    let isLongBreak;
    state.sessionsLeftToLongBreak === 0 ? isLongBreak = true : isLongBreak = false;

    switch (isLongBreak) {
        case true:
            state.status = "longBreak";
            $displayStatus.text("Long break");
            startCounter(state.status);
            break;
        default:
            state.status = "shortBreak";
            $displayStatus.text("Short break");
            startCounter(state.status)
    }

};

const endBreak = () => {

    clearInterval(subtractMinutes);
    clearInterval(subtractSeconds);
    $displayTimeLeft.text("00:00");
    startSession()

};


$(document).ready(() => {

    setInitialState();

    $timer.on("click", toggleTimer);

    $increaseSessionLengthBtn.on("click", () => changeSettings("session", "increment"));
    $decreaseSessionLengthBtn.on("click", () => changeSettings("session", "decrement"));
    $increaseShortBreakLengthBtn.on("click", () => changeSettings("shortBreak", "increment"));
    $decreaseShortBreakLengthBtn.on("click", () => changeSettings("shortBreak", "decrement"));
    $increaseLongBreakLengthBtn.on("click", () => changeSettings("longBreak", "increment"));
    $decreaseLongBreakLengthBtn.on("click", () => changeSettings("longBreak", "decrement"))

});