import React from 'react';
import SlidingBackground from '../layout/SlidingBackground';

export default () => {
  return (
    <div className="content">
      <SlidingBackground
        left={() => {
          return (
            <>
              <img
                src="https://image.shutterstock.com/z/stock-vector-colorful-circles-background-1016858287.jpg"
                alt=""
                style={{
                  height: '100%',
                  left: '0',
                  top: '0',
                  width: '100%',
                }}
              />
            </>
          );
        }}
        right={() => {
          return (
            <>
              <img
                src="https://image.shutterstock.com/z/stock-vector-creative-circle-abstract-vector-logo-design-template-1034603407.jpg"
                alt=""
                style={{
                  height: '100%',
                  left: '0',
                  top: '0',
                  width: '100%',
                }}
              />
            </>
          );
        }}
        bgRight="#eee"
        bgLeft="#222"
      />
    </div>
  );
};
