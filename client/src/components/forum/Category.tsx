import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import { ICategory } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';

const cookies = new Cookies();

export interface IItem {
  categories: ICategory[];
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({} as IItem);
  const dispatch = useDispatch();
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
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, []);

  return (
    <div className='category-display'>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {state.categories.map((item, key) => {
            return (
              <>
                <div className='row'>
                  <div className='deco-icon'>
                    <img
                      src={item.icon}
                      style={{ width: '25px', height: '25px' }}
                      alt=''
                    />
                  </div>
                  <div>
                    <Link to={`/forum/category/${item._id}`}>{item.name}</Link>
                  </div>
                  <div>{item.shortDesc}</div>
                  <h3>Topics</h3>
                  {item.topics ? (
                    <div className='row'>
                      <p>{item.topics.length}</p>
                    </div>
                  ) : (
                    <p>0</p>
                  )}
                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};
