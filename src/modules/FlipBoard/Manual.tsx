import React from 'react';

export const FlipBoardManual: React.FC = () => {
  return (
    <div style={{ color: 'var(--color-text-main)', textAlign: 'left', padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'var(--color-panel-bg)', border: '1px solid var(--color-neon-red)', borderRadius: '4px', boxShadow: '0 0 15px rgba(255, 42, 42, 0.2)' }}>
      <h2 style={{ color: 'var(--color-neon-red)', borderBottom: '1px solid var(--color-neon-red)', paddingBottom: '10px' }}>
        ⚠ 解密手册：7G 扇区 上下耦合翻板
      </h2>
      
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: 'var(--color-neon-gold)' }}>规则 1：镜像锁 (Mirror Lock)</h3>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderLeft: '3px solid var(--color-neon-gold)' }}>
          <p>如果【上层矩阵】翻出 <strong>金色倒三角</strong>，且相邻位置有 <strong>蓝色太阳</strong>：</p>
          <ul>
            <li>【下层矩阵】必须进行校准。</li>
            <li>请在【下层矩阵】中找出 <strong>红色星星</strong> 并将其翻开激活。</li>
            <li>绝对不要点击或激活下层的其他任何节点。</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: 'var(--color-neon-gold)' }}>规则 2：扇区屏蔽 (Sector Shield)</h3>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderLeft: '3px solid var(--color-neon-gold)' }}>
          <p>如果【上层矩阵】四个角的图案中，有三个角是 <strong>同一种颜色</strong>：</p>
          <ul>
            <li>【下层矩阵】的对角线节点必须保持“离线（未翻开）”状态。</li>
          </ul>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', letterSpacing: '2px' }}>
        [绝密档案结束]
      </div>
    </div>
  );
};
