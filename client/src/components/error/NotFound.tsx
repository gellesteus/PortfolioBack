import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        Click <Link to='/'>here</Link> to return home
      </p>
    </>
  );
}
