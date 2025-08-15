import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  return (
    <>
    <div className="bg-grid"></div>
      {/* Background layer */}
      <div className="bg-container">
        <div id="star-1" className="bg star"></div>
        <div id="star-11" className="bg star"></div>
        <div id="star-2" className="bg star"></div>
        <div id="star-3" className="bg star"></div>
        <div id="star-4" className="bg star"></div>

        <div id="wave-1" className="bg wave"></div>
        <div id="wave-2" className="bg wave"></div>
        <div id="wave-3" className="bg wave"></div>
        <div id="wave-4" className="bg wave"></div>
        <div id="wave-5" className="bg wave"></div>
      </div>

      {/* Main content */}
      <div className="home-container">
        <h1 className="title">MUGOS</h1>
        <p className="subtitle">your portal to fun</p>

        {/* Game cards */}
        <div className="game-grid">
          <Link to="/ttt" className="game-card">
            <div className="image-wrapper">
              <img
                src="/assets/ttt.png"
                alt="Tic Tac Toe"
                className="game-image"
              />
            </div>
            <p className="game-title">TIC-TAC-TOE</p>
          </Link>

          <Link to="/ppj" className="game-card">
            <div className="image-wrapper">
              <img
                src="/assets/ppj.png"
                alt="Powerpuff Jeans"
                className="game-image"
              />
            </div>
            <p className="game-title">POWERPUFF JEANS</p>
          </Link>
        </div>
      </div>
    </>
  );
}
