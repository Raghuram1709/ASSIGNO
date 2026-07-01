import { useEffect, useState } from "react";
import "../styles/progressbar.css";

export const CircularProgressBar = ({
  percentage = 0,
  strokeWidth = 16,
  variant
}) => {
  const size = 150;

  const [progress, setProgress] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

  const safePercentage = Math.min(
    Math.max(percentage, 0),
    100
  );

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      current += 1;

      if (current >= safePercentage) {
        current = safePercentage;
        clearInterval(timer);
      }

      setProgress(current);
      setDisplayValue(current);
    }, 20); // speed

    return () => clearInterval(timer);
  }, [safePercentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div className={`circular-progress-container ${variant ? `circular-progress-container-${variant}` : ''}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="progress-svg"
      >
        <circle
          className={`progress-bg ${variant ? `progress-bg-${variant}` : ''}`}
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
        />

        <circle
          className={`progress-circle ${variant ? `progress-circle-${variant}` : ''}`}
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className={`progress-text ${variant ? `progress-text-${variant}` : ''}`}>
        {displayValue}%
      </div>
    </div>
  );
};



export const ProgressBar = ({ progress = 0 }) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Start at 0
    setAnimatedProgress(0);

    // Let the browser paint once before changing the width
    const timer = setTimeout(() => {
      setAnimatedProgress(safeProgress);
    }, 50);

    return () => clearTimeout(timer);
  }, [safeProgress]);

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-small">
        <div
          className="progress-fill-small"
          style={{
            width: `${animatedProgress}%`,
            "--progress-color": safeProgress < 30 ? "#ff0000" : safeProgress < 70 ? "#f59e0b" : "#00ff04"
          }}
        />
      </div>
      <span className="progress-label">{safeProgress}%</span>
    </div>
  );
};

//  style={{
//                   "--progress": `${project.progress}%`,
//                   "--progress-color":
//                      project.progress < 30
//                      ? "#ff0000"
//                      : project.progress < 70
//                      ? "#f59e0b"
//                      : "#00ff04",
//                }}