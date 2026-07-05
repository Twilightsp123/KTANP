import React from 'react';

export const BigButtonManual: React.FC = () => {
  return (
    <div className="manual-full-page">
      <div className="rulebook-fullscreen">
        <h1 className="rulebook-title">⚠ 协议手册：巨型按钮 (The Big Button)</h1>
        <p className="rulebook-subtitle">级别：绝密 / LEVEL 4 CLEARANCE REQUIRED</p>
        
        <p style={{ color: '#ccc', marginBottom: '20px' }}>
          *注意：操作前，请务必确认炸弹外壳边缘的<strong>【全局属性（序列号、电池、标签）】</strong>，它们将决定你的生死。
        </p>

        <div className="rule-blocks-grid">
          <div className="rule-block full-width-block">
            <h3>第一步：行为判定 (点按 还是 长按)</h3>
            <p>请严格按照以下顺序进行逻辑判断，一旦符合条件立即执行：</p>
            <ol>
              <li>如果按钮是 <strong>蓝色</strong> 且文字是 <strong>“中止”</strong>，请 <strong>长按</strong> 按钮。</li>
              <li>如果按钮文字是 <strong>“引爆”</strong> 且炸弹上有 <strong>多于 1 节电池</strong>，请 <strong>点按</strong> 按钮（立刻松开）。</li>
              <li>如果按钮是 <strong>白色</strong> 且炸弹上有 <strong>“通讯(CAR)”标签</strong>，请 <strong>长按</strong> 按钮。</li>
              <li>如果以上条件都不满足，请直接 <strong>长按</strong> 按钮。</li>
            </ol>
          </div>

          <div className="manual-section">
          <h3>第二步：长按释放时机</h3>
          <p>
            如果你开始长按按钮，按钮上方的 <strong>3 颗指示灯</strong> 会变成跑马灯开始高速循环闪烁。<br/>
            在按下之前，你可以观察这 3 颗灯的默认颜色（红、蓝、黄）。<br/>
            请根据以下规则，当跑马灯<strong>亮到特定的灯</strong>时，立即松开按钮：
          </p>
          <ul className="rule-list">
            <li>
              <strong>如果炸弹上的电池数量大于 2：</strong>
              <p>在【黄色的灯】亮起时松手。</p>
            </li>
            <li>
              <strong>否则，如果按钮是蓝色的：</strong>
              <p>在【最右侧的那颗灯（第三颗灯）】亮起时松手。</p>
            </li>
            <li>
              <strong>否则，如果按钮上写着“中止”：</strong>
              <p>在【红色的灯】亮起时松手。</p>
            </li>
            <li>
              <strong>否则（以上都不符合）：</strong>
              <p>在【最左侧的第一颗灯】亮起时松手。</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};
