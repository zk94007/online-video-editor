import React from "react";
import { string, number, object } from "prop-types";

const Add = ({ color, size, style }) => (
  <svg
    style={style}
    fill={color}
    width={size}
    height={size}
    viewBox="0 0 14 14"
  >
    <path
      d="M7 1.5v11M1.5 7h11"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Add.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Add;
