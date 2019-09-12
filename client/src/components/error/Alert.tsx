import React from 'react';
import { useSelector } from 'react-redux';

export enum Level {
  INFO = 'info',
  DANGER = 'danger',
  SUCCESS = 'success',
}

const alert = () => {
  const show = useSelector((state: any) => state.alertReducer.show);
  const level = useSelector((state: any) => state.alertReducer.level);
  const message: string = useSelector(
    (state: any) => state.alertReducer.message
  );
  if (show) {
    return (
      <div className="alert">
        <div className={`alert-${level} alert-body`} role="alert" />
        {message}
      </div>
    );
  } else {
    return null;
  }
};

export default alert;
