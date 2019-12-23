import React from "react";
import { string, number, object } from "prop-types";

const Help = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 16 16"
  >
    <path
      d="M15.25 8A7.25 7.25 0 11.75 8a7.25 7.25 0 0114.5 0z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
    />
    <path
      d="M8.1 13a1 1 0 100-2 1 1 0 000 2zm-.9-7.5c.2-.3.5-.5.9-.5.6 0 1 .4 1 1 0 .3-.1.4-.6.7-.6.4-1.4 1-1.4 2.3v1h2V9c0-.2 0-.3.5-.6.6-.4 1.5-1 1.5-2.4 0-1.7-1.3-3-3-3C7 3 6 3.6 5.5 4.5l-.5.9 1.7 1 .5-.9z"
      fill="black"
    />
  </svg>
);

Help.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Help;
