import type { Player } from "./types";
import styles from "./CompletionScreen.module.css";

type Props = {
  gameComplete: boolean;
  gameLost: boolean;
  chosenPlayer: Player | null;
  timeRemaining: string;
};

export default function CompletionScreen({ gameComplete, gameLost, chosenPlayer, timeRemaining }: Props) {
  return (
    <div className={styles.wrapper}>
      {/* Hero image */}
      <div className={styles.heroBg}>
        <img
          src={`/images/${gameLost ? "slip" : "shearer"}.png`}
          alt=""
          className={styles.heroImg}
        />
        <div className={styles.heroText}>
          <p className={styles.quote}>&quot;They think it&apos;s all over!... It is now!&quot;</p>
          <p className={styles.result}>
            {gameComplete ? "Well done, same again tomorrow!" : "You've let this one slip!"}
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className={styles.countdown}>
        <span className={styles.countdownText}>Next game in: {timeRemaining}</span>
      </div>

      {/* Reveal card */}
      {chosenPlayer && (
        <div className={styles.revealCard}>
          <img
            src={chosenPlayer.playerUrl}
            alt={chosenPlayer.name}
            className={styles.revealImg}
          />
          <div className={styles.revealInfo}>
            <p className={`${styles.revealName} ${gameComplete ? styles.win : styles.lose}`}>
              {chosenPlayer.name}
            </p>
            <img src={chosenPlayer.flagUrl} alt={chosenPlayer.nationality} className={styles.revealFlag} />
            <div className={styles.revealStats}>
              <span className={`${styles.revealStat} ${gameComplete ? styles.win : styles.lose}`}>Goals: {chosenPlayer.goals}</span>
              <span className={`${styles.revealStat} ${gameComplete ? styles.win : styles.lose}`}>Assists: {chosenPlayer.assists}</span>
              <span className={`${styles.revealStat} ${gameComplete ? styles.win : styles.lose}`}>Apps: {chosenPlayer.games}</span>
              <span className={`${styles.revealStat} ${gameComplete ? styles.win : styles.lose}`}>Pos: {chosenPlayer.position}</span>
            </div>
            <div className={styles.revealBadges}>
              {chosenPlayer.teamUrl.map((url, i) => (
                <img key={i} src={url} alt={chosenPlayer.team[i]} className={styles.revealBadge} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
