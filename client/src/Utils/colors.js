export const colors = [
    "bg-[#c0e885] text-[#edf0e4] border-[3px] ",
    "bg-[rgba(106,238,235,0.6)] text-[#edf0e4] border-[3px]",
    "bg-[rgba(137,106,238,0.5)] text-[#edf0e4] border-[3px] ",
    "bg-[rgba(227,106,238,0.6)] text-[#edf0e4] border-[3px]",
]

export const borderColors = [
    "border-[#064433]",
    "border-[#064433]",
    "border-[#064433]",
    "border-[#064433]",
  ];
  export const getColor = (colorIndex) => {
    if (typeof colorIndex === 'number' && colorIndex >= 0 && colorIndex < colors.length) {
      return colors[colorIndex];
    }
    return colors[0];
  };