import React from "react";

export default function User4() {
  return (
    <svg
      width="19"
      height="19"
      className='mr-1'
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle
        cx="12"
        cy="6.5"
        r="4"
        stroke="#173F9E"
        strokeWidth="1.8"
        fill="none"
      />

      {/* Body */}
      <path
        d="M4.5 19.5
           C4.7 15.8 7.2 13 12 13
           C16.8 13 19.3 15.8 19.5 19.5
           H4.5Z"
        stroke="#173F9E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}