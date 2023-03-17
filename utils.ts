import { StoneColor, getAdjacentPoints } from './app'; // Add this import at the top
const boardSize = 9; 

export const calculateScores = (gameState: any) => {
  let blackTerritory = 0;
  let whiteTerritory = 0;
  let blackStones = 0;
  let whiteStones = 0;

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const stone = gameState[y][x];
      if (stone === StoneColor.BLACK) {
        blackStones++;
      } else if (stone === StoneColor.WHITE) {
        whiteStones++;
      } else {
        const neighbors = getAdjacentPoints(x, y);
        const blackNeighbors = neighbors.filter(
          (point) => gameState[point.y][point.x] === StoneColor.BLACK
        );
        const whiteNeighbors = neighbors.filter(
          (point) => gameState[point.y][point.x] === StoneColor.WHITE
        );

        if (blackNeighbors.length === neighbors.length) {
          blackTerritory++;
        } else if (whiteNeighbors.length === neighbors.length) {
          whiteTerritory++;
        }
      }
    }
  }

  return {
    black: blackStones + blackTerritory,
    white: whiteStones + whiteTerritory,
  };
};
