import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import { IPost, ITopic } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';
import Post from './Post';
const cookies = new Cookies();

export interface IProps {
  id: string;
}

export default (props: IProps) => {
  const [state, setState] = useState((null as unknown) as ITopic);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    /* Retrieve the thread */
    fetch(`api/forum/thread/${props.id}`, {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'appplication/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setState(res.topics);
      })
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, [props.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {state.posts ? (
            <div className='row'>
              {state.posts.map((item: IPost, key: number) => {
                return <Post key={item._id} id={item._id} />;
              })}
            </div>
          ) : null}
        </>
      )}
    </>
  );
};
