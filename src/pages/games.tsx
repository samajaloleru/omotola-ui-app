import React, { useState } from "react";
import { Link } from "react-router-dom";

import logo from '../assets/images/logo.png';

type Player = "X" | "O" | null;

interface BoardState {
  [key: string]: Player;
}

const initialBoardState: BoardState = {
  b1: null, b2: null, b3: null,
  b4: null, b5: null, b6: null,
  b7: null, b8: null, b9: null,
};

const Games: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [message, setMessage] = useState<string>("Player X Start game");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const winningCombinations = [
    ["b1", "b2", "b3"], ["b4", "b5", "b6"], ["b7", "b8", "b9"], // Rows
    ["b1", "b4", "b7"], ["b2", "b5", "b8"], ["b3", "b6", "b9"], // Columns
    ["b1", "b5", "b9"], ["b3", "b5", "b7"],                   // Diagonals
  ];

  const handleBoxClick = (boxId: string) => {
    if (gameOver || board[boxId]) return;

    const newBoard = { ...board, [boxId]: currentPlayer };
    setBoard(newBoard);

    // Check for a winner or tie
    checkWinner(newBoard);

    // Switch players
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    setMessage(`Player ${currentPlayer === "X" ? "O" : "X"} Turn`);
  };

  const checkWinner = (currentBoard: BoardState) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        setMessage(`Player ${currentBoard[a]} won!`);
        setGameOver(true);
        alert(`Player ${currentBoard[a]} won!`);
        resetGame();
        return;
      }
    }

    // Check for a tie
    if (Object.values(currentBoard).every((value) => value !== null)) {
      setMessage("Match Tie");
      setGameOver(true);
      alert("Match Tie");
      resetGame();
    }
  };

  const resetGame = () => {
    setBoard(initialBoardState);
    setCurrentPlayer("X");
    setMessage("Player X Start game");
    setGameOver(false);
  };

  return (
    <div className="flex flex-col justify-center items-center w-11/12 h-full  lg:p-10 text-white  rounded-xl">
      <div className="flex items-center justify-between w-full pa1">
        <Link
          to="/"
          className="hover:bg-secondary hover:text-primary w-auto p-3 font-medium"
        >
          Go To Home
        </Link>
        <span className="fr right-[4rem]">
          <img className="lg:h-20 h-10" src={logo} alt="Logo" />
        </span>
      </div>

      <div className="flex flex-col items-center lg:w-2/5">
        <div className="flex flex-col items-center w-full">
          <div className="lg:text-[5rem] text-[3rem] font-semibold">Tic Tac</div>
          <div
            onClick={resetGame}
            className="oswald-font hover:bg-secondary hover:text-primary font-medium cursor-pointer p-3 tc"
          >
            Reset Game
          </div>
        </div>
        <div className="flex flex-col items-center mt-10 w-full">
          <div className="flex relative flex-row w-full flex-wrap items-center justify-center">
            {Object.keys(board).map((boxId) => (
              <div
                key={boxId}
                className={`w-1/3 relative  ${
                  boxId[1] !== "3" && boxId[1] !== "6" && boxId[1] !== "9" ? "border-r" : ""
                } ${boxId[1] !== "7" && boxId[1] !== "8" && boxId[1] !== "9" ? "border-b" : ""} border-primary pa3 pointer hover-gold`}
              >
                <input
                  type="text"
                  value={board[boxId] || ""}
                  readOnly
                  className="bg-secondary outline-none w-full lg:h-[11rem] text-[4rem] text-primary cursor-pointer text-center"
                  onClick={() => handleBoxClick(boxId)}
                />
              </div>

            ))}
          </div>

          <div
            id="print"
            className="bg-white text-black oswald-font font-medium mt-10 px-5 py-3"
          >
            {message}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Games;
