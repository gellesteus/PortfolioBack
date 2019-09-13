import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../../actions';

const Modal = () => {
  const active = useSelector((state: any) => state.modal.show);
  const component = useSelector((state: any) => state.modal.component);
  const dispatch = useDispatch();

  const hide = () => {
    dispatch(hideModal());
  };

  return (
    <>
      {active ? (
        <div className="modal-bg" onClick={hide}>
          <div className="modal" onClick={hide}>
            {component}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
