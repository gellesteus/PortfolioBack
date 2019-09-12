import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';

const cookies = new Cookies();
export interface IProps {
  id: string;
}
export default (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();

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
        setState((s: any) => {
          return { ...s, ...res };
        });
      })
      .catch(e => console.log(e));
  }, [props.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="user-section">{state.content}</div>
      )}
    </>
  );
};
