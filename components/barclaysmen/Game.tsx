"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import type { Player, GameState } from "./types";
import GuessCard from "./GuessCard";
import CompletionScreen from "./CompletionScreen";
import styles from "./Game.module.css";

const API = "https://notspotle-production.up.railway.app/api/playerstats";
const STORAGE_KEY = "barclaysmen_gameState";
const MAX_GUESSES = 10;

function getDateStamp() {
  return new Date().toISOString().split("T")[0];
}

function pickPlayerForDate(players: Player[]): Player {
  const seed = getDateStamp();
  const index =
    Math.abs(seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) %
    players.length;
  return players[index];
}

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Game() {
  const [playerStats, setPlayerStats] = useState<Player[]>([]);
  const [chosenPlayer, setChosenPlayer] = useState<Player | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessCount, setGuessCount] = useState(0);
  const [footballImages, setFootballImages] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [loading, setLoading] = useState(true);

  // ── Persist game state to localStorage ──
  const saveState = useCallback(
    (overrides: Partial<GameState> = {}) => {
      const state: GameState = {
        guesses,
        chosenPlayer,
        gameComplete,
        gameLost,
        guessCount,
        footballImages,
        ...overrides,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem("barclaysmen_lastDate", getDateStamp());
    },
    [guesses, chosenPlayer, gameComplete, gameLost, guessCount, footballImages]
  );

  // ── Load saved state or start fresh ──
  useEffect(() => {
    const fetchAndInit = async () => {
      try {
        const res = await axios.get<Player[]>(API);
        const players = res.data;
        setPlayerStats(players);

        const savedDate = localStorage.getItem("barclaysmen_lastDate");
        const today = getDateStamp();

        if (savedDate === today) {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const saved: GameState = JSON.parse(raw);
            setGuesses(saved.guesses ?? []);
            setChosenPlayer(saved.chosenPlayer ?? pickPlayerForDate(players));
            setGameComplete(saved.gameComplete ?? false);
            setGameLost(saved.gameLost ?? false);
            setGuessCount(saved.guessCount ?? 0);
            setFootballImages(saved.footballImages ?? []);
            setLoading(false);
            return;
          }
        }

        // New day — fresh game
        const player = pickPlayerForDate(players);
        setChosenPlayer(player);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem("barclaysmen_lastDate", today);
      } catch (e) {
        console.error("Failed to fetch players", e);
      }
      setLoading(false);
    };

    fetchAndInit();
  }, []);

  // ── Countdown timer ──
  useEffect(() => {
    if (!gameComplete && !gameLost) return;
    setTimeRemaining(getTimeUntilMidnight());
    const id = setInterval(() => setTimeRemaining(getTimeUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, [gameComplete, gameLost]);

  // ── Lose check ──
  useEffect(() => {
    if (guessCount === MAX_GUESSES && !gameComplete) {
      setGameLost(true);
      saveState({ gameLost: true });
    }
  }, [guessCount, gameComplete]);

  // ── Filtered autocomplete ──
  const filteredPlayers = searchText
    ? playerStats
        .filter((p) =>
          p.name
            .toLowerCase()
            .split(" ")
            .some((part) => part.startsWith(searchText.toLowerCase()))
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 5)
    : [];

  // ── Handle a guess ──
  const handleGuess = (playerName: string) => {
    if (guesses.includes(playerName) || gameComplete || gameLost) return;

    const newGuesses = [...guesses, playerName];
    const newCount = guessCount + 1;
    const newImages = [...footballImages, "ball"];
    const guessedPlayer = playerStats.find(
      (p) => p.name.toLowerCase() === playerName.toLowerCase()
    );
    const isCorrect =
      guessedPlayer?.name.toLowerCase() === chosenPlayer?.name.toLowerCase();
    const newComplete = isCorrect;

    setGuesses(newGuesses);
    setGuessCount(newCount);
    setFootballImages(newImages);
    setSearchText("");
    if (isCorrect) setGameComplete(true);

    saveState({
      guesses: newGuesses,
      guessCount: newCount,
      footballImages: newImages,
      gameComplete: newComplete,
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div
      className={styles.background}
      style={{ backgroundImage: "url('/images/LuaLua.png')" }}
    >
      <div className={styles.overlay}>
        {/* Header bar */}
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>← Back</Link>
          <span className={styles.topTitle}>BarclaysMen</span>
          <span />
        </div>

        <div className={styles.gameContainer}>
          {/* Football chance indicators */}
          <div className={styles.chances}>
            {Array.from({ length: MAX_GUESSES }).map((_, i) => (
              <img
                key={i}
                src="/images/Football.png"
                alt="ball"
                className={`${styles.ball} ${i < guessCount ? styles.ballUsed : ""}`}
              />
            ))}
          </div>

          {/* Shots remaining text */}
          {!gameComplete && !gameLost && (
            <p className={styles.shotsText}>
              You have {MAX_GUESSES - guessCount} shot{MAX_GUESSES - guessCount !== 1 ? "s" : ""} remaining!
            </p>
          )}

          {/* Win / Lose screen */}
          {(gameComplete || gameLost) && (
            <CompletionScreen
              gameComplete={gameComplete}
              gameLost={gameLost}
              chosenPlayer={chosenPlayer}
              timeRemaining={timeRemaining}
            />
          )}

          {/* Search input */}
          {!gameComplete && !gameLost && (
            <div className={styles.searchWrapper}>
              <input
                className={styles.input}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Guess Here..."
                autoComplete="off"
              />
              {filteredPlayers.length > 0 && (
                <ul className={styles.dropdown}>
                  {filteredPlayers.map((p) => (
                    <li
                      key={p.name}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleGuess(p.name)}
                    >
                    {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          )}

          {/* Previous guesses */}
          <div className={styles.guessList}>
            {[...guesses].reverse().map((guess, i) => {
              const player = playerStats.find(
                (p) => p.name.toLowerCase() === guess.toLowerCase()
              );
              return player ? (
                <GuessCard
                  key={i}
                  guessedPlayer={player}
                  chosenPlayer={chosenPlayer}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
