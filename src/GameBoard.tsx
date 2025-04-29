import React, { useState } from "react";
import "./gameboard-style.scss";

const GameBoard = () => {


    const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<string | null>(null);

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        const win = checkWinner(newBoard)
        if (win) {
            setWinner(win);
        } else {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }

    }

    const checkWinner = (board: Array<string | null>): string | null => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for (let [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    };



    return (
        <>
            <div className="status">
                {winner ? (
                    <h2>🎉 The winner is {winner}!</h2>
                ) : board.every(cell => cell !== null) ? (
                    <h2>It's a draw!</h2>
                ) : (
                    <h2>Current turn: {currentPlayer}</h2>
                )}
            </div>
            <div className="board">
                {board.map((value, index) => (
                    <button key={index} className="square" onClick={() => handleClick(index)}>
                        {value}
                    </button>
                ))}
            </div>
            <button className="reset" onClick={() => {
                setBoard(Array(9).fill(null));
                setCurrentPlayer('X');
                setWinner(null);
            }}>New Game</button>
        </>
    );
};
export default GameBoard;
