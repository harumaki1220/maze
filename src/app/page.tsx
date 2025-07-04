'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

const directions = [
  [-1, 0], // 上
  [1, 0], // 下
  [0, -1], // 左
  [0, 1], // 右
];

const MAZE_WIDTH = 25;
const MAZE_HEIGHT = 25;

const CELL_TYPE = {
  PATH: 0,
  WALL: 1,
  START: 2,
  GOAL: 3,
};

const initializeBoard = (cell: number = 0) => {
  const newBoard = Array.from({ length: MAZE_HEIGHT }, () =>
    Array.from({ length: MAZE_WIDTH }, () => cell),
  );

  // 外壁
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    for (let x = 0; x < MAZE_WIDTH; x++) {
      if (y === 0 || y === MAZE_HEIGHT - 1 || x === 0 || x === MAZE_WIDTH - 1) {
        newBoard[y][x] = CELL_TYPE.WALL;
      }
    }
  }

  // 1マスごとに壁
  for (let y = 2; y < MAZE_HEIGHT - 1; y += 2) {
    for (let x = 2; x < MAZE_WIDTH - 1; x += 2) {
      newBoard[y][x] = CELL_TYPE.WALL;
    }
  }

  // スタート&ゴールの定義
  newBoard[1][1] = CELL_TYPE.START;
  newBoard[MAZE_HEIGHT - 2][MAZE_WIDTH - 2] = CELL_TYPE.GOAL;

  return newBoard;
};

export default function Home() {
  const [board, setboard] = useState<number[][]>([]);

  useEffect(() => {
    setboard(initializeBoard());
  }, []);

  const generateMaze = () => {
    const newBoard = initializeBoard();
    for (let y = 2; y < MAZE_HEIGHT - 1; y += 2) {
      for (let x = 2; x < MAZE_WIDTH - 1; x += 2) {
        let validDirections = directions.filter(([dy, dx]) => {
          const newY = y + dy * 2; // 2マス先が壁でないことを確認
          const newX = x + dx * 2;
          return (
            newY > 0 &&
            newY < MAZE_HEIGHT - 1 &&
            newX > 0 &&
            newX < MAZE_WIDTH - 1 &&
            newBoard[newY][newX] === CELL_TYPE.PATH
          );
        });

        // 最初の行(y=2)の棒は上には倒さない
        if (y === 2) {
          validDirections = validDirections.filter(([dy]) => dy !== -1);
        }

        const [dy, dx] = directions[Math.floor(Math.random() * directions.length)];
        newBoard[y + dy][x + dx] = CELL_TYPE.WALL;
      }
    }
    setboard(newBoard);
  };

  return (
    <div className={styles.container}>
      <h1>ジェミナイ(仮)が迷路を自動で解くよ！！</h1>
      <div className={styles.board} style={{ gridTemplateColumns: `repeat(${MAZE_WIDTH}, 20px)` }}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              style={{
                backgroundColor:
                  cell === CELL_TYPE.WALL
                    ? '#333' // 壁
                    : cell === CELL_TYPE.START
                      ? '#4caf50' // スタート
                      : cell === CELL_TYPE.GOAL
                        ? '#f44336' // ゴール
                        : '#fff', // 道
              }}
            />
          )),
        )}
      </div>
      <button onClick={generateMaze} className={styles.button}>
        迷路を生成
      </button>
    </div>
  );
}
