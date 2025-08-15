import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import TicTacToe from './pages/ttt';
import PowerpuffJeans from './pages/ppj';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ttt" element={<TicTacToe />} />
        <Route path="/ppj" element={<PowerpuffJeans />} />
      </Routes>
    </Router>
  );
}

export default App;

