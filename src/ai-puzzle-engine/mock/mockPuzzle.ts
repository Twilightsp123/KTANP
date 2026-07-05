import { PuzzleData } from '../types/schema';

export const mockPuzzleData: PuzzleData = {
  id: "mock_puzzle_01",
  title: "逃离反重力陷阱",
  instruction_manual: "# 欢迎来到测试舱\n\n**目标**：将玩家(绿色)移动到目标点(黄色)。\n\n**提示**：红色的是不可穿透的墙壁。在这个沙盒里，你可以定义自己的规则！",
  mechanics: {
    grid_width: 8,
    grid_height: 8,
    rules: [
      {
        trigger: "ON_COLLISION",
        conditions: [
          { subject: "SELF", property: "type", operator: "==", value: "Player" },
          { subject: "TARGET", property: "type", operator: "==", value: "Goal" }
        ],
        actions: [
          { type: "WIN_GAME", payload: null }
        ]
      }
    ]
  },
  entities: [
    { id: "e1", type: "Player", position: { x: 1, y: 1 }, properties: { color: "#4ade80" } },
    { id: "e2", type: "Goal", position: { x: 6, y: 6 }, properties: { color: "#facc15" } },
    { id: "e3", type: "Wall", position: { x: 3, y: 2 }, properties: { color: "#f87171" } },
    { id: "e4", type: "Wall", position: { x: 3, y: 3 }, properties: { color: "#f87171" } },
    { id: "e5", type: "Wall", position: { x: 3, y: 4 }, properties: { color: "#f87171" } }
  ]
};
