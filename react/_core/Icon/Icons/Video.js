import React from "react";
import { string, number, object } from "prop-types";

const Video = ({ color, size, style }) => (
  <svg
    style={style}
    fill={color}
    width={size}
    height={size}
    viewBox="0 0 18 18"
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
      <rect width={size} height={size} rx={1.744} />
      <path d="M4 0v16m8-16v16M0 8h16M0 4h4m-4 8h4m8 0h4m-4-8h4" />
    </g>
  </svg>
);

Video.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Video;
