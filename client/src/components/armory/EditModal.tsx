import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { displayAlert, hideModal } from '../../actions';
import { IItem } from '../../types';
import { Level } from '../error/Alert';

const cookies = new Cookies();

export interface IProps {
  item: IItem;
  token: string;
  update: React.Dispatch<React.SetStateAction<IItem>>;
}

const EditModal = (props: IProps) => {
  const [state, setState] = useState({} as IItem);
  const dispatch = useDispatch();

  useEffect(() => {
    setState(props.item);
  }, []);

  const submit = (e: React.MouseEvent) => {
    e.preventDefault();
    fetch(`/api/armory/${props.item._id}`, {
      body: JSON.stringify(state),
      headers: {
        CSRF: props.token,
        accept: 'application/json',
        authorization: cookies.get('token'),

        'content-type': 'application/json',
      },
      method: 'PUT',
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          props.update(state);
          dispatch(displayAlert(res.message, Level.SUCCESS));
          dispatch(hideModal());
        } else {
          dispatch(displayAlert(res.message, Level.DANGER));
        }
      })
      .catch(err => dispatch(displayAlert(err.message, Level.DANGER)));
  };
  return (
    <form>
      <input type='submit' onClick={submit} />
    </form>
  );
};

EditModal.propTypes = {
  item: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default EditModal;
