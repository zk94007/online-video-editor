import React from "react";
import { string, number, object } from "prop-types";

const Stock = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 15 15"
  >
    <g fill="none" fillRule="evenodd">
      <path
        d="M13 9v2.667c0 1.012-.82 1.833-1.833 1.833H3.833A1.833 1.833 0 012 11.667V9"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d="M2.273 0h10.063a1 1 0 01.948.679l1.659 4.894a1 1 0 01-.947 1.321H1a1 1 0 01-.968-1.252L1.305.748A1 1 0 012.273 0z"
        fill={color}
      />
    </g>
  </svg>
);

Stock.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Stock;
