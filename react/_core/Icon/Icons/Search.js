import React from "react";
import { string, number, object } from "prop-types";

const Search = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 16 16"
  >
    <g
      transform="translate(1 1)"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={5.833} cy={5.833} r={5.833} />
      <path d="M14 14L9.956 9.956" />
    </g>
  </svg>
);

Search.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Search;
