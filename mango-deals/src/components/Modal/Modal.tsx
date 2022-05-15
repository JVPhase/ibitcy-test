import React from 'react';
import './Modal.css';

type ModalProps = {
  children?: React.ReactNode;
};

function Modal(props: ModalProps) {
  const { children } = props;
  return (
    <div className="Modal">
      <div className="ModalOverlay"></div>
      <div className="ModalCard">{children}</div>
    </div>
  );
}

export default Modal;
