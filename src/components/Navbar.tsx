import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.Navbar}>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/samplePage">SamplePage</Link>
      </nav>
    </div>
  );
}
