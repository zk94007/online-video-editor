import React from "react";
import { string, number, object } from "prop-types";

const Background = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="3 3 18 18"
  >
    <path
      d="M4 8l8 4 8-4-8-4zm0 8l8 4 8-4M4 12l8 4 8-4"
      strokeWidth={1.6}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Background.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Background;
