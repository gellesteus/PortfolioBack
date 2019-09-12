import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';
import { Link } from 'react-router-dom';
const cookie = new Cookies();

const Elem = props => {
  const [member, setMember] = useState();

  useEffect(() => {
    fetch(`http://localhost:3001/character/${props.id}`, {
      headers: {
        'content-type': 'application/json',
        authorization: cookie.get('token'),
      },
    })
      .then(res => res.json())
      .then(res => setMember(res.member))
      .catch(e => console.log(e));
  }, [props.id]);

  return (
    <tr>
      {member == null ? (
        <td colSpan='2'>
          <Loading />
        </td>
      ) : (
        <>
          <td>{member.name}</td> <td>{member.desc}</td>
        </>
      )}
    </tr>
  );
};

export default props => {
  const [details, setDetails] = useState();
  /* Load data at component mount */
  useEffect(() => {
    fetch(`http://localhost:3001/organization/${props.match.params.id}`, {
      headers: {
        'content-type': 'application/json',
        authorization: cookie.get('token'),
      },
    })
      .then(res => res.json())
      .then(res => setDetails(res.organization))
      .catch(e => console.log(e));
  }, [props.match.params.id]);
  return (
    <>
      {details == null ? (
        <Loading />
      ) : (
        <>
          <h1>{details.name}</h1>
          <p>{details.longDesc}</p>
          <table>
            <thead>
              <tr>
                <th>Members</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {details.members.map((item, key) => {
                return <Elem id={item} />;
              })}
            </tbody>
          </table>
        </>
      )}
      <br />
      <Link to='/organizations' className='btn btn-primary'>
        Back
      </Link>
    </>
  );
};
