import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PuzzleRegistry } from './core/PuzzleRegistry';
import { PanelFrame } from './components/PanelFrame';
import { CommunicationProvider } from './core/CommunicationContext';
import { BombProvider } from './core/BombContext';
import './App.css';

function App() {
  const activePuzzle = PuzzleRegistry[0];

  return (
    <BombProvider>
      <CommunicationProvider>
        <Router>
          <div className="app-container">
            {/* Nav removed for production immersion */}
            <div style={{ marginTop: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/terminal" replace />} />
                <Route path="/terminal" element={
                  <PanelFrame title={`TERMINAL / ${activePuzzle.name.toUpperCase()}`}>
                    <activePuzzle.TerminalUI />
                  </PanelFrame>
                } />
                <Route path="/manual" element={
                  <activePuzzle.ManualUI />
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </CommunicationProvider>
    </BombProvider>
  );
}

export default App;
