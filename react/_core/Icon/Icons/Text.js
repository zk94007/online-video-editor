import React from "react";
import { string, number, object } from "prop-types";

const Text = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="4 4 16 16"
  >
    <path
      d="M5.5 7.47V5h13v2.47M9.563 18.176h4.874M12 5v13.176"
      strokeWidth={1.6}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Text.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Text;
