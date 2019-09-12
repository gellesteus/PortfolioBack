import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

/* Creates a background that transitions between two images as the cursor is moved */
export interface IProps {
  bgLeft: string;
  bgRight: string;
  left: () => React.ElementType;
  right: () => React.ElementType;
}
const SlidingBackground = (props: IProps) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const wrapper: HTMLElement | null = document.getElementById('wrapper');
      if (wrapper) {
        const top: HTMLElement | null = wrapper.querySelector('.top');
        const handle: HTMLElement | null = wrapper.querySelector(
          '.background-handle'
        );
        let skew = 0;

        if (wrapper.className.indexOf('skew') !== -1) {
          skew = 1000;
        }
        const delta = (e.clientX - window.innerWidth / 2) * 0.5;
        if (handle && top) {
          handle.style.left = e.clientX + delta + 'px';

          top.style.width = e.clientX + skew + delta + 'px';
        }
        /* Add the listener */

        wrapper.addEventListener('mousemove', listener);
      }
    };
    return () => {
      const wrapper = document.getElementById('wrapper');
      /* Clean the listeners up */
      if (wrapper) {
        wrapper.removeEventListener('mousemove', listener);
      }
    };
  }, []);

  return (
    <section id="wrapper" className="skew">
      <div className="layer bottom">
        <div
          className="content-wrap"
          style={{ backgroundColor: props.bgRight }}
        >
          <div className="sliding-background-content">{props.right()}</div>
        </div>
      </div>
      <div className="layer top">
        <div className="content-wrap">
          <div
            className="sliding-background-content"
            style={{ backgroundColor: props.bgLeft }}
          >
            {props.left()}
          </div>
        </div>
      </div>
      <div className="background-handle" />
    </section>
  );
};

SlidingBackground.propTypes = {
  bgLeft: PropTypes.string.isRequired,
  bgRight: PropTypes.string.isRequired,
  left: PropTypes.func.isRequired,
  right: PropTypes.func.isRequired,
};

export default SlidingBackground;
