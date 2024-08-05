//import logo from './logo.svg';
import './App.css';
import Homepage from './components/Homepage';
import Header from './components/Header';
import Colorblindness from './components/Colorblindness';
import Correction from './components/Correction';
import CamWin from './components/CamWin';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/colorblindness" element={<Colorblindness />} />
        <Route path="/correction" element={<Correction />} />
        <Route path="/handlan" element={<CamWin />}/>
      </Routes>
    </div>
  );
}

export default App;
