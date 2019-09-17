import React from 'react';
import useGet from '../../hooks/useGet';

export default () => {
  const users = useGet('/api/users');
  return <div />;
};
