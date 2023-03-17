import React from 'react';
import {View} from 'react-native';
import Svg, {Line, Rect, Circle} from 'react-native-svg';
import Stone from './Stone';
import {SvgTouchEvent} from 'react-native-svg'; // Add this import at the top
import { StoneColor, getAdjacentPoints } from '../utils';

type BoardState = Array<Array<'black' | 'white' | null>>;

interface GoBoardProps {
    gameState: BoardState;
    onUserMove: (x: number, y: number) => void;
  }

const GoBoard: React.FC<GoBoardProps> = ({gameState, onUserMove}) => {
  const boardSize = 9;
  const tileSize = 40;
  const boardWidth = tileSize * (boardSize - 1);

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < boardSize; i++) {
      const offset = i * tileSize;
      lines.push(
        <Line
          key={`h${i}`}
          x1={0}
          y1={offset}
          x2={boardWidth}
          y2={offset}
          stroke="black"
          strokeWidth={1}
        />,
        <Line
          key={`v${i}`}
          x1={offset}
          y1={0}
          x2={offset}
          y2={boardWidth}
          stroke="black"
          strokeWidth={1}
        />,
      );
    }
    return lines;
  };
  const renderStones = () => {
    const stones = [];
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        const color = gameState[y][x];
        
        if (color) {
          stones.push(
            <Stone
              key={`stone-${x}-${y}`}
              color={color}
              size={tileSize}
              transform={`translate(${x * tileSize - tileSize / 2}, ${y * tileSize - tileSize / 2})`}
            />,
          );
        }
      }
    }
    return stones;
  };
  
  const handlePress = (event: SvgTouchEvent) => {
    const {locationX, locationY} = event.nativeEvent;
    console.log(`locationX: ${locationX}, locationY: ${locationY}`);

    const x = Math.round(locationX / tileSize);
    const y = Math.round(locationY / tileSize);
  
    if (!gameState[y][x]) {
      onUserMove(x, y);
    }
  };
  
 
  return (
    <View>
      <Svg width={boardWidth} height={boardWidth} onPress={handlePress}>
        <Rect width={boardWidth} height={boardWidth} fill="#DDA15E" />
        {renderLines()}
        {renderStones()}
      </Svg>
    </View>
  );
};

export default GoBoard;