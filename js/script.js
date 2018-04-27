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
    isTimeRunning: true,
    status: "session",
    sessionLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    sessionsCompleted: 0,
    sessionsLeftToLongBreak: 4
};

const settingsChangeAbortedMsg = "You can't change length while the timer is running. Please, stop the timer first. Keep in mind that changing session's length will restart current session.";

const setInitialState = () => state = $.extend(true, {}, initialState);

const setSessionLength = action => action === "increment" ? state.sessionLength++ : state.sessionLength--;
const setShortBreakLength = action => action === "increment" ? state.shortBreakLength++ : state.shortBreakLength--;
const setLongBreakLength = action => action === "increment" ? state.longBreakLength++ : state.longBreakLength--;

const handleSettingsBtn = (sessionOrBreak, action) => {

    if (state.isTimeRunning) { alert(settingsChangeAbortedMsg) }

    else {
        switch (sessionOrBreak) {
            case "session":
                setSessionLength(action);
                $displaySessionLength.text(state.sessionLength);
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

$(document).ready(() => {

    setInitialState();

    $increaseSessionLengthBtn.on("click", () => handleSettingsBtn("session", "increment"));
    $decreaseSessionLengthBtn.on("click", () => handleSettingsBtn("session", "decrement"));
    $increaseShortBreakLengthBtn.on("click", () => handleSettingsBtn("shortBreak", "increment"));
    $decreaseShortBreakLengthBtn.on("click", () => handleSettingsBtn("shortBreak", "decrement"));
    $increaseLongBreakLengthBtn.on("click", () => handleSettingsBtn("longBreak", "increment"));
    $decreaseLongBreakLengthBtn.on("click", () => handleSettingsBtn("longBreak", "decrement"))

});