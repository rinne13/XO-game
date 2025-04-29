import { useState } from "react";
import "./gameboard-style.scss";

enum Mode {
    Friend = "friend",
    Bot = "bot",
}

enum Player {
    X = "X",
    O = "O",
}

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

const GameBoard = () => {
    const [mode, setMode] = useState<Mode | null>(null);
    const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.X);
    const [winner, setWinner] = useState<string | null>(null);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer(Player.X);
        setWinner(null);
        setMode(null);
    };

    const checkWinner = (board: Array<string | null>): string | null => {
        for (let [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const makeComputerMove = (currentBoard: Array<string | null>) => {
        const emptyIndexes = currentBoard
            .map((val, i) => (val === null ? i : null))
            .filter((v): v is number => v !== null);

        if (emptyIndexes.length === 0) return;

        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const newBoard = [...currentBoard];
        newBoard[randomIndex] = Player.O;
        setBoard(newBoard);

        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
        }
    };

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];

        if (mode === Mode.Friend) {
            newBoard[index] = currentPlayer;
            setBoard(newBoard);

            const win = checkWinner(newBoard);
            if (win) {
                setWinner(win);
            } else {
                setCurrentPlayer(currentPlayer === Player.X ? Player.O : Player.X);
            }
        }

        if (mode === Mode.Bot) {
            newBoard[index] = Player.X;
            setBoard(newBoard);

            const win = checkWinner(newBoard);
            if (win) {
                setWinner(win);
                return;
            }

            setTimeout(() => {
                makeComputerMove(newBoard);
            }, 300);
        }
    };

    const renderStatus = () => {
        if (winner) return <h2>🎉 The winner is {winner}!</h2>;
        if (board.every(cell => cell !== null)) return <h2>It's a draw!</h2>;
        if (mode === Mode.Bot) return <h2>You are X (vs Computer)</h2>;
        return <h2>Current turn: {currentPlayer}</h2>;
    };

    if (mode === null) {
        return (
            <div className="mode-select">
                <h2>Choose Game Mode</h2>
                <button onClick={() => setMode(Mode.Friend)}>2 Players</button>
                <button onClick={() => setMode(Mode.Bot)}>Play vs Computer</button>
            </div>
        );
    }

    return (
        <>
            <div className="status">{renderStatus()}</div>

            <div className="board">
                {board.map((value, index) => (
                    <button key={index} className="square" onClick={() => handleClick(index)}>
                        {value}
                    </button>
                ))}
            </div>

            <button className="reset" onClick={resetGame}>
                New Game
            </button>
        </>
    );
};

export default GameBoard;
