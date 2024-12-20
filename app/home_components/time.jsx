// home_components/time.js
import { useState } from "react";

export default function Time({ onTimeSelect }) {
  const [selectedTime, setSelectedTime] = useState(null); // 選択状態を管理

  const handleTimeClick = (time) => {
    setSelectedTime(time); // 選択されたタイムを更新
    onTimeSelect(time); // 親コンポーネントに通知
  };

  return (
    <div>
      <h3>Select Time:</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {["30s", "60s", "120s"].map((time) => (
          <button
            key={time}
            onClick={() => handleTimeClick(time)}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedTime === time ? "#8a2be2" : "lightgray",
              color: selectedTime === time ? "white" : "black",
              border: "1px solid gray",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
