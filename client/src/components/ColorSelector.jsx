import React, { useState } from 'react';
import { colors, getColor } from "../Utils/colors"; 

const ColorSelector = ({ onSelectColor }) => {
  return (
    <div className="flex gap-2">
      {colors.map((colorClass, index) => (
        <div
          key={index}
          className={`w-10 h-10 cursor-pointer rounded-full ${colorClass}`}
          onClick={() => onSelectColor(index)}
        ></div>
      ))}
    </div>
  );
};

export default ColorSelector;
