import React from 'react';

const Modal = ({ isOpen, setOpenModal, children }) => {
  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape') {
      setOpenModal(false);
    }
  });

  if (isOpen) {
    return <div className="absolute right-3">{children}</div>;
  }
  return null;
};

export default Modal;
