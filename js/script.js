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

let state = {};

const initialState = {
    isTimeRunning: false,
    status: "session",
    sessionLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    sessionsCompleted: 0,
    sessionsLeftToLongBreak: 4
};

const counter = {
    minutes: 0,
    seconds: 0
};

// variables keeping setIntervals, need to be declared outside so that startOrStopTimer() can access them:
let subtractMinutes;
let subtractSeconds;

const settingsChangeAbortedMsg = "You can't change length while the timer is running. Please, stop the timer first. Keep in mind that changing session's length will restart current session.";

const setInitialState = () => state = $.extend(true, {}, initialState);

const setSessionLength = action => action === "increment" ? state.sessionLength++ : state.sessionLength--;
const setShortBreakLength = action => action === "increment" ? state.shortBreakLength++ : state.shortBreakLength--;
const setLongBreakLength = action => action === "increment" ? state.longBreakLength++ : state.longBreakLength--;

const changeSettings = (sessionOrBreak, action) => {

    if (state.isTimeRunning) { alert(settingsChangeAbortedMsg) }

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

};

const startOrStopTimer = () => {

    //TODO: Keep track of current time after pausing timer

    switch (state.isTimeRunning) {
        case true:
            state.isTimeRunning = false;
            clearInterval(subtractMinutes);
            clearInterval(subtractSeconds);
            break;
        case false:
            state.isTimeRunning = true;
            startCounter()
    }


};

const startCounter = () => {

    counter.minutes = state.sessionLength;
    counter.seconds = 60;

    subtractMinutesAndSeconds();
    setTimeout(endSession, (state.sessionLength * 60) * 1000);

};

const subtractMinutesAndSeconds = () => {

    if (state.isTimeRunning) {

        subtractMinutes = setInterval(() => counter.minutes--, 60000); // runs every 60 000 milliseconds = one minute

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

        }, 1000); // runs every one second

    }

};

const endSession = () => {

    clearInterval(subtractMinutes);
    clearInterval(subtractSeconds);
    $displayTimeLeft.text("00:00");
    // 3 lines above are temporary, until start break function is ready!

    state.sessionsCompleted ++;
    $displayCompletedSessions.text(state.sessionsCompleted);
    state.sessionsLeftToLongBreak --;
    $displaySessionsLeftToLongBreak.text(state.sessionsLeftToLongBreak);

    if (state.sessionsLeftToLongBreak > 0) {
        state.status = "shortBreak";
        $displayStatus.text("Short break")
        // startShortBreak()
    } else {
        state.status = "longBreak";
        $displayStatus.text("Long break")
        // startLongBreak()
    }

};

$(document).ready(() => {

    setInitialState();

    $timer.on("click", startOrStopTimer);

    $increaseSessionLengthBtn.on("click", () => changeSettings("session", "increment"));
    $decreaseSessionLengthBtn.on("click", () => changeSettings("session", "decrement"));
    $increaseShortBreakLengthBtn.on("click", () => changeSettings("shortBreak", "increment"));
    $decreaseShortBreakLengthBtn.on("click", () => changeSettings("shortBreak", "decrement"));
    $increaseLongBreakLengthBtn.on("click", () => changeSettings("longBreak", "increment"));
    $decreaseLongBreakLengthBtn.on("click", () => changeSettings("longBreak", "decrement"))

});