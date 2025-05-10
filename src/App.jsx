import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // State variables
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Format time to mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Handle length adjustment
  const handleLengthChange = (type, change) => {
    if (isRunning) return;
    
    if (type === 'break') {
      const newBreakLength = breakLength + change;
      if (newBreakLength > 0 && newBreakLength <= 60) {
        setBreakLength(newBreakLength);
      }
    } else {
      const newSessionLength = sessionLength + change;
      if (newSessionLength > 0 && newSessionLength <= 60) {
        setSessionLength(newSessionLength);
        setTimeLeft(newSessionLength * 60);
      }
    }
  };

  // Handle timer start/stop
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  // Handle reset
  const handleReset = () => {
    // Clear interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Reset all states
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            // Play sound
            audioRef.current.play();
            
            // Switch between session and break
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  return (
    <div className="container">
      <div className="main-title">25 + 5 Clock</div>
      
      <div className="length-control">
        <div id="break-label">Break Length</div>
        <button id="break-decrement" onClick={() => handleLengthChange('break', -1)}>
          <i className="fas fa-arrow-down"></i>
        </button>
        <div id="break-length">{breakLength}</div>
        <button id="break-increment" onClick={() => handleLengthChange('break', 1)}>
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>
      
      <div className="length-control">
        <div id="session-label">Session Length</div>
        <button id="session-decrement" onClick={() => handleLengthChange('session', -1)}>
          <i className="fas fa-arrow-down"></i>
        </button>
        <div id="session-length">{sessionLength}</div>
        <button id="session-increment" onClick={() => handleLengthChange('session', 1)}>
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>
      
      <div className="timer">
        <div className="timer-wrapper">
          <div id="timer-label">{timerLabel}</div>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>
      </div>
      
      <div className="timer-control">
        <button id="start_stop" onClick={handleStartStop}>
          <i className="fas fa-play fa-2x"></i>
          <i className="fas fa-pause fa-2x"></i>
        </button>
        <button id="reset" onClick={handleReset}>
          <i className="fas fa-sync fa-2x"></i>
        </button>
      </div>
      
      <audio 
        id="beep" 
        ref={audioRef} 
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" 
        preload="auto"
      />
      
      <div className="author">
        <div>Designed by</div>
        <a href="https://freecodecamp.org" target="_blank" rel="noopener noreferrer">Kunal</a>
      </div>
    </div>
  );
}

export default App;