import React from 'react';
import {Circle} from 'react-native-svg';

interface StoneProps {
    color: 'black' | 'white';
    size: number;
    transform?: string;
  }
  
  const Stone: React.FC<StoneProps> = ({color, size, transform}) => {
    const radius = size / 2;
    const fillColor = color === 'black' ? '#000000' : '#FFFFFF';
    const strokeColor = color === 'black' ? '#333333' : '#CCCCCC';
  
    return (
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius * 0.9}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={1}
        transform={transform}
      />
    );
  };
export default Stone;
