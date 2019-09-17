import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import { ICharacter } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';

const cookies = new Cookies();

export interface IParams {
  id: string;
}

export interface IProps extends RouteComponentProps<IParams> {}

export default (props: IProps) => {
  const dispatch = useDispatch();
  const [character, setCharacter] = useState({} as ICharacter);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/character/${props.match.params.id}`, {
      headers: {
        accepts: 'application/json',
        authorization: cookies.get('token'),
      },
    })
      .then(res => res.json())
      .then(res => {
        setCharacter(res.character);
        setLoading(false);
      })
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, [props.match.params.id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h3>{character.name}</h3>
      <p>{character.description}</p>
    </div>
  );
};
