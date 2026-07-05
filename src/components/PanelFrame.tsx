import React from 'react';
import './PanelFrame.css';
import { useBomb } from '../core/BombContext';

interface PanelFrameProps {
  title: string;
  children: React.ReactNode;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const PanelFrame: React.FC<PanelFrameProps> = ({ title, children }) => {
  const { timeLeft, status, metaData, startBomb } = useBomb();

  return (
    <div className={`panel-frame status-${status.toLowerCase()}`}>
      <div className="panel-header">
        <div className="panel-title">{title}</div>
        
        <div className="bomb-timer-container">
          {status === 'IDLE' && (
            <button className="start-bomb-btn" onClick={startBomb}>▶ START SYSTEM</button>
          )}
          {status === 'RUNNING' && (
            <div className={`bomb-timer ${timeLeft <= 30 ? 'critical' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          )}
          {status === 'EXPLODED' && (
            <div className="bomb-timer exploded">SYSTEM FAILURE</div>
          )}
        </div>

        <div className="panel-decorations">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="line"></span>
        </div>
      </div>

      <div className="panel-content">
        {status === 'EXPLODED' ? (
          <div className="explosion-screen">
            <h1>CATASTROPHIC FAILURE</h1>
            <p>The facility has been compromised.</p>
          </div>
        ) : children}
      </div>
      <div className="panel-footer">
        <div className="status-text">CONN: SECURE</div>
        <div className="status-bar"></div>
      </div>
    </div>
  );
};
