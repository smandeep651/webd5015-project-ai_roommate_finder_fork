"use client";

import React from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="text-xl">Are you sure you want to remove this match?</h3>
        <div className="mt-4 flex gap-10">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
          >
            Yes, Remove
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 w-full"
          >
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
          width: 100%;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
