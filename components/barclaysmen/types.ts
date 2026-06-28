export type Player = {
  name: string;
  assists: string;
  seasons: string[];
  goals: number;
  position: string;
  team: string[];
  playerUrl: string;
  teamUrl: string[];
  nationality: string;
  flagUrl: string;
  games: number;
};

export type GameState = {
  guesses: string[];
  chosenPlayer: Player | null;
  gameComplete: boolean;
  gameLost: boolean;
  guessCount: number;
  footballImages: string[];
};
