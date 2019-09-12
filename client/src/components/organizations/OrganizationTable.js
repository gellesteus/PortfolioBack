import React, { useEffect, useState } from 'react';
import Member from './Member';
import Pagination from '../layout/Pagination';
import Loading from '../layout/Loading';
import Cookies from 'universal-cookie';
const cookie = new Cookies();
export default props => {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortColumn: '_id', sortOrder: 1 });
  const [data, setData] = useState();

  const toServerSort = data => {
    switch (data) {
      case 'Name':
        return 'name';
      case 'Members':
        return 'members';
      case 'Holdings':
        return 'holdings';
      case 'Short Description':
        return 'shortDesc';
      default:
        return '_id';
    }
  };

  const loadData = () => {
    setLoading(true);
    fetch(
      `http://localhost:3001/organization?page=${page}&sortColumn=${toServerSort(
        sort.sortColumn
      )}&sortOrder=${sort.sortOrder}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: cookie.get('token'),
        },
      }
    )
      .then(res => res.json())
      .then(res => {
        setData({ organizations: res.organizations });
        setPages(res.pages);
        setLoading(false);
      })
      .catch(e => setLoading(true));
  };

  useEffect(loadData, [sort, page]);

  const sortData = () => {
    if (loading) return;
    this.loadData();
  };

  const onSort = event => {
    const sortKey = event.target.innerHTML.trim().split(' ')[0];
    if (sort.sortColumn === sortKey) {
      if (sort.sortOrder === -1) {
        setSort(
          {
            sortColumn: '_id',
            sortOrder: 1,
          },
          sortData
        );
      } else {
        setSort({ ...sort, sortOrder: -sort.sortOrder }, sortData);
      }
    } else {
      setSort({ sortColumn: sortKey, sortOrder: 1 }, sortData);
    }
    setPage(1);
  };

  const getStyle = name => {
    if (!loading) {
      const styling =
        name === sort.sortColumn || false
          ? { color: '#A52A2A' }
          : { color: '#000000' };
      return {
        ...itemStyle,
        ...styling,
      };
    }
    return itemStyle;
  };

  const glyph = item => {
    if (item === sort.sortColumn) {
      /* Add a glyph with a sort direction */
      if (sort.sortOrder === 1) {
        return <span>&#8595;</span>;
      } else {
        return <span>&#8593;</span>;
      }
    } else {
      /* No glyph needs to be added */
      return null;
    }
  };

  return (
    <div>
      <p>Organizations</p>
      <table id='organizations-table' className='table-data'>
        <thead>
          <tr>
            <th onClick={onSort} style={getStyle('Name')}>
              Name {glyph('Name')}
            </th>
            <th onClick={onSort} style={getStyle('Headquarters')}>
              Headquarters {glyph('Headquarters')}
            </th>
            <th onClick={onSort} style={getStyle('Members')}>
              Members {glyph('Members')}
            </th>
          </tr>
        </thead>
        {!loading ? (
          <tbody>
            {data.organizations.map((item, key) => {
              return (
                <Member
                  key={item._id}
                  index={item._id}
                  member={item}
                  match={props.match}
                />
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan='3'>
                <Loading />
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {pages > 1 ? (
        <Pagination pages={pages} page={page} handler={setPage} />
      ) : null}
    </div>
  );
};

const itemStyle = {
  cursor: 'pointer',
  userSelect: 'none',
};
