"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Report() {
    const [logs, setLogs] = useState([]); // ログデータを格納

    // IndexedDBからログを取得する関数
    const fetchLogs = async () => {
        const dbRequest = indexedDB.open("ProgressDB", 1);

        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("progress", "readonly");
            const store = transaction.objectStore("progress");

            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = function (event) {
                const data = event.target.result;
                setLogs(data); // ログデータを状態に保存
            };

            getAllRequest.onerror = function () {
                console.error("ログデータの取得に失敗しました");
            };
        };

        dbRequest.onerror = function () {
            console.error("IndexedDBへの接続に失敗しました");
        };
    };

    // 初回レンダリング時にログを取得
    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div>
            <h1>This is Report Hierarchy page</h1>

            {/* ログデータの表示 */}
            <div style={{ marginTop: "20px" }}>
                <h2>Logs:</h2>
                {logs.length > 0 ? (
                    <ul>
                        {logs.map((log, index) => (
                            <li key={index} style={{ marginBottom: "10px" }}>
                                <strong>ユーザーID:</strong> {log.userId} <br />
                                <strong>経験値:</strong> {log.experience} <br />
                                <strong>レベル:</strong> {log.level} <br />
                                <strong>称号:</strong> {log.title} <br />
                                <strong>タイマー値:</strong> {log.timeElapsed}秒 <br />
                                <strong>保存時間:</strong> {log.timestamp} <br />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No logs found.</p>
                )}
            </div>

            <Link href="/">
                <button
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Go Back to Home Page
                </button>
            </Link>
        </div>
    );
}