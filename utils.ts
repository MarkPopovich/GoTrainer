export enum StoneColor {
  BLACK = 'black',
  WHITE = 'white',
}

export const getAdjacentPoints = (x: number, y: number, boardSize: number) => {
  const adjacentPoints = [
    {x: x - 1, y},
    {x: x + 1, y},
    {x, y: y - 1},
    {x, y: y + 1},
  ];

  return adjacentPoints.filter(
    (point) => point.x >= 0 && point.x < boardSize && point.y >= 0 && point.y < boardSize
  );
};

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
