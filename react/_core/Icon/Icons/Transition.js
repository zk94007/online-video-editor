import React from "react";
import { string, number, object } from "prop-types";

const Transition = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="4 4 16 16"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.4A2.4 2.4 0 012.4 0h10.8a2.4 2.4 0 012.4 2.4v10.8a2.4 2.4 0 01-2.4 2.4H2.4A2.4 2.4 0 010 13.2V2.4zM13.2 14H8V7.701l-5 3.572V4l5 3.571V1.6h5.2a.8.8 0 01.8.8v10.8a.8.8 0 01-.8.8zM8 7.636L13.09 4v7.273L8 7.636z"
      fill={color}
    />
  </svg>
);

Transition.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Transition;
