import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
        <p className="mb-4">Êtes-vous sûr de vouloir réinitialiser tous les smashes et les points ?</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;