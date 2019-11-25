const defaultState = {
  breakLength: 5,
  sessionLength: 25,
  timeLeft: "25:00",
  secondsTime: 1500,
  timer: "",
  onBreak: false,
  timerLabel: "Session" };


const { combineReducers, createStore } = Redux;
const { connect, Provider } = ReactRedux;
const store = Redux.createStore(reducer, defaultState);
const mapStateToProps = function (state) {
  return state;
};
const mapDispatchToProps = function (dispatch) {
  return {
    BREAK_INCREASE: function () {return dispatch({
        type: "BREAK_INCREASE",
        break: this.breakLength < 60 ? this.breakLength + 1 : 60 });},
    BREAK_DECREASE: function () {return dispatch({
        type: "BREAK_DECREASE",
        break: this.breakLength > 1 ? this.breakLength - 1 : 1 });},
    SESSION_INCREASE: function () {return dispatch({
        type: "SESSION_INCREASE",
        session: this.sessionLength < 60 ? this.sessionLength + 1 : 60 });},
    SESSION_DECREASE: function () {return dispatch({
        type: "SESSION_DECREASE",
        session: this.sessionLength > 1 ? this.sessionLength - 1 : 1 });},
    START_STOP: function () {return dispatch({
        type: "START_STOP",
        timer: this.timer === "" ? setInterval(this.REFRESH, 1000) : clearTimer(this.timer),
        secondsTime: this.secondsTime });},
    RESET: function () {return dispatch({
        type: "RESET",
        timer: clearTimer(this.timer) });},
    REFRESH: function () {return dispatch({
        type: "REFRESH" });} };

};

function reducer(state = defaultState, action) {
  switch (action.type) {
    case "BREAK_INCREASE":
      return { ...state, breakLength: action.break };
    case "BREAK_DECREASE":
      return { ...state, breakLength: action.break };
    case "SESSION_INCREASE":
      return { ...state, sessionLength: action.session, timeLeft: formatTimeFromMinutes(action.session), secondsTime: action.session * 60 };
    case "SESSION_DECREASE":
      return { ...state, sessionLength: action.session, timeLeft: formatTimeFromMinutes(action.session), secondsTime: action.session * 60 };
    case "START_STOP":
      return { ...state, timer: action.timer };
    case "RESET":
      playerReset();
      $("#timer").removeClass("border-danger");
      $("#timer").addClass("border-light");
      $("#timer").removeClass("text-danger");
      return Object.assign({}, { timer: action.timer }, defaultState);
    case "REFRESH":
      if (state.secondsTime == 0) {
        playerPlay();
        if (state.onbreak) {
          $("#timer").removeClass("border-danger");
          $("#timer").addClass("border-light");
          $("#timer").removeClass("text-danger");
        } else {
          $("#timer").removeClass("border-light");
          $("#timer").addClass("border-danger");
          $("#timer").addClass("text-danger");
        }
        return { ...state,
          secondsTime: state.onBreak ? state.sessionLength * 60 : state.breakLength * 60,
          onBreak: !state.onBreak ? true : false,
          timeLeft: formatTimeFromMinutes(state.onBreak ? state.sessionLength : state.breakLength),
          timerLabel: state.onBreak ? "Session" : "Break" };
      } else {
        return { ...state, timeLeft: formatTimeFromSeconds(state.secondsTime - 1), secondsTime: state.secondsTime - 1 };}
    default:
      return state;}

}
function playerPlay() {
  let clip = document.getElementById("beep");
  clip.play();
}
function playerReset() {
  let clip = document.getElementById("beep");
  clip.pause();
  clip.currentTime = 0;
}
function clearTimer(timer) {
  clearInterval(timer);
  return "";
}
function formatTimeFromMinutes(time) {
  time *= 60;
  let m = Math.floor(time / 60);
  let s = time % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}
function formatTimeFromSeconds(time) {
  let m = Math.floor(time / 60);
  let s = time % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

class POMODOROCLOCK extends React.Component {
  constructor(props) {
    super(props);
  }
  BREAK_INCREASE() {
    this.props.BREAK_INCREASE();
  }
  BREAK_DECREASE() {
    this.props.BREAK_DECREASE();
  }
  SESSION_INCREASE() {
    this.props.SESSION_INCREASE();
  }
  SESSION_DECREASE() {
    this.props.SESSION_DECREASE();
  }
  START_STOP() {
    this.props.START_STOP();
  }
  RESET() {
    this.props.RESET();
  }
  componentDidMount() {
    this.props.RESET();
  }

  render() {
    return (
      React.createElement("div", {
        id: "wrapper",
        className: "bg-info d-flex flex-column justify-content-center align-items-center text-light container-fluid fill" },

      React.createElement("div", {
        id: "clock",
        className: "d-flex flex-column justify-content-center align-items-center" },

      React.createElement("h1", { id: "header-label", className: "display-4 font-weight-bold" }, "Pomodoro Clock"),


      React.createElement("div", {
        id: "settings",
        className: "d-flex flex-row justify-content-between align-items-center mt-4" },

      React.createElement("div", { id: "break", className: "p-2" },
      React.createElement("h2", { id: "break-label" }, "Break Length"),
      React.createElement("div", {
        id: "break-settings",
        className: "d-flex flex-row justify-content-center align-items-center" },

      React.createElement("button", { id: "break-decrement", className: "btn text-light", onClick: this.BREAK_DECREASE.bind(this) },
      React.createElement("i", { className: "fa fa-lg fa-arrow-down align-baseline" })),

      React.createElement("div", { id: "break-length", className: "h3" },
      this.props.breakLength),

      React.createElement("button", { id: "break-increment", className: "btn text-light", onClick: this.BREAK_INCREASE.bind(this) },
      React.createElement("i", { className: "fa fa-lg fa-arrow-up align-baseline" })))),



      React.createElement("div", { id: "session", className: "p-2" },
      React.createElement("h2", { id: "session-label" }, "Session Length"),
      React.createElement("div", {
        id: "session-settings",
        className: "d-flex flex-row justify-content-center align-items-center" },

      React.createElement("button", { id: "session-decrement", className: "btn text-light", onClick: this.SESSION_DECREASE.bind(this) },
      React.createElement("i", { className: "fa fa-lg fa-arrow-down align-baseline" })),

      React.createElement("div", { id: "session-length", className: "h3" },
      this.props.sessionLength),

      React.createElement("button", { id: "session-increment", className: "btn text-light", onClick: this.SESSION_INCREASE.bind(this) },
      React.createElement("i", { className: "fa fa-lg fa-arrow-up align-baseline" }))))),




      React.createElement("div", {
        id: "timer",
        className: "p-4 d-flex flex-column justify-content-center align-items-center border border-light rounded w-75" },

      React.createElement("h2", { id: "timer-label" }, this.props.timerLabel),
      React.createElement("audio", { src: "https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptitle=Industrial+Alarm&filename=22/226322-101729b7-ce5c-4ca5-9104-6d9b452b1de4.mp3", id: "beep", title: "Beep" }),
      React.createElement("div", { id: "time-left", className: "h3" },
      this.props.timeLeft),

      React.createElement("div", { id: "timer-settings" },
      React.createElement("button", { id: "start_stop", className: "btn text-light", onClick: this.START_STOP.bind(this) },
      React.createElement("i", { className: "fa fa-lg fa-play" }),
      React.createElement("i", { className: "fa fa-lg fa-pause" })),

      React.createElement("button", { id: "reset", className: "btn text-light", onClick: this.RESET.bind(this) },
      React.createElement("i", { className: "fa fa-lg fa-refresh" }))))),




      React.createElement("div", { id: "creator", className: "mt-2" }, "made by Robert M\xFCller")));




  }}

const APP = connect(mapStateToProps, mapDispatchToProps)(POMODOROCLOCK);
ReactDOM.render(
React.createElement(Provider, { store: store },
React.createElement(APP, null)),

document.getElementById("App"));