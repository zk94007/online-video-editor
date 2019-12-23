import React from "react";
import { string, number, object } from "prop-types";

const File = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="4 2 18 20"
  >
    <g
      stroke="currentColor"
      strokeWidth={1.6}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.813 4H7.125C6.228 4 5.5 4.716 5.5 5.6v12.8c0 .884.728 1.6 1.625 1.6h9.75c.897 0 1.625-.716 1.625-1.6V9.6L12.812 4z" />
      <path d="M12.813 4v5.6H18.5" />
    </g>
  </svg>
);

File.propTypes = {
  color: string,
  size: number,
  style: object
};

export default File;
