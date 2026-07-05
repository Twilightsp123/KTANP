import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PanelFrame } from './components/PanelFrame';
import { TerminalBinder } from './components/TerminalBinder';
import { ManualBinder } from './components/ManualBinder';
import { CommunicationProvider } from './core/CommunicationContext';
import { BombProvider } from './core/BombContext';
import './App.css';

function App() {
  return (
    <BombProvider>
      <CommunicationProvider>
        <Router>
          <div className="app-container">
            <div style={{ marginTop: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/terminal" replace />} />
                <Route path="/terminal" element={
                  <PanelFrame title="TERMINAL / BOMB INTERFACE">
                    <TerminalBinder />
                  </PanelFrame>
                } />
                <Route path="/manual" element={
                  <ManualBinder />
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
