export enum Player {
  X = "X",
  O = "O",
}

export enum GameMode {
  LOCAL_PLAYER = "LOCAL_PLAYER",
  COMPUTER = "COMPUTER",
  ONLINE_PLAYER = "ONLINE_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",
}

export enum GameType {
  THREE_BY_THREE = "3X3",
}

export enum GameState {
  IN_PROGRESS = "IN_PROGRESS",
  GAME_OVER = "GAME_OVER",
  PAUSED = "PAUSED",
  RESUMED = "RESUMED",
}

export enum GameResult {
  WIN = "WIN",
  DRAW = "DRAW",
  NONE = "NONE",
}

export enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}
