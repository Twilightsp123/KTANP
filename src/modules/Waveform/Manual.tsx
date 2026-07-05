import React from 'react';

export const WaveformManual: React.FC = () => {
  return (
    <div className="manual-full-page">
      <div className="rulebook-fullscreen">
        <h1 className="rulebook-title">⚠ 协议手册：空间波段校准</h1>
        <p className="rulebook-subtitle">级别：绝密 / LEVEL 4 CLEARANCE REQUIRED</p>
        
        <p style={{ color: '#ccc', marginBottom: '30px' }}>
          *系统可能受到高能射线干扰，你必须根据上方**频段指示灯**的颜色，连续3次将示波器校准到指定频率。
        </p>

        <div className="rule-blocks-grid">
          <div className="rule-block">
            <h3 style={{ color: '#ff00ff' }}>🟣 紫光频段 (Purple)</h3>
            <p>该频段存在高压干扰。为防止过载，必须压平波动并拉长波距：</p>
            <ul>
              <li>AMPLITUDE (振幅): <strong>LOW (最低)</strong></li>
              <li>FREQUENCY (频率): <strong>LOW (最低)</strong></li>
            </ul>
          </div>

          <div className="rule-block">
            <h3 style={{ color: '#ffff00' }}>🟡 黄光频段 (Yellow)</h3>
            <p>常规侦测频段。需要极其密集的波纹来扫描微小异常：</p>
            <ul>
              <li>AMPLITUDE (振幅): <strong>MED (中等)</strong></li>
              <li>FREQUENCY (频率): <strong>HIGH (最高)</strong></li>
            </ul>
          </div>

          <div className="rule-block">
            <h3 style={{ color: '#00ffff' }}>🔵 青光频段 (Cyan)</h3>
            <p>深空通讯频段。需要强大的能量穿透力：</p>
            <ul>
              <li>AMPLITUDE (振幅): <strong>HIGH (最高)</strong></li>
              <li>FREQUENCY (频率): <strong>MED (中等)</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
