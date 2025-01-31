import React from 'react';
import { motion } from 'framer-motion';

export default function SmashCard({ name, age, gender, url_img, points, type, date, size = 'normal' }) {
  const isSmall = size === 'small';
  const formattedDate = date ? new Date(date).toLocaleString() : null;

  return (
    <motion.div
      className={`${
        isSmall ? 'w-48 sm:w-56 md:w-64 lg:w-72' : 'w-80 sm:w-96 md:w-[28rem] lg:w-[32rem]'
      } bg-white shadow-2xl rounded-3xl overflow-hidden relative select-none`}
      whileHover={{ scale: 1.05 }}
      tabIndex={0}
      onFocus={(e) => e.target.blur()}
    >
      {formattedDate && (
        <div className={`absolute top-4 left-4 font-bold py-1 px-3 rounded-lg bg-blue-600 text-white`}>
          {formattedDate}
        </div>
      )}
      <img
        className={`${
          isSmall ? 'h-48 sm:h-56 md:h-64 lg:h-72' : 'h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem]'
        } w-full object-cover object-center select-none user-select-none`}
        src={url_img}
        alt={name}
        draggable="false"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 select-none">
        <h2 className={`${
          isSmall ? 'text-lg sm:text-xl md:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'
        } font-bold text-white select-none user-select-none`}>
          {name}, {age} ans
        </h2>
        <p className={`${
          isSmall ? 'text-md sm:text-lg md:text-xl' : 'text-lg sm:text-xl md:text-2xl'
        } text-white mt-2 select-none user-select-none`}>
          {gender}
        </p>
        {points !== undefined && (
          <div className={`absolute bottom-4 right-4 font-bold py-1 px-3 rounded-lg ${
            type === 1 ? 'bg-red-600' : 'bg-lime-700'
          } text-white`}>
            {type === 1 ? `+${points}` : `-${points}`} points
          </div>
        )}
      </div>
    </motion.div>
  );
}