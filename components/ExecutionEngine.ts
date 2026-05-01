import { Block, Direction, Level } from '@/lib/types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runScript(
  script: Block[],
  level: Level,
  onStep: (pos: {x: number, y: number}, dir: Direction) => void
) {
  let pos = { ...level.start };
  let dir = level.startDir;

  const executeBlock = async (block: Block) => {
    if (block.type === 'moveForward') {
      const newPos = getNewPosition(pos, dir);
      if (level.grid[newPos.y]?.[newPos.x] === '#') {
        return false; // đụng tường
      }
      pos = newPos;
      onStep(pos, dir);
      await sleep(350);
    } 
    else if (block.type === 'turnLeft') dir = turnLeft(dir);
    else if (block.type === 'turnRight') dir = turnRight(dir);
    else if (block.type === 'repeat' && block.children) {
      for (let i = 0; i < (block.value || 3); i++) {
        for (const child of block.children) {
          const success = await executeBlock(child);
          if (!success) return false;
        }
      }
    } 
    else if (block.type === 'ifWall' && block.children) {
      const nextPos = getNewPosition(pos, dir);
      if (level.grid[nextPos.y]?.[nextPos.x] === '#') {
        for (const child of block.children) {
          const success = await executeBlock(child);
          if (!success) return false;
        }
      }
    }
    return true;
  };

  for (const block of script) {
    const success = await executeBlock(block);
    if (!success) {
      return { success: false, message: "🤖 Robot đụng tường rồi!" };
    }
  }

  const success = level.grid[pos.y]?.[pos.x] === 'E';
  return { 
    success, 
    message: success ? "🎉 Tuyệt vời! Robot đến cờ rồi!" : "Chưa đến cờ rồi con ơi!" 
  };
}

// Các hàm hỗ trợ giữ nguyên
function getNewPosition(pos: any, dir: Direction) {
  const delta: any = { up: {y:-1}, down:{y:1}, left:{x:-1}, right:{x:1} };
  return { x: pos.x + (delta[dir].x||0), y: pos.y + (delta[dir].y||0) };
}

function turnLeft(d: Direction): Direction {
  return { up:'left', left:'down', down:'right', right:'up' }[d] as Direction;
}

function turnRight(d: Direction): Direction {
  return { up:'right', right:'down', down:'left', left:'up' }[d] as Direction;
}