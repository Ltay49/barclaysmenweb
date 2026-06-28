"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import HowToPlay from "./HowToPlay";
import styles from "./Landing.module.css";

export default function Landing() {
  const [howToPlay, setHowToPlay] = useState(false);

  return (
    <div
      className={styles.background}
      style={{ backgroundImage: "url('/images/LuaLua.png')" }}
    >
      <div className={styles.overlay}>
        <Header title="BarclaysMen" />
        <div className={styles.container}>
          <Link href="/game" className={styles.playButton}>
            Play
          </Link>
          <button
            className={styles.howToPlayButton}
            onClick={() => setHowToPlay(true)}
          >
            How to Play
          </button>
        </div>
        {howToPlay && <HowToPlay onClose={() => setHowToPlay(false)} />}
      </div>
    </div>
  );
}
