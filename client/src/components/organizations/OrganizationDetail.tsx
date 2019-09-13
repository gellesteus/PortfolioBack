import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';

const cookie = new Cookies();

interface IPropsInner {
  id: string;
}

export interface IProps extends RouteComponentProps<IPropsInner> {
  id: string;
}

const Elem = (props: IPropsInner) => {
  const [member, setMember] = useState();

  useEffect(() => {
    fetch(`http://localhost:3001/character/${props.id}`, {
      headers: {
        authorization: cookie.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => setMember(res.member))
      .catch(e => console.log(e));
  }, [props.id]);

  return (
    <tr>
      {member == null ? (
        <td colSpan={2}>
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

export default (props: IProps) => {
  const [details, setDetails] = useState();
  /* Load data at component mount */
  useEffect(() => {
    fetch(`http://localhost:3001/organization/${props.match.params.id}`, {
      headers: {
        authorization: cookie.get('token'),
        'content-type': 'application/json',
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
              {details.members.map((item: any, key: any) => {
                return <Elem id={item} />;
              })}
            </tbody>
          </table>
        </>
      )}
      <br />
      <Link to="/organizations" className="btn btn-primary">
        Back
      </Link>
    </>
  );
};
