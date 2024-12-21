"use client";
import React, { useState, useRef, useEffect } from "react";

const DrawingApp = () => {
  const [difficulty, setDifficulty] = useState("beginner");
  const [timeLimit, setTimeLimit] = useState(10);
  const [randomImage, setRandomImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [score, setScore] = useState("-");
  const canvasRef = useRef(null); // キャンバス参照
  const contextRef = useRef(null); // キャンバスの描画コンテキスト
  const [isDrawing, setIsDrawing] = useState(false); // 描画状態

  // 難易度別の画像
  const difficultyImages = {
    beginner: "/images/beginner1.jpg",  // 画像のパスを修正
  };

  // キャンバス初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    contextRef.current = context;
    setRandomImage("/images/beginner1.jpg"); // 初期画像を設定
  }, []);

  // 描画開始
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  // 描画中
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // 描画終了
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // 難易度に基づく画像の選択
  const selectImageByDifficulty = (level) => {
    return difficultyImages[level] || "/images/beginner.jpg"; // プレースホルダーを返す
  };

  // ゲーム開始
  const startGame = () => {
    const selectedImage = selectImageByDifficulty(difficulty);
    setRandomImage(selectedImage);

    let timeRemaining = timeLimit;
    setCountdown(timeRemaining);

    const timer = setInterval(() => {
      timeRemaining -= 1;
      setCountdown(timeRemaining);

      if (timeRemaining <= 0) {
        clearInterval(timer);
        alert("時間切れです！");
      }
    }, 1000);
  };

  // 類似度測定の処理
  const submitDrawing = async () => {
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL(); // キャンバスをBase64形式で取得
    const payload = {
      original: randomImage, // ランダム画像（URL）
      drawing: drawingData, // 描画されたデータ（Base64）
    };

    try {
      // Google ColabのFlaskサーバーのエンドポイントを指定
      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("類似度測定に失敗しました");
      }

      const result = await response.json();
      setScore(Math.round(result.similarity_score * 100)); // 類似度スコアを保存
      alert(`類似度スコア: ${Math.round(result.similarity_score * 100)}%`);
    } catch (error) {
      console.error("エラー:", error);
      alert("エラーが発生しました。類似度測定が失敗しました。");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
      {/* 左部分 */}
      <div style={{ flex: 1, margin: "10px", textAlign: "center" }}>
        <h3>難易度を選択してください</h3>
        <div>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="beginner"
              checked={difficulty === "beginner"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            初心者
          </label>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="intermediate"
              checked={difficulty === "intermediate"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            中級者
          </label>
          <label>
            <input
              type="radio"
              name="difficulty"
              value="advanced"
              checked={difficulty === "advanced"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            上級者
          </label>
        </div>

        <h3>制限時間を選択してください</h3>
        <div>
          <label>
            <input
              type="radio"
              name="timeLimit"
              value="10"
              checked={timeLimit === 10}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            />
            10秒
          </label>
          <label>
            <input
              type="radio"
              name="timeLimit"
              value="20"
              checked={timeLimit === 20}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            />
            20秒
          </label>
          <label>
            <input
              type="radio"
              name="timeLimit"
              value="30"
              checked={timeLimit === 30}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            />
            30秒
          </label>
        </div>

        <h3>ランダム画像</h3>
        <img
          id="randomImage"
          src={randomImage || null} // 無効な値の場合に null を渡す
          alt="画像がここに表示されます"
          style={{ width: "300px", height: "auto" }}
        />


        <h3 id="countdownTimer" style={{ color: "red", fontSize: "20px" }}>
          {countdown !== null ? `残り時間: ${countdown}秒` : "制限時間を設定してください"}
        </h3>
      </div>

      {/* 右部分 */}
      <div style={{ flex: 2, margin: "10px", textAlign: "center" }}>
        <h3>ここに描画してください</h3>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          style={{ border: "1px solid black" }}
        ></canvas>

        <h3>結果</h3>
        <p id="scoreDisplay">類似度スコア: {score}</p>

        <button onClick={startGame}>開始</button>
        <button onClick={submitDrawing}>提出して類似度を測定</button>
      </div>
    </div>
  );
};

export default DrawingApp;
