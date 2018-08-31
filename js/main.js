var delay = 1000;

var clockIntervalId;

var timeDisplay = document.getElementsByClassName("time")[0];
var modeDisplay = document.getElementsByClassName("mode")[0];

var pomodoroDurationSet = document.getElementsByClassName("number-value")[0];
var shortBreakDurationSet = document.getElementsByClassName("number-value")[1];
var longBreakDurationSet = document.getElementsByClassName("number-value")[2];
var longBreakQuotaSet = document.getElementsByClassName("number-value")[3];

var addPomodoroLengthBtn = document.getElementsByClassName("add")[0];
var reducePomodoroLengthBtn = document.getElementsByClassName("reduce")[0];

var addShortBreakLengthBtn = document.getElementsByClassName("add")[1];
var reduceShortBreakLengthBtn = document.getElementsByClassName("reduce")[1];

var addLongBreakLengthBtn = document.getElementsByClassName("add")[2];
var reduceLongBreakLengthBtn = document.getElementsByClassName("reduce")[2];

var resetBtn = document.getElementsByClassName("reset")[0];
var skipBtn = document.getElementsByClassName("skip")[0];

var pomodoroClock = {
  mode: "set",
  _started: false,
  get started() {
    return this._started;
  },
  set started(bool) {
    this._started = bool;
  },
  _paused: false,
  get paused() {
    return this._paused;
  },
  set paused(bool) {
    this._paused = bool;
  },
  _resumed: false,
  get resumed() {
    return this._resumed;
  },
  set resumed(bool) {
    this._resumed = bool;
  },
  pomodoro: {
    duration: {
      _minute: 25,

      get minute() {
        return this._minute;
      },

      set minute(min) {
        this._minute = min;
      },
      get totalSeconds() {
        return this._minute * 60;
      }
    },
    sessionCount: 0,

  },
  break: {
    shortDuration: {
      _minute: 5,

      get minute() {
        return this._minute;
      },
      set minute(min) {
        this._minute = min;
      },
      get totalSeconds() {
        return this._minute * 60;
      },
    },

    longDuration: {
      _minute: 10,

      get minute() {
        return this._minute;
      },
      set minute(min) {
        this._minute = min;
      },
      get totalSeconds() {
        return this._minute * 60;
      },
    },

    longBreakPomodoroQuant: 4,
  },

  currentTime: {
    _totalSeconds: 0,

    get minute() {
      return Math.floor(this._totalSeconds / 60);
    },

    get totalSeconds() {
      return this._totalSeconds;
    },

    set totalSeconds(sec) {
      this._totalSeconds = sec;
    },

    get clockedSecond() {
      return this._totalSeconds % 60;
    },

    elapsed: 0,
  },

  display: {
    get minuteDisplay() {
      return appendZero(pomodoroClock.currentTime.minute);      
    },
    get secondDisplay() {
      return appendZero(pomodoroClock.currentTime.clockedSecond);
    }
  }
};

function initializeDisplay() {
  pomodoroDurationSet.innerHTML = appendZero(pomodoroClock.pomodoro.duration.minute) + ":" + "00";
  shortBreakDurationSet.innerHTML = appendZero(pomodoroClock.break.shortDuration.minute) + ":" + "00";
  longBreakDurationSet.innerHTML = appendZero(pomodoroClock.break.longDuration.minute) + ":" + "00";
  timeDisplay.innerHTML = appendZero(pomodoroClock.pomodoro.duration.minute) + ":" + "00";
  timeDisplay.classList.add("timeStopColor");
  modeDisplay.innerHTML = "Setting clock"
}

resetBtn.addEventListener("click", function(){
  if(pomodoroClock.mode !== "set") {
    
    clearInterval(clockIntervalId);
    
    pomodoroClock.mode = "set";
    pomodoroClock.started = false;
    pomodoroClock.paused = false;
    
    // pomodoroClock.pomodoro.sessionCount = 0;
    // sessionCountDisplay.innerHTML = "";

    pomodoroClock.currentTime.elapsed = 0;
    
    if (timeDisplay.classList.contains("onColor")) {
      timeDisplay.classList.remove("onColor");
      timeDisplay.classList.add("offColor");
    }
    
    if (!timeDisplay.classList.contains("timeStopColor")) {
      timeDisplay.classList.add("timeStopColor");
    }
    
    initializeDisplay();
    // console.log("reset button clicked");
    // console.log("mode: " + pomodoroClock.mode);

  }
}, false);

skipBtn.addEventListener("click", function(){
  if(pomodoroClock.mode !== "set") {
    clearInterval(clockIntervalId);
    pomodoroClock.currentTime.elapsed = 0;
    if (pomodoroClock.pomodoro.sessionCount < pomodoroClock.break.longBreakPomodoroQuant) {
      pomodoroClock.pomodoro.sessionCount += 1;
    } else if (pomodoroClock.pomodoro.sessionCount >= pomodoroClock.break.longBreakPomodoroQuant) {
      pomodoroClock.pomodoro.sessionCount = 1;
    }

    if (pomodoroClock.mode === "pomodoro") {
      runBreak(pomodoroClock.pomodoro.sessionCount); 
    } else if (pomodoroClock.mode === "break") {
      runPomodoro(runBreak);
    }

    // console.log("skip button clicked");
    // console.log("mode: " + pomodoroClock.mode);
  }
}, false);

addPomodoroLengthBtn.addEventListener("click", function() {
  if (pomodoroClock.mode === "set") {
    pomodoroClock.pomodoro.duration.minute += 1;
    pomodoroDurationSet.innerHTML = appendZero(pomodoroClock.pomodoro.duration.minute) + ":" + "00";
    timeDisplay.innerHTML = appendZero(pomodoroClock.pomodoro.duration.minute) + ":" + "00";
    // console.log("value increased:" + pomodoroClock.pomodoro.duration.minute);
  }
}, false);

reducePomodoroLengthBtn.addEventListener("click", function() {
  if (pomodoroClock.mode === "set") {
    if (pomodoroClock.pomodoro.duration.minute >= 2) {
      pomodoroClock.pomodoro.duration.minute -= 1;
      pomodoroDurationSet.innerHTML = appendZero(pomodoroClock.pomodoro.duration.minute) + ":" + "00";
      timeDisplay.innerHTML = appendZero(pomodoroClock.pomodoro.duration.minute) + ":" + "00";    
      // console.log("value reduced:" + pomodoroClock.pomodoro.duration.minute);
    }
  }
}, false);

addShortBreakLengthBtn.addEventListener("click", function() {
  if (pomodoroClock.mode === "set") {
    pomodoroClock.break.shortDuration.minute += 1;
    shortBreakDurationSet.innerHTML = appendZero(pomodoroClock.break.shortDuration.minute) + ":" + "00";
    // console.log("value increased:" + pomodoroClock.break.shortDuration.minute);
  }
}, false);

reduceShortBreakLengthBtn.addEventListener("click", function() {
  if (pomodoroClock.mode === "set") {
    if (pomodoroClock.break.shortDuration.minute >= 2) {
      pomodoroClock.break.shortDuration.minute -= 1;
      shortBreakDurationSet.innerHTML = appendZero(pomodoroClock.break.shortDuration.minute) + ":" + "00";
      // console.log("value reduced:" + pomodoroClock.break.shortDuration.minute);
    }
  }
}, false);

addLongBreakLengthBtn.addEventListener("click", function() {
  if (pomodoroClock.mode === "set") {
    pomodoroClock.break.longDuration.minute += 1;
    longBreakDurationSet.innerHTML = appendZero(pomodoroClock.break.longDuration.minute) + ":" + "00";
    // console.log("value increased:" + pomodoroClock.break.longDuration.minute);
  }
}, false);

reduceLongBreakLengthBtn.addEventListener("click", function() {
  if (pomodoroClock.mode === "set") {
    if (pomodoroClock.break.longDuration.minute >= 2) {
      pomodoroClock.break.longDuration.minute -= 1;
      longBreakDurationSet.innerHTML = appendZero(pomodoroClock.break.longDuration.minute) + ":" + "00";
      // console.log("value reduced:" + pomodoroClock.break.longDuration.minute);
    }
  }
}, false);

timeDisplay.addEventListener("mouseenter", function(){
}, false);

timeDisplay.addEventListener("mouseleave", function(){}, false);

timeDisplay.addEventListener("click", function() {
  
  if (this.classList.contains("onColor")) {
    this.classList.remove("onColor");
    this.classList.add("offColor");
    this.classList.add("timeStopColor");
    
  } else {
    this.classList.remove("offColor");
    this.classList.remove("timeStopColor");
    this.classList.add("onColor");  
  } 
  
  if (pomodoroClock.started === false) {

    pomodoroClock.started = true;
    pomodoroClock.paused = false;
    
    if (pomodoroClock.mode === "pomodoro" || pomodoroClock.mode === "set") {
      runPomodoro(runBreak);
    } else if (pomodoroClock.mode === "break") {
      runBreak(pomodoroClock.pomodoro.sessionCount);
    }
    // console.log("clock started: " + pomodoroClock.started);
    // console.log("clock paused: " + pomodoroClock.paused);
    // console.log("mode: " + pomodoroClock.mode);

  } else if (pomodoroClock.started === true) {

    pomodoroClock.started = false;
    pomodoroClock.paused = true;
    clearInterval(clockIntervalId);
    
    modeDisplay.innerHTML += " paused";
    // console.log("clock started: " + pomodoroClock.started);
    // console.log("clock paused: " + pomodoroClock.paused);
    // console.log("mode: " + pomodoroClock.mode);

    // console.log("paused, current total seconds: " + pomodoroClock.currentTime.totalSeconds);
  }
}, false);

function appendZero(time) {
  switch (time) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return "0" + String(time);
    default:
      return String(time);
              }
}

function runPomodoro(callback) {
  pomodoroClock.mode = "pomodoro";
  modeDisplay.innerHTML = "Pomodoro";

  pomodoroClock.currentTime.totalSeconds = pomodoroClock.pomodoro.duration.totalSeconds - pomodoroClock.currentTime.elapsed;

  timeDisplay.innerHTML = pomodoroClock.display.minuteDisplay + ":" + pomodoroClock.display.secondDisplay;

  clockIntervalId = setInterval(function() {

    pomodoroClock.currentTime.totalSeconds -= 1;
    pomodoroClock.currentTime.elapsed += 1;

    if (pomodoroClock.currentTime.totalSeconds === -1) {

      clearInterval(clockIntervalId);
      pomodoroClock.currentTime.elapsed = 0;
      if (pomodoroClock.pomodoro.sessionCount < pomodoroClock.break.longBreakPomodoroQuant) {
        pomodoroClock.pomodoro.sessionCount += 1;
      } else if (pomodoroClock.pomodoro.sessionCount >= pomodoroClock.break.longBreakPomodoroQuant) {
        pomodoroClock.pomodoro.sessionCount = 1;
      }

      // sessionCountDisplay.innerHTML += "P";
      
      updateChart(1);
      // console.log("end of session");
      callback(pomodoroClock.pomodoro.sessionCount);

    }
    timeDisplay.innerHTML = String(pomodoroClock.display.minuteDisplay) + ":" + pomodoroClock.display.secondDisplay;

    // console.log("pomodoro mode, current time, total seconds:" + pomodoroClock.currentTime.totalSeconds);
    // console.log("pomodoro mode, current time, minute:" + pomodoroClock.currentTime.minute);
    // console.log("pomodoro mode, current time, displayed minute:" + pomodoroClock.display.minuteDisplay);
    // console.log("pomodoro mode, current time, displayed seconds:" + pomodoroClock.display.secondDisplay);
    // console.log("pomodoro mode, current time, elapsed seconds:" + pomodoroClock.currentTime.elapsed);
    // console.log("pomodoro mode, current time, number of pomodoro sessions:" + pomodoroClock.pomodoro.sessionCount);
  }, delay);

}

function runBreak(sessionCount) {
  pomodoroClock.mode = "break";

  // console.log("break mode running");

  if (pomodoroClock.pomodoro.sessionCount < pomodoroClock.break.longBreakPomodoroQuant) {
    modeDisplay.innerHTML = "Short break";

    pomodoroClock.currentTime.totalSeconds = pomodoroClock.break.shortDuration.totalSeconds - pomodoroClock.currentTime.elapsed;

    timeDisplay.innerHTML = String(pomodoroClock.display.minuteDisplay) + ":" + String(pomodoroClock.display.secondDisplay);


    // console.log("short break duration: " + pomodoroClock.currentTime.totalSeconds);

    clockIntervalId = setInterval(function() {

      pomodoroClock.currentTime.totalSeconds -= 1;
      pomodoroClock.currentTime.elapsed += 1;
      timeDisplay.innerHTML = String(pomodoroClock.display.minuteDisplay) + ":" + String(pomodoroClock.display.secondDisplay);

      if (pomodoroClock.currentTime.totalSeconds === -1) {

        clearInterval(clockIntervalId);
        pomodoroClock.currentTime.elapsed = 0;

        // sessionCountDisplay.innerHTML += " B<sub>S</sub> ";

        updateChart(2);
        // console.log("end of session");
        runPomodoro(runBreak);
      }

      // console.log("short break mode, current time, total seconds:" + pomodoroClock.currentTime.totalSeconds);
      // console.log("short break mode, current time, minute:" + pomodoroClock.currentTime.minute);
      // console.log("short break mode, current time, displayed minute:" + pomodoroClock.display.minuteDisplay);
      // console.log("short break mode, current time, displayed seconds:" + pomodoroClock.display.secondDisplay);
      // console.log("short break mode, current time, number of pomodoro sessions:" + pomodoroClock.pomodoro.sessionCount);

    }, delay);

  } else if (pomodoroClock.pomodoro.sessionCount >= pomodoroClock.break.longBreakPomodoroQuant) {
    modeDisplay.innerHTML = "Long break";

    pomodoroClock.currentTime.totalSeconds = pomodoroClock.break.longDuration.totalSeconds - pomodoroClock.currentTime.elapsed;

    // console.log("long break duration:" + pomodoroClock.currentTime.totalSeconds);

    clockIntervalId = setInterval(function() {

      pomodoroClock.currentTime.totalSeconds -= 1;
      pomodoroClock.currentTime.elapsed += 1;

      timeDisplay.innerHTML = String(pomodoroClock.display.minuteDisplay) + ":" + String(pomodoroClock.display.secondDisplay);

      if (pomodoroClock.currentTime.totalSeconds === -1) {
        clearInterval(clockIntervalId);
        pomodoroClock.currentTime.elapsed = 0;

        // sessionCountDisplay.innerHTML += " B<sub>L</sub> ";
        updateChart(3);
        // console.log("end of session");
        runPomodoro(runBreak);
      }

      // console.log("long break mode, current time, total seconds:" + pomodoroClock.currentTime.totalSeconds);
      // console.log("long break mode, current time, minute:" + pomodoroClock.currentTime.minute);
      // console.log("long break mode, current time, displayed minute:" + pomodoroClock.display.minuteDisplay);
      // console.log("long break mode, current time, displayed seconds:" + pomodoroClock.display.secondDisplay);
      // console.log("long break mode, current time, number of pomodoro sessions:" + pomodoroClock.pomodoro.sessionCount);

    }, delay);

  }
}

initializeDisplay();

google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(init);

function init() {
  var options = {
    legend: {position: 'none'},
    backgroundColor: 'transparent',
    chartArea: {width: '50%'},
    vAxis: {
      textStyle: {color: 'white'},
    },
    hAxis: {
      minValue: 0,
      textStyle:{color: 'white'},
      viewWindow: {
        min:0
      }
    },
    animation:{
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };

  var data = google.visualization.arrayToDataTable([
    ['Duration', 'Minutes', { role: 'style' }],
    ['Work Duration', 0, '#ff2d55'],
    ['Break Duration', 0, '#5ac8fa'],
  ]);

  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  var filterBtn = document.getElementsByClassName("filter")[0];
  var curWorkDur = data.getValue(0, 1);
  var curBreakDur = data.getValue(1, 1);

  function drawChart() {
    // Disabling the button while the chart is drawing.
    filterBtn.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          filterBtn.disabled = false;
        });
    chart.draw(data, options);
  }

  window.updateChart = function() {
    if (arguments[0] === 1) {
        // console.log("work time updated");
        var newValue = data.getValue(0, 1) + pomodoroClock.pomodoro.duration.minute;
        curWorkDur = newValue;
        data.setValue(0, 1, newValue);
        drawChart();
    }
    else if (arguments[0] === 2) {
      // console.log("short break time updated");
      var newValue = data.getValue(1, 1) + pomodoroClock.break.shortDuration.minute
      curBreakDur = newValue;
      data.setValue(1, 1, newValue);
      drawChart();
    }
    else if (arguments[0] === 3) {
      // console.log("long break time updated");
      var newValue = data.getValue(1, 1) + pomodoroClock.break.longDuration.minute;
      curBreakDur = newValue;
      data.setValue(1, 1, newValue);
      drawChart();
    }
  }

  filterBtn.onclick = function() {
    var date = document.getElementById("datepicker").value;

    if (date !== "") {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();

      if(dd<10) {
          dd = '0'+dd
      } 

      if(mm<10) {
          mm = '0'+mm
      } 

      today = yyyy + '-' + mm + '-' + dd;

      if (date === today) {
        console.log("today");
        data.setValue(1, 1, curBreakDur);
        data.setValue(0, 1, curWorkDur);
        drawChart();
      }

      else {
        console.log("no record found");
        var newValue = 0;
        data.setValue(1, 1, newValue);
        data.setValue(0, 1, newValue);
        drawChart();
      }
    }
  }
  drawChart();
}