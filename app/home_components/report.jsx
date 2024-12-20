import Link from "next/link";

// レポートに行くためのボタン
export default function Report() {
  return (
    <div>
      <h2>
        <Link href="report/">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Report Page
          </button>
        </Link>
      </h2>
    </div>
  );
}
