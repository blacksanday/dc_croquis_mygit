import Link from "next/link";

export default function Croquis() {
  return (
    <div>
      <h1>This is Croquis Hierarchy page</h1>
      <Link href="/">Go Buck to Home Page </Link>
      <p></p>
      <Link href="croquis/result">Go to Result Page</Link>
    </div>
  );
}
