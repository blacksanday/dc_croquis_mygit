// home_components/level.js
import { useState } from "react";

export default function Level({ onLevelSelect }) {
  const [selectedLevel, setSelectedLevel] = useState(null); // 選択状態を管理

  const handleLevelClick = (level) => {
    setSelectedLevel(level); // 選択されたレベルを更新
    onLevelSelect(level); // 親コンポーネントに通知
  };

  return (
    <div>
      <h3>Select Level:</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {["1", "2", "3"].map((level) => (
          <button
            key={level}
            onClick={() => handleLevelClick(level)}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedLevel === level ? "#008000" : "lightgray",
              color: selectedLevel === level ? "white" : "black",
              border: "1px solid gray",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
