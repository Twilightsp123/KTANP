import React, { useState } from 'react';
import { PuzzleRegistry } from '../core/PuzzleRegistry';
import { FloatingCommsWidget } from './FloatingCommsWidget';
import './ManualBinder.css';

export const ManualBinder: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = PuzzleRegistry.length;

  const handlePrev = () => {
    setCurrentPage(p => Math.max(0, p - 1));
  };

  const handleNext = () => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  };

  return (
    <div className="manual-binder-container">
      <div className="binder-book">
        
        {/* Pagination Controls Top */}
        <div className="binder-nav">
          <button className="nav-btn" onClick={handlePrev} disabled={currentPage === 0}>◀ 上一页</button>
          <span className="page-indicator">第 {currentPage} 页 / 共 {totalPages} 页</span>
          <button className="nav-btn" onClick={handleNext} disabled={currentPage === totalPages}>下一页 ▶</button>
        </div>

        <div className="binder-page-content">
          {currentPage === 0 ? (
            <div className="manual-full-page">
              <div className="rulebook-fullscreen">
                <h1 className="rulebook-title">⚠ 拆弹协议总纲</h1>
                <p className="rulebook-subtitle">请根据操作员的描述，迅速翻阅至对应章节。</p>
                
                <div className="table-of-contents">
                  {PuzzleRegistry.map((puzzle, idx) => (
                    <div key={puzzle.id} className="toc-item" onClick={() => setCurrentPage(idx + 1)}>
                      <span className="toc-chap">第 {idx + 1} 章</span>
                      <span className="toc-title">{puzzle.name}</span>
                      <span className="toc-dots">.......................................................................</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            React.createElement(PuzzleRegistry[currentPage - 1].ManualUI)
          )}
        </div>
      </div>
      
      {/* Global Comms for Decoder */}
      <FloatingCommsWidget />
    </div>
  );
};
