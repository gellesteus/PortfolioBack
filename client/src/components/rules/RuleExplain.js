import React, { useState, useEffect } from 'react';
import NotFound from '../error/NotFound';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default props => {
  const [state, setState] = useState({ isLoaded: false });

  useEffect(() => {
    /* Load all the rules text from the API */
    fetch(`http://localhost:3001/rule/${props.match.params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: cookies.get('token'),
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
  }, [props.match.params.id]);

  if (!this.state.isFound) {
    return <NotFound />;
  } else {
    return (
      <div>
        <h1>{this.state.name}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: state.longDesc,
          }}
        />
      </div>
    );
  }
};
