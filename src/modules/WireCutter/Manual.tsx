import React from 'react';
import { FloatingCommsWidget } from '../../components/FloatingCommsWidget';
import '../../components/FloatingComms.css';

export const WireCutterManual: React.FC = () => {
  return (
    <div className="manual-full-page">
      <div className="rulebook-fullscreen">
        <h1 className="rulebook-title">⚠ 协议手册：高压线缆剪切</h1>
        <p className="rulebook-subtitle">级别：绝密 / LEVEL 4 CLEARANCE REQUIRED</p>
        
        <div className="rule-blocks-grid">
          <div className="rule-block">
            <h3>规则 1：缺乏红色</h3>
            <p>如果线缆中 <strong>没有任何一根是红色的</strong>：</p>
            <ul>
              <li>请剪断 <strong>第二根线</strong>。</li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>规则 2：末位白线</h3>
            <p>如果不满足上一条，且 <strong>最后一根线是白色的</strong>：</p>
            <ul>
              <li>请剪断 <strong>最后一根线</strong>。</li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>规则 3：多重蓝线</h3>
            <p>如果不满足以上情况，且 <strong>蓝色线缆的数量大于一根</strong>：</p>
            <ul>
              <li>请剪断 <strong>最后一根蓝色的线</strong>。</li>
            </ul>
          </div>

          <div className="rule-block">
            <h3>规则 4：默认状态</h3>
            <p>如果以上所有情况均不满足：</p>
            <ul>
              <li>请剪断 <strong>最后一根线</strong>。</li>
            </ul>
          </div>
        </div>
      </div>

      <FloatingCommsWidget />
    </div>
  );
};
