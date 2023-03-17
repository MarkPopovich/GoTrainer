import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import GoBoard from './components/GoBoard';
import ScoreBoard from './components/ScoreBoard';

// Add an enum to represent stone colors
enum StoneColor {
  BLACK = 'black',
  WHITE = 'white',
}

const App = () => {
  const boardSize = 9;
  const [gameState, setGameState] = useState(Array(9).fill(Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(StoneColor.BLACK);
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const [prevGameState, setPrevGameState] = useState(Array(9).fill(Array(9).fill(null)));
  const [scores, setScores] = useState({black: 0, white: 0});
  const [gameEnded, setGameEnded] = useState(false);

  const floodFillTerritory = (x: number, y: number, newGameState: string[][], visited: Set<string>, color: StoneColor) => {
    const key = `${x},${y}`;
    if (visited.has(key)) return 0;
  
    visited.add(key);
  
    if (newGameState[y][x]) {
      return newGameState[y][x] === color ? 1 : 0;
    }
  
    let territory = 1;
    getAdjacentPoints(x, y).forEach((point) => {
      territory += floodFillTerritory(point.x, point.y, newGameState, visited, color);
    });
  
    return territory;
  };  
  
  const getAdjacentPoints = (x: number, y: number) => {
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
  
  const getGroup = (x: number, y: number, gameState: StoneColor[][]) => {
    const color = gameState[y][x];
    if (!color) return {stones: [], liberties: []};
  
    const visited = new Set<string>();
    const stones = new Set<string>();
    const liberties = new Set<string>();
  
    const search = (x: number, y: number) => {
      const key = `${x},${y}`;
      if (visited.has(key)) return;
  
      visited.add(key);
  
      if (gameState[y][x] === color) {
        stones.add(key);
        getAdjacentPoints(x, y).forEach((point) => search(point.x, point.y));
      } else if (!gameState[y][x]) {
        liberties.add(key);
      }
    };
  
    search(x, y);
  
    return {
      stones: Array.from(stones).map((key) => ({x: parseInt(key.split(',')[0]), y: parseInt(key.split(',')[1])})),
      liberties: Array.from(liberties).map((key) => ({x: parseInt(key.split(',')[0]), y: parseInt(key.split(',')[1])})),
    };
  };  
  const calculateScores = (gameState: any) => {
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

  const handleUserMove = (x: number, y: number) => {
    const newGameState = gameState.map((row) => [...row]);
    newGameState[y][x] = currentPlayer;
  
    const capturedStones: {x: number; y: number}[] = [];
  
    getAdjacentPoints(x, y).forEach((point) => {
      const adjacentColor = newGameState[point.y][point.x];
      if (adjacentColor && adjacentColor !== currentPlayer) {
        const group = getGroup(point.x, point.y, newGameState);
        if (group.liberties.length === 0) {
          group.stones.forEach((stone) => {
            if (!capturedStones.some((captured) => captured.x === stone.x && captured.y === stone.y)) {
              capturedStones.push(stone);
            }
          });
        }
      }
    });
  
    // Check if placing the stone results in self-capture
    const newGroup = getGroup(x, y, newGameState);
    const selfCapture = newGroup.liberties.length === 0;
  
    if (selfCapture && capturedStones.length === 0) {
      alert("Self-capture is not allowed!");
      return;
    }
  
    capturedStones.forEach((stone) => {
      newGameState[stone.y][stone.x] = null;
    });
  
    // Check for Ko rule violation
    if (JSON.stringify(prevGameState) === JSON.stringify(newGameState)) {
      alert("This move violates the Ko rule!");
      return;
    }
  
    // Store the current game state as the previous game state after capturing any stones
    setPrevGameState(gameState.map((row) => [...row]));
  
    setConsecutivePasses(0);
    setGameState(newGameState);
    setCurrentPlayer(currentPlayer === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK);
  };
  
  const handlePass = () => {
    if (consecutivePasses === 1) {
      // Calculate scores
      const newScores = calculateScores(gameState);
      setScores(newScores);
      setGameEnded(true);
    } else {
      setConsecutivePasses(consecutivePasses + 1);
      setCurrentPlayer(currentPlayer === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK);
    }
  };
  
  const handleResign = () => {
    // End the game and declare the AI as the winner
    // Reset the game state and set the starting player to black
    resetGameState();
  };

  const resetGameState = () => {
    setGameState(Array(boardSize).fill(Array(boardSize).fill(null)));
    setPrevGameState(Array(boardSize).fill(Array(boardSize).fill(null)));
    setCurrentPlayer(StoneColor.BLACK);
  };  

  useEffect(() => {
    if (gameEnded) {
      alert(`Game over! Black: ${scores.black}, White: ${scores.white}`);
      resetGameState();
      setGameEnded(false);
    }
  }, [gameEnded, scores.black, scores.white, resetGameState]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learn to Play Go</Text>
      <ScoreBoard gameState={gameState} />
      <GoBoard gameState={gameState} onUserMove={handleUserMove} />
      <View style={styles.menu}>
        <TouchableOpacity onPress={handlePass}>
          <Text>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResign}>
          <Text>Resign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
export default App;