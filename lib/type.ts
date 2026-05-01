export type Direction = 'up' | 'down' | 'left' | 'right';

export type BlockType = 'moveForward' | 'turnLeft' | 'turnRight' | 'repeat' | 'ifWall';

export interface Block {
  id: string;
  type: BlockType;
  value?: number;           // số lần lặp cho Repeat
  condition?: 'wall';       // cho If
  children?: Block[];       // khối con bên trong Repeat hoặc If
}