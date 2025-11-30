import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/slices/uiSlice';
import Login from '../Auth/Login';
import Register from '../Auth/Register';

const Modal = () => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => state.ui);

  if (!modal.isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal());
  };

  const renderContent = () => {
    switch (modal.type) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-bounce-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;