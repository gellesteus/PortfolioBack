import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import useCSRF from '../../hooks/useCSRF';
import { IItem } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';
import Pagination from '../layout/Pagination';
const cookies = new Cookies();
const count = 10;

/* TODO: Admin stuff */
export default () => {
  const [items, setItems] = useState([] as IItem[]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ sortColumn: '_id', sortDirection: 1 });
  const token = useCSRF();
  const role = useSelector((state: any) => state.user.user.role);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(
      `api/armory?page=${page}&count=${count}&sortColumn=${sort.sortColumn}&sortOrder=${sort.sortDirection}`,
      {
        headers: {
          Authorization: cookies.get('token'),
          'content-type': 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setPages(res.pages);
          setItems(res.items);
          setLoading(false);
        } else {
          dispatch(displayAlert(res.message, Level.DANGER));
        }
      })
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, [page, sort]);

  const setSortDir = (target: string) => {
    return (e: React.MouseEvent) => {
      if (sort.sortColumn === target) {
        if (sort.sortDirection === 1) {
          setSort({ sortColumn: target, sortDirection: -1 });
        } else {
          setSort({ sortColumn: '_id', sortDirection: 1 });
        }
      } else {
        setSort({ sortColumn: target, sortDirection: 1 });
      }
    };
  };

  const glyph = (target: string) => {
    if (target === sort.sortColumn) {
      /* Add a glyph with a sort direction */
      if (sort.sortDirection === 1) {
        return <span>&#8595;</span>;
      } else {
        return <span>&#8593;</span>;
      }
    } else {
      /* No glyph needs to be added */
      return null;
    }
  };

  if (loading) {
    return <Loading />;
  } else {
    if (!items) {
      return <p>No items found</p>;
    }
    return (
      <div>
        <table className="table-data">
          <thead>
            <tr>
              <th onClick={setSortDir('name')} style={{ cursor: 'pointer' }}>
                Name {glyph('name')}
              </th>
              <th>Description</th>
              <th
                onClick={setSortDir('created_at')}
                style={{ cursor: 'pointer' }}
              >
                Date Created {glyph('created_at')}
              </th>

              {role === 'admin' ? <th>Admin Functions</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((item: IItem, key) => {
              return (
                <tr key={item._id}>
                  <td>
                    <Link to={`/armory/${item._id}`}>{item.name}</Link>
                  </td>
                  <td>{item.shortDesc}</td>
                  <td>{moment(item.created_at).format('MMMM Do')}</td>

                  {role === 'admin' ? (
                    <td>
                      <button
                        className="btn btn-delete"
                        onClick={e =>
                          fetch(`/api/armory/${item._id}`, {
                            headers: {
                              Authorization: cookies.get('token'),
                              CSRF: token,
                              'content-type': 'application/json',
                            },
                            method: 'DELETE',
                          })
                            .then(res => res.json())
                            .then(res => {
                              if (res.success) {
                                setItems(
                                  items.filter(elem => {
                                    return elem._id !== item._id;
                                  })
                                );
                                dispatch(
                                  displayAlert(
                                    res.message ||
                                      'Success: It may take up to an hour for the changes to be reflected',
                                    Level.DANGER
                                  )
                                );
                              } else {
                                dispatch(
                                  displayAlert(
                                    res.message || 'An unknown error occured',
                                    Level.DANGER
                                  )
                                );
                              }
                            })
                            .catch(err =>
                              dispatch(
                                displayAlert(
                                  err.message || 'An unkown error occured',
                                  Level.DANGER
                                )
                              )
                            )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination page={page} pages={pages} handler={setPage} />
      </div>
    );
  }
};
