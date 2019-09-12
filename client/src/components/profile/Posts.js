import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';
/* Displays user's latest posts and threads and other information about their usage on the forums */

const cookies = new Cookies();

const Posts = props => {
  const [posts, setPosts] = useState({});
  const [threads, setThreads] = useState({});
  const [postLoading, setPostLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(true);

  const { setAlert } = props;

  /* Load post info */
  useEffect(() => {
    fetch(
      `http://localhost:3001/forum/topic?count=5&user=${props.user._id}&sortOrder=1&sortCol=createdAt`,
      {
        headers: {
          'content-type': 'application/json',
          authorization: cookies.get('token'),
        },
      }
    )
      .then(res => res.json)
      .then(res => {
        setThreads({ ...res.topics });
        setThreadLoading(false);
      })
      .catch(e =>
        setAlert({
          show: true,
          message: e.message || 'An unknown error occured',
          level: 'danger',
        })
      );
  }, [props.user, setAlert]);

  /* Load post info */
  useEffect(() => {
    fetch(
      `http://localhost:3001/forum/post?count=5&user=${props.user._id}&sortOrder=1&sortCol=date`,
      {
        headers: {
          'content-type': 'application/json',
          authorization: cookies.get('token'),
        },
      }
    )
      .then(res => res.json)
      .then(res => {
        setPosts({ ...res.posts });
        setPostLoading(false);
      })
      .catch(e =>
        setAlert({
          show: true,
          message: e.message || 'An unknown error occured',
          level: 'danger',
        })
      );
  }, [props.user, setAlert]);

  return (
    <>
      {!(postLoading && threadLoading) ? (
        <>
          {Object.keys(threads).length !== 0 ? (
            <div>
              {threads.map((item, index) => {
                return <div />;
              })}
            </div>
          ) : (
            <p>No threads found</p>
          )}
          {Object.keys(posts).length !== 0 ? (
            <div>
              {posts.map((item, index) => {
                return <div />;
              })}
            </div>
          ) : (
            <p>No posts found</p>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

Posts.propTypes = {
  user: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default Posts;
