import Link from "next/link";

export default function Result() {
  return (
    <div>
      <h1>This is Result Hierarchy page</h1>
      <Link href="/">
        <button
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go Back to Home Page
        </button>
      </Link>
    </div>
  );
}
