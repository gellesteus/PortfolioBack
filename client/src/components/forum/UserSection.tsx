import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';
import { IUser } from '../../types';
const cookies = new Cookies();
export interface IProps {
  id: String;
}
export default (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({} as IUser);

  useEffect(() => {
    fetch(`http://localhost:3001/user/${props.id}`, {
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
      .catch(e => console.log(e));
  }, [props.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="user-section">{user.username}</div>
      )}
    </>
  );
};
