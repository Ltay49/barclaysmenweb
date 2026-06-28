"use client";

import styles from "./HowToPlay.module.css";

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.titleRow}>
          <h2 className={styles.title}>How To Play</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p className={styles.intro}>
          Guess the mystery Premier League player from their career stats. Use the clues each guess reveals to narrow it down.
        </p>

        <div className={styles.step}>
          <span className={styles.stepNum}>1</span>
          <div>
            <p className={styles.stepHead}>Search a player</p>
            <p className={styles.stepBody}>Type a name in the search box and pick from the dropdown.</p>
          </div>
        </div>

        <div className={styles.step}>
          <span className={styles.stepNum}>2</span>
          <div>
            <p className={styles.stepHead}>Read the card</p>
            <p className={styles.stepBody}>Each guess shows their nationality, seasons played, goals, assists, appearances and position.</p>
          </div>
        </div>

        <div className={styles.step}>
          <span className={styles.stepNum}>3</span>
          <div>
            <p className={styles.stepHead}>10 attempts</p>
            <p className={styles.stepBody}>You have 10 guesses. A new player drops every day at midnight.</p>
          </div>
        </div>

        <div className={styles.divider} />

        <p className={styles.sectionLabel}>Colour Guide</p>

        <div className={styles.colourRow}>
          <span className={styles.pillGreen}>07/08</span>
          <p className={styles.colourDesc}>Green — exact match</p>
        </div>
        <div className={styles.colourRow}>
          <span className={styles.pillYellow}>GLS: 12</span>
          <p className={styles.colourDesc}>Yellow — close (within range)</p>
        </div>
        <div className={styles.colourRow}>
          <span className={styles.pillGrey}>POS: FOR</span>
          <p className={styles.colourDesc}>Grey — no match</p>
        </div>

        <div className={styles.divider} />

        <p className={styles.sectionLabel}>Example guess</p>
        <div className={styles.exampleRow}>
          <span className={styles.pillGreen}>07/08</span>
          <span className={styles.pillYellow}>GLS: 12</span>
          <span className={styles.pillGrey}>POS: FOR</span>
          <span className={styles.pillGreen}>ENG</span>
        </div>
        <p className={styles.caption}>Season matches · Goals close · Position wrong · Nationality matches</p>

      </div>
    </div>
  );
}
