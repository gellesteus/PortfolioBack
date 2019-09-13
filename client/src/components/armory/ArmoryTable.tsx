import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import useCSRF from '../hooks/useCSRF';
import Loading from '../layout/Loading';
import Pagination from '../layout/Pagination';
import { useSelector } from 'react-redux';
const cookies = new Cookies();
const count = 10;

export interface IItem {
  _id: string;
  created_at: Date;
  name: string;
  shortDesc: string;
  longDesc: string;
}

/* TODO: Admin stuff */
export default () => {
  const [items, setItems] = useState([] as IItem[]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ sortColumn: '_id', sortDirection: 1 });
  const token = useCSRF();
  const role = useSelector((state: any) => state.userReducer.user.role);

  useEffect(() => {
    fetch(
      `http://localhost:3001/armory?page=${page}&count=${count}&sortColumn=${sort.sortColumn}&sortOrder=${sort.sortDirection}`,
      {
        headers: {
          Authorization: cookies.get('token'),
          'content-type': 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(res => {
        setPages(res.pages);
        setItems(res.items);
        setLoading(false);
      })
      .catch(e => setLoading(true));
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
                          fetch(`http://localhost:3001/armory/${item._id}`, {
                            headers: {
                              Authorization: cookies.get('token'),
                              CSRF: token,
                              'content-type': 'application/json',
                            },
                            method: 'DELETE',
                          })
                            .then(res => res.json())
                            .then(res => {
                              console.log(res);
                              if (res.success) {
                                setItems(
                                  items.filter(elem => {
                                    return elem._id !== item._id;
                                  })
                                );
                                // setAlert({
                                //   level: 'success',
                                //   message: `${res.message ||
                                //     'Success'}. It may take up to an hour for the changes to be reflected.`,
                                //   show: true,
                                // });
                              } else {
                                // setAlert({
                                //   level: 'danger',
                                //   message:
                                //     res.message ||
                                //     'An unknown error occured',
                                //   show: true,
                                // });
                              }
                            })
                            .catch(
                              err => console.log(err.message)
                              // setAlert({
                              //   level: 'danger',
                              //   message:
                              //     err.message || 'An unknown error occured',
                              //   show: true,
                              // })
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
