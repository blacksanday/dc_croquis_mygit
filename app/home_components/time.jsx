// home_components/time.js
export default function Time({ onTimeSelect }) {
    const handleTimeChange = (event) => {
      onTimeSelect(event.target.value); // 選択された時間を親に伝える
    };
  
    return (
      <div>
        <label htmlFor="time">Select Time:</label>
        <select id="time" onChange={handleTimeChange}>
          <option value="">-- Select Time --</option>
          <option value="30s">30 seconds</option>
          <option value="1m">1 minute</option>
          <option value="5m">5 minutes</option>
        </select>
      </div>
    );
  }
  