"use client";
import React, { useState, useRef, useEffect } from "react";

const DrawingApp = () => {
  const [userId, setUserId] = useState(""); // ユーザーID
  const [randomImage, setRandomImage] = useState(null);
  const [score, setScore] = useState("-");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    contextRef.current = context;
    setRandomImage("/b3.jpg");
  }, []);

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

  const startDrawing = ({ nativeEvent }) => {
    if (!isGameActive) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const startGame = () => {
    if (!userId) {
      alert("ユーザーIDを入力してください！");
      return;
    }
    setIsGameActive(true);
    setTimeLeft(60);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const calculateSimilarity = (image1, canvas) => {
    const canvas1 = document.createElement("canvas");
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas.getContext("2d");

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
    return 1 - diff / maxDiff;
  };

  const submitDrawing = () => {
    const canvas = canvasRef.current;
    const randomImgElement = document.getElementById("randomImage");

    const similarity = calculateSimilarity(randomImgElement, canvas);
    const scorePercentage = Math.round(similarity * 100);
    setScore(scorePercentage);

    const newExperience = scorePercentage / 10; // 類似度 * 1/10
    const timestamp = new Date().toISOString();

    const dbRequest = indexedDB.open("ProgressDB", 2);
    dbRequest.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("progress")) {
        db.createObjectStore("progress", { keyPath: "id", autoIncrement: true });
        console.log("ObjectStore 'progress' created.");
      }
    };

    dbRequest.onsuccess = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("progress")) {
        console.error("ObjectStore 'progress' does not exist.");
        return;
      }
      const transaction = db.transaction("progress", "readwrite");
      const store = transaction.objectStore("progress");

      const getRequest = store.getAll();

      getRequest.onsuccess = function (event) {
        const data = event.target.result;
        const userData = data.find((item) => item.userId === userId);

        let totalExperience = newExperience;
        let newLevel = 0;

        if (userData) {
          // 累積経験値を計算
          totalExperience += userData.experience;

          // レベル判定
          if (totalExperience >= 1000) {
            newLevel = 3;
          } else if (totalExperience >= 100) {
            newLevel = 2;
          } else if (totalExperience >= 10) {
            newLevel = 1;
          }
        } else {
          // 新しいデータの場合
          newLevel = newExperience >= 10 ? 1 : 0;
        }

        // 新しいデータを保存
        store.put({
          ...(userData ? { id: userData.id } : {}), // 既存データの場合のみ id を設定
          userId,
          similarityScore: scorePercentage,
          timeElapsed: 60 - timeLeft,
          experience: totalExperience,
          timestamp,
          level: newLevel,
        });

        alert(`データが保存されました！現在のレベル: ${newLevel}`);
        resetGame(); // 提出後にリセットを実行
      };
    };
  };


  return (
    <div style={{ padding: "20px" }}>
      <div>
        <label>
          ユーザーID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>

      <h3>ランダム画像</h3>
      <img id="randomImage" src={randomImage} alt="ランダム画像" />

      <h3>描画キャンバス</h3>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        style={{ border: "1px solid black", width: "800px", height: "600px" }}
      ></canvas>

      <p>類似度スコア: {score}</p>
      <p>残り時間: {timeLeft}秒</p>

      <button onClick={startGame}>ゲームを開始</button>
      <button onClick={submitDrawing} disabled={!isGameActive}>
        提出して類似度を測定
      </button>
    </div>
  );
};

export default DrawingApp;
