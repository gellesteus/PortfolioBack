import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import { IPost } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';
import UserSection from './UserSection';

const cookies = new Cookies();

export interface IProps {
  id: string;
}

export default (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({} as IPost);
  const dispatch = useDispatch();
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
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, [props.id]);

  return (
    <div className='column'>
      {loading ? (
        <Loading />
      ) : (
        <>
          <UserSection id={post.poster._id} />
          <div className='post-content'>{post.body}</div>
        </>
      )}
    </div>
  );
};
