import React from "react";
import { string, number, object } from "prop-types";

const Close = ({ color, size, style }) => (
  <svg
    style={style}
    fill={color}
    width={size}
    height={size}
    viewBox="0 0 12 12"
  >
    <path
      d="M11 1L1 11M1 1l10 10"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Close.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Close;
