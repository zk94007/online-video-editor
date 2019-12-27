import React from "react";
import { string, number, object } from "prop-types";

const Caret = ({ color, size, style, className, onClick }) => (
  <svg
    className={className}
    style={style}
    width={size}
    height={size}
    onClick={onClick}
    fill={color}
    viewBox="0 0 10 5"
  >
    <path d="M10 0L5 5 0 0z" fill={color} fillRule="evenodd" opacity={0.54} />
  </svg>
);

Caret.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Caret;
