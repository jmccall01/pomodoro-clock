import React from 'react'
import './App.css'

function App() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [session, setSession] = React.useState(true);
  const [coundownRunning, setCountdownRunning] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(1500);
  const [resetVar, setResetVar] = React.useState(true)

  function formatTime(time){
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    let minutesRender = (minutes<10 ? "0"+minutes : minutes)
    let secondsRender = (seconds<10 ? "0"+seconds : seconds)
    return (minutesRender + ":" + secondsRender)
  }

  React.useEffect(()=> {
    setSecondsLeft((session ? sessionLength : breakLength)*60);
  }, [(session ? sessionLength : breakLength), resetVar])

  function breakDecrement(){
    if(breakLength>1){
      setBreakLength(pre => pre-1)
    }
  }

  function breakIncrement(){
    if(breakLength<60){
      setBreakLength(pre => pre+1)
    }
 }

  function sessionDecrement() {
    if(sessionLength>1){
      setSessionLength(pre => pre-1)
    }
  }

  function sessionIncrement(){
    if(sessionLength<60){
      setSessionLength(pre => pre+1)
    }
  }

  function controlTime(){
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    if (!coundownRunning){
      let interval = setInterval(() =>
      {
        date = new Date().getTime();
        if(date > nextDate){
          setSecondsLeft((pre) => {
            if(pre <= 0 && session){
              playAudio();
              return breakLength*60;
            }else if(pre <= 0 && !session){
              playAudio();
              return sessionLength*60;
            }
            return pre-1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if(coundownRunning){
      clearInterval(localStorage.getItem("interval-id"))
    }
    setCountdownRunning(pre => !pre)
  }

  function handleReset(){
    setSessionLength(25);
    setBreakLength(5);
    setResetVar(pre => !pre);
    clearInterval(localStorage.getItem("interval-id"));
    setCountdownRunning(false);
    setSession(true);
    document.getElementById("beep").currentTime = 0;
  }

  const playAudio = () => {
    document.getElementById("beep").currentTime = 0;
    document.getElementById("beep").play();
    setSession(preSes => !preSes);
  }

  return (
    <>
      <div className='clock'>
        <h1 class="main-title">25 + 5 Clock</h1>

        <div className='break-session'>
          <div className='break'>
            <h2 id="break-label" className="label">Break Length</h2>
            <div className='selection-container'>
              <button id="break-decrement" className="increment-button" onClick={coundownRunning ? null : breakDecrement}>-</button>
              <p id="break-length" className='length'>{breakLength}</p>
              <button id="break-increment" className="increment-button" onClick={coundownRunning ? null : breakIncrement}>+</button>
            </div>
          </div>
          <div className='session'>
            <h2 id="session-label" className="label">Session Length</h2>
            <div className='selection-container'>
              <button id="session-decrement" className="increment-button" onClick={coundownRunning ? null : sessionDecrement}>-</button>
              <p id="session-length" className='length'>{sessionLength}</p>
              <button id="session-increment" className="increment-button" onClick={coundownRunning ? null : sessionIncrement}>+</button>
            </div>
          </div>
        </div>

        <div id="timer-section" className='timer-section'>
          <h2 id="timer-label" className="timer-label">{session ? "Session" : "Break"}</h2>
          <p id="time-left" className="time-left">{formatTime(secondsLeft)}</p>
        </div>
        <div className='control-buttons'>
          <button id="start_stop" onClick={controlTime} >{coundownRunning ? "Stop" : "Start"}</button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
        <audio
          id="beep" 
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </>
  )
}

export default App
