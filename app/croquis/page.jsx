"use client";
import React, { useState, useRef, useEffect } from "react";

const DrawingApp = () => {
  const [randomImage, setRandomImage] = useState(null);
  const [score, setScore] = useState("-");
  const [timeLeft, setTimeLeft] = useState(60); // 制限時間（秒）
  const [isDrawing, setIsDrawing] = useState(false); // 描画状態
  const [isGameActive, setIsGameActive] = useState(false); // ゲーム状態
  const canvasRef = useRef(null); // キャンバス参照
  const contextRef = useRef(null); // キャンバスの描画コンテキスト

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
    setRandomImage("/b3.jpg"); // 初期画像を固定
  }, []);

  // 秒数カウントダウン
  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      alert("時間切れです！");
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  // 描画開始
  const startDrawing = ({ nativeEvent }) => {
    if (!isGameActive) return;
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

  // ゲーム開始
  const startGame = () => {
    setIsGameActive(true);
    setTimeLeft(60); // 制限時間をリセット
    setRandomImage("/b3.jpg"); // ランダム画像を固定
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをリセット
  };

  // 類似度計算（ピクセル単位の簡易計算）
  const calculateSimilarity = (image1, canvas) => {
    const canvas1 = document.createElement("canvas");
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas.getContext("2d");

    // キャンバスを設定
    canvas1.width = 800;
    canvas1.height = 600;
    ctx1.drawImage(image1, 0, 0, 800, 600);

    const data1 = ctx1.getImageData(0, 0, 800, 600).data;
    const data2 = ctx2.getImageData(0, 0, 800, 600).data;

    let diff = 0;
    for (let i = 0; i < data1.length; i += 4) {
      diff += Math.abs(data1[i] - data2[i]);
      diff += Math.abs(data1[i + 1] - data2[i + 1]);
      diff += Math.abs(data1[i + 2] - data2[i + 2]);
    }

    const maxDiff = 255 * 3 * (data1.length / 4);
    return 1 - diff / maxDiff; // 類似度スコア（0〜1）
  };

  // 類似度測定の処理
  const submitDrawing = () => {
    const canvas = canvasRef.current;
    const randomImgElement = document.getElementById("randomImage");

    const similarity = calculateSimilarity(randomImgElement, canvas);
    const scorePercentage = Math.round(similarity * 100);
    setScore(scorePercentage);
    alert(`類似度スコア: ${scorePercentage}%`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
      {/* 左部分 */}
      <div style={{ flex: 1, margin: "10px", textAlign: "center" }}>
        <h3>ランダム画像</h3>
        <img
          id="randomImage"
          src={randomImage || null}
          alt="画像がここに表示されます"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* 右部分 */}
      <div style={{ flex: 1, margin: "10px", textAlign: "center" }}>
        <h3>ここに描画してください</h3>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          style={{ border: "1px solid black", width: "100%", height: "auto" }}
        ></canvas>

        <h3>結果</h3>
        <p id="scoreDisplay">類似度スコア: {score}</p>
        <p>残り時間: {timeLeft} 秒</p>

        <button onClick={startGame}>開始</button>
        <button onClick={submitDrawing} disabled={!isGameActive}>
          提出して類似度を測定
        </button>
      </div>
    </div>
  );
};

export default DrawingApp;
