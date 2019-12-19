import React from "react";
import { string, number, object } from "prop-types";

const Delete = ({ color, size, style }) => (
  <svg
    style={style}
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 16 18"
  >
    <path
      d="M1 4.2h14m-1.556 0v11.2c0 .884-.696 1.6-1.555 1.6H4.11c-.859 0-1.555-.716-1.555-1.6V4.2m2.333 0V2.6c0-.884.696-1.6 1.555-1.6h3.112c.859 0 1.555.716 1.555 1.6v1.6m-4.666 4V13m3.112-4.8V13"
      strokeWidth={1.6}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Delete.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Delete;
