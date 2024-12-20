import Link from "next/link";

export default function Report() {
  return (
    <div>
      <h1>This is Report Hierarchy page</h1>
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
