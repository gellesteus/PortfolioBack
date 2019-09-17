import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import { IUser } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';
const cookies = new Cookies();
export interface IProps {
  id: string;
}
export default (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({} as IUser);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`api/user/${props.id}`, {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setUser(res);
      })
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, [props.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='user-section'>{user.username}</div>
      )}
    </>
  );
};
