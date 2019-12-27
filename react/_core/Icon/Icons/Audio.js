import React from "react";
import { string, number, object } from "prop-types";

const Audio = ({ color, size, style }) => (
  <svg
    style={style}
    fill={color}
    width={size}
    height={size}
    viewBox="0 0 16 16"
  >
    <g
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.667 11.889H2.556a1.556 1.556 0 100 3.111H4.11c.86 0 1.556-.696 1.556-1.556V11.89zM15 10.333h-3.111a1.556 1.556 0 000 3.111h1.555c.86 0 1.556-.696 1.556-1.555v-1.556z" />
      <path d="M5.667 11.889V2.556L15 1v9.333" />
    </g>
  </svg>
);

Audio.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Audio;
