import React from "react";
import { string, number, object } from "prop-types";

const Upload = ({ color, size, style }) => (
  <svg
    style={style}
    fill={color}
    height={"100%"}
    width="100%"
    viewBox="0 0 121 82"
  >
    <g fill="none" fillRule="evenodd">
      <g opacity={0.8}>
        <g transform="rotate(15 -38.897 320.853)">
          <rect width={41} height={53} rx={4} fill="#1C1C26" />
          <rect
            stroke="#E5E6F1"
            strokeWidth={2}
            x={1}
            y={1}
            width={39}
            height={51}
            rx={4}
          />
        </g>
        <g
          transform="rotate(15 -121.854 364.023)"
          strokeWidth={1.6}
          stroke="#E5E6F1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width={14} height={14} rx={1.6} />
          <circle cx={4.278} cy={4.278} r={1.167} />
          <path d="M14 9.333l-3.889-3.889L1.556 14" />
        </g>
        <g transform="rotate(-15 120.057 15.806)">
          <rect width={41} height={53} rx={4} fill="#1C1C26" />
          <rect
            stroke="#E5E6F1"
            strokeWidth={2}
            x={1}
            y={1}
            width={39}
            height={51}
            rx={4}
          />
        </g>
        <g
          strokeWidth={1.6}
          stroke="#E5E6F1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M24.093 57.134l-3.005.806a1.556 1.556 0 10.806 3.005l1.502-.403a1.556 1.556 0 001.1-1.905l-.403-1.503zm8.613-3.918l-3.005.805a1.556 1.556 0 00.805 3.005l1.503-.402a1.556 1.556 0 001.1-1.905l-.403-1.503z" />
          <path d="M24.093 57.134l-2.415-9.015 8.612-3.918 2.416 9.015" />
        </g>
        <g transform="translate(40 14)">
          <rect width={41} height={53} rx={4} fill="#1C1C26" />
          <rect
            stroke="#E5E6F1"
            strokeWidth={2}
            x={1}
            y={1}
            width={39}
            height={51}
            rx={4}
          />
        </g>
        <g
          transform="translate(53 33)"
          strokeWidth={1.6}
          stroke="#E5E6F1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width={16} height={16} rx={1.744} />
          <path d="M4 0v16m8-16v16M0 8h16M0 4h4m-4 8h4m8 0h4m-4-8h4" />
        </g>
      </g>
      <g transform="translate(49)">
        <circle fill="#1C1C26" cx={12} cy={12} r={12} />
        <path
          d="M12 5.5v13m5-4.875L12 18.5l-5-4.875"
          strokeWidth={1.6}
          stroke="#E5E6F1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

Upload.propTypes = {
  color: string,
  size: number,
  style: object
};

export default Upload;
