import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';
import UserSection from './UserSection';

const cookies = new Cookies();

export interface IUser {
  id: string;
}

export interface IProps {
  id: string;
  user: IUser;
}

export default (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  useEffect(() => {
    fetch(`http://localhost:3001/forum/post/${props.id}`, {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setState((s: any) => {
          return { ...s, ...res };
        });
      })
      .catch(e => console.log(e));
  }, [props.id]);

  return (
    <div className="column">
      {loading ? (
        <Loading />
      ) : (
        <>
          <UserSection user={state.post.user} />
          <div className="post-content">{state.post.content}</div>
        </>
      )}
    </div>
  );
};
