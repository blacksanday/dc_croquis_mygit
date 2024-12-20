// app/page.js
import Link from "next/link";
import { useState } from "react";
import Level from "./home_components/level";
import Time from "./home_components/time";
import Report from "./home_components/report";

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState(null); // レベル選択状態
  const [selectedTime, setSelectedTime] = useState(null); // タイム選択状態

  const isFormComplete = selectedLevel && selectedTime; // 両方が選択されているか確認

  return (
    <div>
      <h1>Welcome to Croquis</h1>
      <p>This is your new home page!</p>
      <Level onLevelSelect={setSelectedLevel} />
      <Time onTimeSelect={setSelectedTime} />
      <Report />
      <Link
        href={isFormComplete ? "croquis/" : "#"}
        onClick={(e) => {
          if (!isFormComplete) {
            e.preventDefault();
            alert("Please select both level and time before proceeding.");
          }
        }}
      >
        Go to Croquis Page
      </Link>
      <p></p>
    </div>
  );
}
