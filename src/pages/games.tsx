import React, { useState } from "react";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";

type Player = "X" | "O" | null;

interface BoardState {
  [key: string]: Player;
}

const initialBoardState: BoardState = {
  b1: null, b2: null, b3: null,
  b4: null, b5: null, b6: null,
  b7: null, b8: null, b9: null,
};

const winningCombinations = [
  ["b1", "b2", "b3"], ["b4", "b5", "b6"], ["b7", "b8", "b9"], // Rows
  ["b1", "b4", "b7"], ["b2", "b5", "b8"], ["b3", "b6", "b9"], // Columns
  ["b1", "b5", "b9"], ["b3", "b5", "b7"],                   // Diagonals
];

const Games: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [message, setMessage] = useState<string>("Player X starts");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleBoxClick = (boxId: string) => {
    if (gameOver || board[boxId]) return;

    const newBoard = { ...board, [boxId]: currentPlayer };
    setBoard(newBoard);

    const winner = winningCombinations.find(([a, b, c]) =>
      newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]
    );

    if (winner) {
      setMessage(`Player ${newBoard[winner[0]]} wins`);
      setGameOver(true);
      return;
    }

    if (Object.values(newBoard).every((value) => value !== null)) {
      setMessage("It's a draw");
      setGameOver(true);
      return;
    }

    const next = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(next);
    setMessage(`Player ${next}'s turn`);
  };

  const resetGame = () => {
    setBoard(initialBoardState);
    setCurrentPlayer("X");
    setMessage("Player X starts");
    setGameOver(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-semibold text-plum">Tic tac toe</h1>
      <p aria-live="polite" className={`mt-3 text-lg ${gameOver ? "font-medium text-gold-dark" : "text-muted"}`}>{message}</p>

      <div className="mt-8 grid w-full grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-card">
        {Object.keys(board).map((boxId) => (
          <button
            key={boxId}
            type="button"
            onClick={() => handleBoxClick(boxId)}
            aria-label={`Square ${boxId.slice(1)}${board[boxId] ? `, ${board[boxId]}` : ""}`}
            className="grid aspect-square place-items-center rounded-xl bg-sand font-serif text-5xl font-semibold text-plum transition hover:bg-plum-50 active:scale-95"
          >
            {board[boxId]}
          </button>
        ))}
      </div>

      <button type="button" onClick={resetGame} className="btn-secondary mt-8">
        <PiArrowCounterClockwiseBold />
        New game
      </button>
    </div>
  );
};

export default Games;
