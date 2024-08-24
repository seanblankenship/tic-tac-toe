import { useState } from 'react';

function Square({ value, onSquareClick }) {

  let color; 
  if (value==='X') {
    color = 'bg-blue-200 text-blue-900';
  } else if (value==='O') {
    color = 'bg-red-200 text-red-900';
  } else {
    color = 'available bg-white';
  }
  return (
    <button className={"square font-bold " + color} onClick={onSquareClick}>
      {value}
    </button>
  );

}

function Board({ xIsNext, squares, onPlay, currentMove }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const build = [];
  for (let i = 0; i < squares.length; i++) {
    build.push(<Square value={squares[i]} onSquareClick={() => handleClick(i)} key={i} />);
  }

  const winner = calculateWinner(squares);
  let status = '', bgColor = '', statusData = '';
  if (winner) {
    status = "Player " + winner + " WINS!";
    bgColor = (winner==='X') ? 'bg-blue-900' : 'bg-red-900';
    statusData = 'winner-' + winner;
  } else if (currentMove === 9) {
    status = "It's a draw!";
    bgColor = 'bg-green-900';
    statusData = 'draw';
  } else {
    status = "It is Player " + (xIsNext ? "X" : "O") + "'s Turn";
    bgColor = 'bg-gray-800';
    statusData = 'continue';
  }

  return (
    <>
      {build}
      <div className={"status text-2xl text-white text-center p-5 mt-5 " + bgColor} data-status={statusData}>{status}</div>
    </>
  );

}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); 
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = ([...history.slice(0, currentMove + 1), nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Move #' + move;
    } else {
      description = 'Start of Game';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game p-5">
      <h1 className="text-center text-4xl text-white font-bold mb-5">tic-tac-toe</h1>
      <div className="game-board bg-gray-800 p-5 max-w-2xl rounded grid grid-cols-3">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info bg-gray-800 text-white p-5 max-w-2xl mt-5 rounded">
        <h2 className="font-bold text-2xl mb-2">Move History</h2>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) { 
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}