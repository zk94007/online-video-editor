import React from "react";
import { string, number, object } from "prop-types";

const ArrowLeft = ({ color, size, style }) => (
  <svg style={style} fill={color} width={size} height={size} viewBox="0 0 14 8">
    <path
      d="M13 1L7 7 1 1"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ArrowLeft.propTypes = {
  color: string,
  size: number,
  style: object
};

export default ArrowLeft;
