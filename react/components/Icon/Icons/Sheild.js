import React from "react";
import { string, number, object } from "prop-types";

const Sheild = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 15 15"
  >
    <path
      d="M8.732 14.796c-.22.142-.409.257-.557.344a16.032 16.032 0 01-2.584-1.896C4.096 11.888 2.75 10.076 2.75 8V2.18L8.175.775 13.6 2.18V8c0 2.076-1.345 3.888-2.841 5.244a16.033 16.033 0 01-2.027 1.552z"
      fill="currentColor"
      fillOpacity={0.01}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Sheild.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Sheild;
