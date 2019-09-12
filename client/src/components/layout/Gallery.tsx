<<<<<<< HEAD
import PropTypes from 'prop-types';
import React from 'react';
=======
import React from 'react';
import PropTypes from 'prop-types';
>>>>>>> 73ff7058d85f43b81bee64c586d3d4b337561ea0

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
