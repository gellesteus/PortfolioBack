import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
export default props => {
  let mems;
  useEffect(() => {
    // eslint-disable-next-line
    props.member.members.map((i, k) => {
      /* TODO: Replace with lookup via id */
      if (mems == null) {
        //eslint-disable-next-line
        mems = i.name;
      } else {
        mems += `, ${i.name}`;
      }
    });
  }, []);
  return (
    <tr key={props.member.id}>
      <td>
        <Link to={`${props.match.url}/${props.member._id}`}>
          {props.member.name}
        </Link>
      </td>
      <td>{props.member.hq}</td>
      <td>{mems}</td>
    </tr>
  );
};
