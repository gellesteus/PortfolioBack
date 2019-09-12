import { useEffect, useState } from 'react';

/* Get a CSRF token, then remove it when the page is unloaded */
export default () => {
  const [token, setToken] = useState('');
  useEffect(() => {
    /* Fetch the token */
    fetch('http://localhost:3001/csrf', {
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => setToken(res.token))
      .catch(e => console.log(e));

    return () => {
      /* Destroy the token */
      if (token) {
        fetch(`http://localhost:3001/csrf/${token}`, {
          headers: {
            CSRF: token,
            method: 'DELETE',
          },
        });
      }
    };
  }, []);

  return token;
};
