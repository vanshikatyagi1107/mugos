import { useState, useEffect, useRef } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Idle sprites for selection screen
const idleGirls = [
  '/assets/girl-still-blue.png',
  '/assets/girl-still-green.png',
  '/assets/girl-still-purple.png',
  '/assets/girl-still-yellow.png',
  '/assets/girl-still-pink.png',
];

// Flying sprites for gameplay
const flyingGirls = [
  '/assets/girl-fly-blue.png',
  '/assets/girl-fly-green.png',
  '/assets/girl-fly-purple.png',
  '/assets/girl-fly-yellow.png',
  '/assets/girl-fly-pink.png',
];

function PowerpuffJeans() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2);
  const [hearts, setHearts] = useState([{ x: 900, y: 100 }]);
  const [obstacles, setObstacles] = useState([{ x: 1200, y: 300 }]);
  const [score, setScore] = useState(0);
  const [bgX, setBgX] = useState(0);

  const [musicPlaying, setMusicPlaying] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const audioRef = useRef(null);

  const heartsRef = useRef(hearts);
  const obstaclesRef = useRef(obstacles);
  const playerYRef = useRef(playerY);

  heartsRef.current = hearts;
  obstaclesRef.current = obstacles;
  playerYRef.current = playerY;

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setMusicPlaying(!musicPlaying);
  };

  const resetGame = () => {
    setScore(0);
    setPlayerY(GAME_HEIGHT / 2);
    setHearts([{ x: 900, y: 100 }]);
    setObstacles([{ x: 1200, y: 300 }]);
    setGameOver(false);
    setGameStarted(false);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!gameStarted) {
        if (e.key === 'ArrowLeft') setSelectedIdx((idx) => (idx > 0 ? idx - 1 : idleGirls.length - 1));
        if (e.key === 'ArrowRight') setSelectedIdx((idx) => (idx < idleGirls.length - 1 ? idx + 1 : 0));
        if (e.key === 'Enter') setGameStarted(true);
      } else if (!gameOver) {
        if (e.key === 'ArrowUp') setPlayerY((y) => Math.max(0, y - 20));
        if (e.key === 'ArrowDown') setPlayerY((y) => Math.min(GAME_HEIGHT - 80, y + 20));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setHearts((prev) => prev.map(h => ({ ...h, x: h.x - 5 })));
      setObstacles((prev) => prev.map(o => ({ ...o, x: o.x - 7 })));

      setHearts((prev) =>
        prev.filter((h) => {
          const collided = Math.abs(h.x - 100) < 50 && Math.abs(h.y - playerYRef.current) < 50;
          if (collided) setScore((s) => s + 1);
          return !collided;
        })
      );

      obstaclesRef.current.forEach((o) => {
        if (Math.abs(o.x - 100) < 50 && Math.abs(o.y - playerYRef.current) < 50) {
          setGameOver(true);
        }
      });

      if (Math.random() < 0.02) setHearts((prev) => [...prev, { x: 900, y: Math.random() * (GAME_HEIGHT - 50) }]);
      if (Math.random() < 0.01) setObstacles((prev) => [...prev, { x: 900, y: Math.random() * (GAME_HEIGHT - 60) }]);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, score, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const bgLoop = setInterval(() => {
      setBgX((prev) => (prev - 2) % GAME_WIDTH);
    }, 50);

    return () => clearInterval(bgLoop);
  }, [gameStarted, gameOver]);

  if (!gameStarted) {
    return (
      <div
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url("/assets/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '2px solid black',
          position: 'relative',
        }}
      >
        {/* Audio for selection screen */}
        <audio ref={audioRef} src="/assets/njz.mp3" loop autoPlay />

        {/* Music toggle button */}
        <div
          onClick={toggleMusic}
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          {musicPlaying ? (
            <img src="/assets/music-on.png" alt="Music On" style={{ height: 32, filter: 'invert(1)' }} />
          ) : (
            <img src="/assets/music-off.png" alt="Music Off" style={{ height: 32, filter: 'invert(1)' }} />
          )}
        </div>

        <div style={{ position: 'absolute', top: 40, textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Shrikhand", serif', fontSize: 50, color: 'darkblue', lineHeight: 1.1 }}>
            POWERPUFF<br />JEANS
          </h1>
        </div>

        {/* Character selection */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40, marginTop: 100 }}>
          {idleGirls.map((girl, idx) => (
            <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
              {idx === selectedIdx && (
                <img
                  src="/assets/arrow.png"
                  alt="Arrow"
                  style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', height: 30 }}
                />
              )}
              <img src={girl} alt={`Girl ${idx + 1}`} style={{ height: 80 }} />
              {idx === selectedIdx && (
                <div style={{ fontFamily: '"Press Start 2P", system-ui', fontSize: 8, color: 'yellow', marginTop: 5 }}>
                  SELECTED
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: 20, fontFamily: '"Press Start 2P", system-ui', color: '#000', fontSize: 12 }}>
          Use ← → to select, Enter to start
        </div>
      </div>
    );
  }

  // Main game
  return (
    <div style={{ width: GAME_WIDTH, height: GAME_HEIGHT, position: 'relative', overflow: 'hidden', border: '2px solid black' }}>
      {/* Audio */}
      <audio ref={audioRef} src="/assets/njz.mp3" loop />

      {/* Music toggle */}
      <div onClick={toggleMusic} style={{ position: 'absolute', top: 15, right: 15, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1000 }}>
        {musicPlaying ? <img src="/assets/music-on.png" alt="Music On" style={{ height: 32 }} /> : <img src="/assets/music-off.png" alt="Music Off" style={{ height: 32 }} />}
      </div>

      {/* Backgrounds */}
      <div style={{ position: 'absolute', top: 0, left: bgX, width: GAME_WIDTH, height: GAME_HEIGHT, backgroundImage: 'url("/assets/bg.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', top: 0, left: bgX + GAME_WIDTH, width: GAME_WIDTH, height: GAME_HEIGHT, backgroundImage: 'url("/assets/bg.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />

      {/* Player */}
      <img src={flyingGirls[selectedIdx]} alt="Player" style={{ position: 'absolute', left: 100, top: playerY, height: 70, userSelect: 'none', pointerEvents: 'none' }} />

      {/* Hearts */}
      {hearts.map((h, i) => <img key={i} src="/assets/bunny.png" alt="Bunny" style={{ position: 'absolute', left: h.x, top: h.y, width: 50, userSelect: 'none', pointerEvents: 'none' }} />)}

      {/* Obstacles */}
      {obstacles.map((o, i) => <img key={i} src="/assets/cloud.png" alt="Cloud" style={{ position: 'absolute', left: o.x, top: o.y, height: 60, userSelect: 'none', pointerEvents: 'none' }} />)}

      {/* Score */}
      <div style={{ position: 'absolute', top: 15, left: 15, fontFamily: '"Press Start 2P", system-ui', fontSize: 18 }}>SCORE: {score}</div>

      {/* Game Over Modal */}
      {gameOver && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.85)', color: 'white', padding: 40, borderRadius: 20, textAlign: 'center', zIndex: 1000, fontFamily: '"Press Start 2P", system-ui' }}>
          <h2 style={{ marginBottom: 20 }}>GAME OVER</h2>
          <p style={{ marginBottom: 20 }}>Score: {score}</p>
          <button onClick={resetGame} style={{ padding: '10px 20px', fontSize: 14, borderRadius: 10, cursor: 'pointer', border: 'none', background: 'yellow', color: 'black', fontFamily: '"Press Start 2P", system-ui' }}>
            RESTART
          </button>
        </div>
      )}
    </div>
  );
}

export default PowerpuffJeans;