import React from "react";
import { string, number, object } from "prop-types";

const Star = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 16 16"
  >
    <path
      d="M15.144 5.439l-4.317-.628L8.9.9a1.041 1.041 0 00-1.8 0L5.173 4.812l-4.317.627A1 1 0 00.3 7.145l3.123 3.045-.737 4.3a1 1 0 001.451 1.054L8 13.513l3.861 2.029a1 1 0 001.451-1.054l-.737-4.3L15.7 7.145a1 1 0 00-.554-1.705z"
      fill={color}
    />
  </svg>
);

Star.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Star;
