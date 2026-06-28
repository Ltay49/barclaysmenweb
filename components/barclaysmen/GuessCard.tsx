import type { Player } from "./types";
import styles from "./GuessCard.module.css";

type Props = {
  guessedPlayer: Player;
  chosenPlayer: Player | null;
};

function numClass(guessed: number, chosen: number | undefined, range: number) {
  if (chosen === undefined) return "";
  if (guessed === chosen) return styles.statCorrect;
  if (Math.abs(guessed - chosen) <= range) return styles.statClose;
  return "";
}

export default function GuessCard({ guessedPlayer, chosenPlayer }: Props) {
  return (
    <div className={styles.card}>

      {/* ── Left: player image + rotated name + club badges ── */}
      <div className={styles.imageCol}>
        <img
          src={guessedPlayer.playerUrl}
          alt={guessedPlayer.name}
          className={styles.playerImg}
        />
        <span className={styles.playerName}>{guessedPlayer.name}</span>
        <div className={styles.badges}>
          {guessedPlayer.teamUrl.map((url, i) => {
            const isMatch = chosenPlayer?.team.includes(guessedPlayer.team[i]);
            return (
              <img
                key={i}
                src={url}
                alt={guessedPlayer.team[i]}
                className={styles.badge}
                style={{ opacity: isMatch ? 1 : 0.2 }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Right: flag cell | seasons | stat pills ── */}
      <div className={styles.statsCol}>

        <div className={styles.topRow}>
          {/* Flag cell */}
          <div className={styles.flagBlock}>
            {guessedPlayer.flagUrl ? (
              <img
                src={guessedPlayer.flagUrl}
                alt={guessedPlayer.nationality}
                className={styles.flag}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className={styles.flag} />
            )}
            <span
              className={`${styles.nationality} ${
                guessedPlayer.nationality === chosenPlayer?.nationality
                  ? styles.nationalityCorrect
                  : ""
              }`}
            >
              {guessedPlayer.nationality}
            </span>
          </div>

          {/* Seasons grid */}
          <div className={styles.seasonsBox}>
            {guessedPlayer.seasons.map((season, i) => {
              const isMatch = chosenPlayer?.seasons?.includes(season);
              return (
                <span
                  key={i}
                  className={`${styles.season} ${isMatch ? styles.seasonCorrect : ""}`}
                >
                  {season}
                </span>
              );
            })}
          </div>
        </div>

        {/* Stat pills */}
        <div className={styles.numbersRow}>
          <span className={`${styles.stat} ${numClass(Number(guessedPlayer.goals), Number(chosenPlayer?.goals), 10)}`}>
            GLS: {guessedPlayer.goals}
          </span>
          <span className={`${styles.stat} ${guessedPlayer.position === chosenPlayer?.position ? styles.statCorrect : ""}`}>
            POS: {guessedPlayer.position}
          </span>
          <span className={`${styles.stat} ${numClass(Number(guessedPlayer.assists), Number(chosenPlayer?.assists), 10)}`}>
            AST: {guessedPlayer.assists}
          </span>
          <span className={`${styles.stat} ${numClass(Number(guessedPlayer.games), Number(chosenPlayer?.games), 25)}`}>
            APPS: {guessedPlayer.games}
          </span>
        </div>

      </div>
    </div>
  );
}
