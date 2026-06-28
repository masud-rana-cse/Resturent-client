import React from "react";
import { FiLoader } from "react-icons/fi";

const BaseLoader = ({ className, innerClassName }) => {
  return (
    <div className={`${className}`}>
      <div
        className={`${innerClassName} w-10 h-10 animate-[spin_1s_linear_infinite] rounded-full border-8 border-r-white border-(--primary-800)`}
      ></div>
    </div>
  );
};

export default BaseLoader;
