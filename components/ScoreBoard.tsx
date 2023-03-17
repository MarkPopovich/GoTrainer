import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react'; 
import { StoneColor, getAdjacentPoints, calculateScores } from '../utils';

interface ScoreBoardProps {
    gameState: GameState;
    currentPlayer: StoneColor;
  }

  const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState, currentPlayer }) => {
    const [scores, setScores] = useState({ black: 0, white: 0 }); // Add this line
  
    useEffect(() => {
      const newScores = calculateScores(gameState);
      setScores(newScores);
    }, [gameState]);
  
    return (
      <View style={styles.container}>
        <Text style={styles.score}>Black: {scores.black}</Text>
        <Text style={styles.score}>White: {scores.white}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 20,
    },
    score: {
      fontSize: 18,
    },
  });
  
  export default ScoreBoard;