import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import useCSRF from '../../hooks/useCSRF';
import { Level } from '../error/Alert';
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
  const role = useSelector((state: any) => state.user.user.role);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`/api/armory/${props.match.params.id}`, {
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
          dispatch(displayAlert(res.message, Level.DANGER));
          setLoading(true);
        }
      })
      .catch(e => {
        dispatch(displayAlert(e.message, Level.DANGER));
        setLoading(true);
      });
  }, [props.match.params.id]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
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
