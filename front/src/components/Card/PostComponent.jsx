import React from 'react';
import { FaReply, FaRetweet, FaThumbsUp, FaShareAlt } from 'react-icons/fa';

const PostComponent = ({ author, title, content, date }) => {
    return (
        <div className="bg-white p-5 my-4 rounded-lg shadow-lg border border-gray-300">
            <div className="flex items-center mb-3 border-b border-gray-300 pb-3">
                <div className="w-10 h-10 rounded-full bg-blue-300 flex-shrink-0"></div>
                <div className="ml-3">
                    <p className="text-lg font-bold text-blue-600">{author}</p>
                    <p className="text-sm text-gray-500">@{author.toLowerCase().replace(/\s+/g, '')}</p>
                </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-green-600 border-b border-gray-300 pb-2">{title}</h2>
            <p className="text-base text-gray-800 mb-4 border-b border-gray-300 pb-4 break-words">
                {content}
            </p>           
            <p className="text-sm text-gray-500 mb-4">{date}</p>
            <div className="flex justify-between text-gray-500 text-sm">
                <button className="flex items-center space-x-1 hover:text-blue-500">
                    <FaReply className="w-5 h-5" />
                    <span>Reply</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-green-500">
                    <FaRetweet className="w-5 h-5" />
                    <span>ReYit</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-red-500">
                    <FaThumbsUp className="w-5 h-5" />
                    <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-gray-700">
                    <FaShareAlt className="w-5 h-5" />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostComponent;