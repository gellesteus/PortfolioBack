import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../../actions';
import { Level } from '../../error/Alert';
import Loading from '../../layout/Loading';
const cookies = new Cookies();

export default () => {
  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
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
          dispatch(
            displayAlert('Category created successfully', Level.SUCCESS)
          );
          setLoading(false);
        } else {
          dispatch(
            displayAlert(
              res.message || 'An unknown error occured',
              Level.DANGER
            )
          );
        }
      })
      .catch(err =>
        dispatch(
          displayAlert(err.message || 'An unknown error occured', Level.DANGER)
        )
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
