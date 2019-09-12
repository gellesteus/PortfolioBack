import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default (url: string): any => {
  const [data, setData] = useState({});
  const user = useSelector((state: any) => state.user);
  useEffect(() => {
    console.log('Getting');
    if (user) {
      fetch(url, {
        headers: {
          'content-type': 'application/json',
          sessionToken: user.sessionToken,
          userID: user.userId,
        },
      })
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(res => {
          setData(res);
        });
    } else {
      fetch(url, {
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => setData(res));
    }
  }, [url, user]);

  return data;
};
