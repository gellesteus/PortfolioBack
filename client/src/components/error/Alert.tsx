import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideAlert } from '../../actions';
export enum Level {
  INFO = 'info',
  DANGER = 'danger',
  SUCCESS = 'success',
}

let timer: NodeJS.Timeout;

export default () => {
  const show = useSelector((state: any) => state.alert.show);
  const level = useSelector((state: any) => state.alert.level);
  const message = useSelector((state: any) => state.alert.message);
  const dispatch = useDispatch();

  useEffect(() => {
    timer = setTimeout(hide, 7500);
    return () => clearTimeout(timer);
  }, [level, message, show]);

  const hide = () => {
    dispatch(hideAlert());
  };

  if (show) {
    return (
      <div className="alert" onClick={hide}>
        <div
          className={`alert-${level} alert-body`}
          role="alert"
          onClick={hide}
        >
          {message}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
