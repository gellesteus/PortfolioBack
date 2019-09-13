import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../../layout/Loading';

const cookies = new Cookies();

export default () => {
  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/forum/categories`, {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setCategories(res.categories);
          setLoading(false);
        } else {
          // setAlert({
          //   level: 'danger',
          //   message: res.message || 'An unknown error occured',
          //   show: true,
          // });
        }
      })
      .catch(
        err => console.log(err.message)
        // setAlert({
        //   level: 'danger',
        //   message: e.message || 'An unknown error occured',
        //   show: true,
        // })
      );
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else {
    return <div>{categories}</div>;
  }
};
