import React from 'react';

export const SignalGridManual: React.FC = () => {
  return (
    <div className="manual-full-page">
      <div className="rulebook-fullscreen">
        <h1 className="rulebook-title">⚠ 协议手册：四联指示灯与控制阀</h1>
        <p className="rulebook-subtitle">级别：绝密 / LEVEL 4 CLEARANCE REQUIRED</p>
        
        <div className="rule-blocks-grid">
          <div className="rule-block">
            <h3>规则 1：双红告警</h3>
            <p>如果上方四盏指示灯中 <strong>正好有两个红色</strong>：</p>
            <ul>
              <li>无视其他颜色，依次按下下方操作阀：<strong>A 👉 C 👉 D</strong></li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>规则 2：首位幽蓝</h3>
            <p>如果 <strong>第一盏灯是蓝色</strong>（且不满足规则1）：</p>
            <ul>
              <li>请连续执行两次阀门 B 的排放，最后按 A：<strong>B 👉 B 👉 A</strong></li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>规则 3：常规状态</h3>
            <p>如果以上情况均不满足：</p>
            <ul>
              <li>执行标准重置顺序：<strong>D 👉 C</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
