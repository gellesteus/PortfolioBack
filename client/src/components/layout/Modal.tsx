import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../../actions/actions';

const Modal = () => {
  const active = useSelector((state: any) => state.modalReducer.modalActive);
  const component = useSelector(
    (state: any) => state.modalReducer.modalComponent
  );
  const dispatch = useDispatch();

  return (
    <>
      {active ? (
        <div
          className="modal-bg"
          onClick={(e: React.MouseEvent) => dispatch(hideModal())}
        >
          <div
            className="modal"
            onClick={(e: React.MouseEvent) => dispatch(hideModal())}
          >
            {component}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
