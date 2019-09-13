import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';
import Post from './Post';
const cookies = new Cookies();

export interface IProps {
  id: string;
  posts: IPost[];
}

export interface IPost {
  _id: string;
}

export default (props: IProps) => {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(true);
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
        setState((s: any) => {
          return { ...s, ...res };
        });
      });
    // .catch(e => console.log(e));
  }, [props.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="row">
          {state.posts.map((item: IPost, key: number) => {
            return <Post key={item._id} id={item._id} />;
          })}
        </div>
      )}
    </>
  );
};
