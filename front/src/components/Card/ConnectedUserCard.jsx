import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ConnectedUserCard = ({ username, points, smashesToDo }) => {
  return (
    <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg bg-blue-100 w-full">
      <div className="flex flex-row items-center w-full space-x-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg w-full text-center flex items-center justify-center">
          <FaUserCircle className="text-6xl mr-4 text-blue-500" />
          <div>
            <h4 className="text-2xl font-bold">Username</h4>
            <p className="text-xl">{username}</p>
          </div>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg w-full text-center">
          <h4 className="text-2xl font-bold">Points</h4>
          <p className="text-xl">{points}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg w-full text-center">
          <h4 className="text-2xl font-bold">Smashes</h4>
          <p className="text-xl">{smashesToDo}</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectedUserCard;