import React from 'react';

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
      aria-label="Créer un post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}