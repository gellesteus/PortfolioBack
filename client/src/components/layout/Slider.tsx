import PropTypes from 'prop-types';
import React, { useState } from 'react';

export interface IProps {
  leftComponent: React.ElementType;
  rightComponent: React.ElementType;
  rightHide: React.ElementType;
  leftHide: React.ElementType;
  switchLeft: string;
  switchRight: string;
}

interface IPropsInner extends IProps {
  isRight: boolean;
  setIsRight: React.Dispatch<React.SetStateAction<boolean>>;
}

const Slider = (props: IProps) => {
  const [isRight, setIsRight] = useState(true);

  return (
    <div className='slider-wrapper'>
      <SliderInner {...props} isRight={isRight} setIsRight={setIsRight} />
    </div>
  );
};

const SliderInner = (props: IPropsInner) => {
  return (
    <>
      <div style={getPosition(props.isRight)} className='slider slider-hider'>
        <div>
          <props.leftHide />
          <button
            className='btn-slider'
            onClick={e => props.setIsRight(!props.isRight)}
          >
            {props.switchRight}
          </button>
        </div>
        <div>
          <props.rightHide />
          <button
            className='btn-slider'
            onClick={e => props.setIsRight(!props.isRight)}
          >
            {props.switchLeft}
          </button>
        </div>
      </div>
      <div className='slider slider-content'>
        <div>
          <props.leftComponent />
        </div>
        <div>
          <props.rightComponent />
        </div>
      </div>
    </>
  );
};
const getPosition = (isRight: boolean) => {
  return isRight ? { left: '-50%' } : { left: '50%' };
};

Slider.propTypes = {
  leftComponent: PropTypes.func.isRequired,
  leftHide: PropTypes.func.isRequired,
  rightComponent: PropTypes.func.isRequired,
  rightHide: PropTypes.func.isRequired,
  switchLeft: PropTypes.string.isRequired,
  switchRight: PropTypes.string.isRequired,
};

export default Slider;
