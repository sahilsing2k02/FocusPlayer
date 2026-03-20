import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (seconds === 0) {
      const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
      audio.play();
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const progress = (seconds / 1500) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.circleWrapper}>

        <div
          style={{
            ...styles.circle,
            background: `conic-gradient(#ff5f57 ${progress}%, #2a2a2a ${progress}%)`,
          }}
        >
          <div style={styles.innerCircle}>
            <h1>
              {minutes}:{secs < 10 ? `0${secs}` : secs}
            </h1>

            <div style={styles.buttonContainer}>
              <button
                onClick={() => setIsRunning(!isRunning)}
                style={styles.button}
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setSeconds(1500);
                }}
                style={styles.resetButton}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  circleWrapper: {
    width: "200px",
    height: "200px",
  },

  circle: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircle: {
    width: "80%",
    height: "80%",
    borderRadius: "50%",
    backgroundColor: "#121212",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  button: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#ff5f57",
    color: "white",
    cursor: "pointer",
  },

  resetButton: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#555",
    color: "white",
    cursor: "pointer",
  },
};