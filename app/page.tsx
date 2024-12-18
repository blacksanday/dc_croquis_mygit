//import Image from "next/image";

// app/page.js
import Link from "next/link";
import Level from "./home_components/level";
import Time from "./home_components/time";
import Report from "./home_components/report";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Croquis</h1>
      <p>This is your new home page!</p>
      <Level />
      <Time />
      <Report />
      <Link href="croquis/">Go to Croquis Page </Link>
      <p></p>
    </div>
  );
}
