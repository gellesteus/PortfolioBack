import React from 'react';
import { Link } from 'react-router-dom';
export default () => {
  return (
    <div className='content'>
      <h1>
        You are already logged in. Click <Link to='/'>here</Link> to return home
      </h1>
    </div>
  );
};
