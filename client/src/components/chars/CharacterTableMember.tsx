import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { ICharacter } from '../../types';
export interface IProps {
  character: ICharacter;
}

const member = (props: IProps) => {
  const { character } = props;
  return (
    <tr>
      <td>
        <Link to={`/characters/${character._id}`}>{character.name}</Link>
      </td>
      <td>{character.description}</td>
    </tr>
  );
};

member.propTypes = {
  character: PropTypes.object.isRequired,
};

export default member;
