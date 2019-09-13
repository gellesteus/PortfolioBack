import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useSelector } from 'react-redux';
import Alert from '../error/Alert';
import useCSRF from '../hooks/useCSRF';
import Gallery from '../layout/Gallery';
import Loading from '../layout/Loading';

const cookies = new Cookies();

export interface IParams {
  id: string;
}

export interface IProps extends RouteComponentProps<IParams> {}

/* TODO: Admin stuff */
export default (props: IProps) => {
  const token = useCSRF();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState();
  const role = useSelector((state: any) => state.userReducer.user.role);
  useEffect(() => {
    fetch(`http://localhost:3001/armory/${props.match.params.id}`, {
      headers: {
        Authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setItem(res.item);
          setLoading(false);
        } else {
          // setAlert({
          //   level: 'danger',
          //   message: res.message || 'An unknown error occured',
          //   show: true,
          // });
          setLoading(true);
        }
      })
      .catch(e => {
        // setAlert({
        //   level: 'danger',
        //   message: e.message || 'An unknown error occured',
        //   show: true,
        // });
        setLoading(true);
      });
  }, [props.match.params.id]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
        <Alert {...alert} />
        <h1>{item.name}</h1>
        <p>{item.longDesc}</p>
        {role === 'admin' ? (
          <div>
            <button>Edit Item</button>
            <button>Delete Item</button>
          </div>
        ) : null}
        <Gallery images={item.images} />
      </div>
    );
  }
};
