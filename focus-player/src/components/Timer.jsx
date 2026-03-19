import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(1500); // 25 min
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
  // 🔔 SOUND
  const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
  audio.play();

  // ⚠️ ALERT
  alert(isBreak ? "Break over! Back to focus 💪" : "Time's up! Take a break ☕");

  if (isBreak) {
    setIsBreak(false);
    return 1500; // focus
  } else {
    setIsBreak(true);
    return 300; // break
  }
}
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  // format time
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const buttonStyle = {
  margin: "5px",
  padding: "10px 15px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#1e90ff",
  color: "white",
};
const [inputMinutes, setInputMinutes] = useState(25);
  return (
    <div style={{ marginTop: "10px" }}>
      <h2>{isBreak ? "Break Time ☕" : "Focus Time 📚"}</h2>
      
      <input
      type="number"
      value={inputMinutes}
      onChange={(e) => setInputMinutes(e.target.value)}
      style={{
      padding: "5px",
      width: "60px",
      marginBottom: "10px",
  }}
/>
      <h1>
        {minutes}:{secs < 10 ? `0${secs}` : secs}
      </h1>

      <button
  onClick={() => {
    if (seconds === 1500 || seconds === 0) {
      setSeconds(inputMinutes * 60);
    }
    setIsRunning(true);
  }}
>
  Start
</button>

<button
  onClick={() => setIsRunning(false)}
  style={buttonStyle}
>
  Pause
</button>

<button
  onClick={() => {
    setIsRunning(false);
    setSeconds(1500);
    setIsBreak(false);
  }}
  style={buttonStyle}
>
  Reset
</button>
    </div>
  );
}