import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Cookies from 'universal-cookie';
import { IRule } from '../../types/index';
import NotFound from '../error/NotFound';

const cookies = new Cookies();

export default (props: RouteComponentProps<IRule>) => {
  const [state, setState] = useState({
    isFound: false,
    isLoaded: false,
    longDesc: '',
    name: '',
  });

  useEffect(() => {
    /* Load all the rules text from the API */
    fetch(`http://localhost:3001/rule/${props.match.params._id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: cookies.get('token'),
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (Object.keys(res).length !== 0) {
          setState(s => {
            return {
              ...s,
              ...res,
              isFound: true,
            };
          });
        } else {
          /* Object does not exist */
          setState(s => {
            return {
              ...s,
              isFound: false,
            };
          });
        }
      })
      .catch(e => {
        setState(s => {
          return {
            ...s,
            isFound: false,
          };
        });
      });
  }, [props.match.params._id]);

  if (!state.isFound) {
    return <NotFound />;
  } else {
    return (
      <div>
        <h1>{state.name}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: state.longDesc,
          }}
        />
      </div>
    );
  }
};
