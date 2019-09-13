import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';
import UserSection from './UserSection';
import { IPost } from '../../types';
const cookies = new Cookies();

export interface IProps {
  id: string;
}

export default (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({} as IPost);
  useEffect(() => {
    fetch(`api/forum/post/${props.id}`, {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setPost(res);
      })
      .catch(e => console.log(e));
  }, [props.id]);

  return (
    <div className="column">
      {loading ? (
        <Loading />
      ) : (
        <>
          <UserSection id={post.poster._id} />
          <div className="post-content">{post.body}</div>
        </>
      )}
    </div>
  );
};
