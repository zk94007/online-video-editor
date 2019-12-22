import React from "react";
import { string, number, object } from "prop-types";

const Sheild = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 14 18"
  >
      <path
      fill="none"
      stroke="#FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.065 16.702s6.064-3.14 6.064-7.851v-6.28L7.065 1 1 2.57v6.281c0 4.71 6.065 7.851 6.065 7.851z"
    />
  </svg>
);

Sheild.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Sheild;
