const $timer = $("#js-timer");
const $displayStatus = $("#js-display-status");
const $displayTimeLeft = $("#js-display-time-left");

const $displayCompletedPomodoros = $("#js-display-completed");
const $displayPomodorosLeftToLongBreak = $("#js-display-left-to-long-break");

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