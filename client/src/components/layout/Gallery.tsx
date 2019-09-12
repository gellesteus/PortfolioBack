import React from 'react';
import PropTypes from 'prop-types';

export interface IProps {
  images: string[];
}

/* Displays a gallery of images */
const Gallery = (props: IProps) => {
  return <div></div>;
};

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
};

export default Gallery;
