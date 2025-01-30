import React from 'react';
import { motion } from 'framer-motion';

export default function SmashCard({ firstName, lastName, age, gender, image }) {
  return (
    <motion.div
      className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] bg-white shadow-2xl rounded-3xl overflow-hidden relative select-none"
      whileHover={{ scale: 1.05 }}
      tabIndex={0} // To allow focus styles control
      onFocus={(e) => e.target.blur()} // Remove focus when clicked
    >
      <img
        className="w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] object-cover object-center select-none user-select-none"
        src={image}
        alt={`${firstName} ${lastName}`}
        draggable="false"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 select-none">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white select-none user-select-none">
          {firstName} {lastName}, {age}
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-white mt-2 select-none user-select-none">
          {gender}
        </p>
      </div>
    </motion.div>
  );
}