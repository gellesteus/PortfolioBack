import PropTypes from 'prop-types';
import React from 'react';

export interface IName {
  name: string;
}

export interface IMember {
  members: IName[];
  name: string;
  headquarters: string;
}

export interface IProps {
  member: IMember;
}

const Member = (props: IProps) => {
  return (
    <tr>
      <td>{props.member.name}</td>
      <td>{props.member.headquarters}</td>
      <td>{props.member.members.join(',')}</td>
    </tr>
  );
};

Member.propTypes = { member: PropTypes.object.isRequired };

export default Member;
