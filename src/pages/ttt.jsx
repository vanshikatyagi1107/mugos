import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ttt.css";

// ----- THEME PRESETS -----
const THEMES = {
  ghibli: {
    name: "Ghibli",
    boardBg: "#fafafa",
    cellBg: "#ffffff",
    boardBorder: "#222222",
    xColor: "#d90429",
    oColor: "#1d3557",
    highlight: "#ffd166",
    xGlyph: "/assets/t1-x-ghibli.png",
    oGlyph: "/assets/t1-o-starblue.png",
  },
  berry: {
    name: "Berry",
    boardBg: "#fcb467ff",
    cellBg: "#fffdc4ff",
    boardBorder: "#6e60c0ff",
    xColor: "#f97316",
    oColor: "#22d3ee",
    highlight: "#cfd3ffff",
    xGlyph: "/assets/t2-x-strawberry.png",
    oGlyph: "/assets/t2-o-blueberry.png",
  },
  fleur: {
    name: "Fleur",
    boardBg: "#93bc5eff",
    cellBg: "#e2ffb9ff",
    boardBorder: "#2a2a2a",
    xColor: "#ff00ff",
    oColor: "#00ffff",
    highlight: "#d9ffd9ff",
    xGlyph: "/assets/t3-x-daisy.png",
    oGlyph: "/assets/t3-o-bee.png",
  },
  pastel: {
    name: "Pastel",
    boardBg: "#fff7ed",
    cellBg: "#fffaf0",
    boardBorder: "#f4e1c1",
    xColor: "#f59e0b",
    oColor: "#60a5fa",
    highlight: "#a7f3d0",
    xGlyph: "X",
    oGlyph: "O",
  },
};

// ----- WINNING COMBOS -----
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [themeKey, setThemeKey] = useState("ghibli");
  const theme = THEMES[themeKey];

  const { winner, line } = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Draw"
    : `Next: ${isXNext ? "X" : "O"}`;

  function handleSquareClick(i) {
    if (squares[i] || winner) return;
    const next = squares.slice();
    next[i] = isXNext ? "X" : "O";
    setSquares(next);
    setIsXNext(!isXNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  return (
    <div className="tictactoe-container">
      
      <div className="game"  style={{ fontFamily: "'DynaPuff', cursive",
      color: "black" }}>
        {/* Background patterns */}
      <div className="pattern left">
        <img src="/assets/box-pink.png" className="shift"alt="" />
        <img src="/assets/box-yellow.png"  alt="" />
        <img src="/assets/box-blue.png" className="shift"alt="" />
        <img src="/assets/box-peach.png" alt="" />
        <img src="/assets/box-bluedark.png" className="shift"alt="" />
        <img src="/assets/box-orange.png"  alt="" />
        <img src="/assets/box-bluedarker.png"className="shift" alt="" />
      </div>

      <div className="pattern right">
        <img src="/assets/box-pink.png"className="shift" alt="" />
        <img src="/assets/box-yellow.png"  alt="" />
        <img src="/assets/box-blue.png"className="shift" alt="" />
        <img src="/assets/box-peach.png" alt="" />
        <img src="/assets/box-bluedark.png" className="shift" alt="" />
        <img src="/assets/box-orange.png"  alt="" />
        <img src="/assets/box-bluedarker.png" className="shift" alt="" />
      </div>
      {/* Game */}
        <h1 style={{ fontFamily: "'Limelight', sans-serif",
      color: "black" }}>Tic-Tac-Toe</h1>

        <div className="controls">
          <label>
            Theme:&nbsp;
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value)}
              aria-label="Select theme"
            >
              {Object.entries(THEMES).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={resetGame} aria-label="Reset game">
            Reset
          </button>
        </div>

        <div className="status">{status}</div>

        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={line}
          theme={theme}
        />

        <footer className="legend">
          <span style={{ color: theme.xColor, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isImage(theme.xGlyph) ? (
              <img src={theme.xGlyph} alt="X" style={{ width: 32, height: 32 }} />
            ) : theme.xGlyph}
            = Player X
          </span>
          <span style={{ color: theme.oColor, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isImage(theme.oGlyph) ? (
              <img src={theme.oGlyph} alt="O" style={{ width: 32, height: 32 }} />
            ) : theme.oGlyph}
            = Player O
          </span>
        </footer>
      </div>
    </div>
  );
  
}

function Board({ squares, onSquareClick, winningLine, theme }) {
  return (
    <div className="board" style={{ background: theme.boardBg, borderColor: theme.boardBorder }}>
      {squares.map((val, idx) => {
        const isWin = winningLine.includes(idx);
        return (
          <Square
            key={idx}
            value={val}
            onClick={() => onSquareClick(idx)}
            isWinning={isWin}
            theme={theme}
            index={idx}
          />
        );
      })}
    </div>
  );
}

function Square({ value, onClick, isWinning, theme, index }) {
  const glyph =
    value === "X" ? theme.xGlyph : value === "O" ? theme.oGlyph : "";
  const color =
    value === "X" ? theme.xColor : value === "O" ? theme.oColor : "#F89DBC";
  const img = isImage(glyph);

  return (
    <button
      className={`square ${isWinning ? "win" : ""}`}
      onClick={onClick}
      style={{
        color,
        borderColor: theme.boardBorder,
        background: theme.cellBg,
        boxShadow: isWinning ? `0 0 12px ${theme.highlight}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={`cell ${index + 1}`}
    >
      {glyph && (img ? <img src={glyph} alt={value} style={{ width: 48, height: 48 }} /> : glyph)}
    </button>
  );
}

function isImage(path) {
  return typeof path === "string" && /\.(png|jpg|jpeg|svg)$/i.test(path);
}
