import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Loading from '../layout/Loading';

const cookies = new Cookies();

// TODO: Move these to main forum file
export interface ICat {
  icon: string;
  _id: string;
  shortDesc: string;
  name: string;
  topics: ITopic[];
}

export interface ITopic {
  length: number;
}
export interface IItem {
  categories: ICat[];
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({} as IItem);
  useEffect(() => {
    fetch('api//forum/category', {
      headers: {
        Authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setState(s => {
          return { ...s, ...res };
        });
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="category-display">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {state.categories.map((item, key) => {
            return (
              <>
                <div className="row">
                  <div className="deco-icon">
                    <img
                      src={item.icon}
                      style={{ width: '25px', height: '25px' }}
                      alt=""
                    />
                  </div>
                  <div>
                    <Link to={`/forum/category/${item._id}`}>{item.name}</Link>
                  </div>
                  <div>{item.shortDesc}</div>
                  <div className="row">
                    <h3>Topics</h3>
                    <p>{item.topics.length}</p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};
