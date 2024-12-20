// home_components/level.js
export default function Level({ onLevelSelect }) {
    const handleLevelChange = (event) => {
      onLevelSelect(event.target.value); // 選択されたレベルを親に伝える
    };
  
    return (
      <div>
        <label htmlFor="level">Select Level:</label>
        <select id="level" onChange={handleLevelChange}>
          <option value="">-- Select Level --</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    );
  }
  