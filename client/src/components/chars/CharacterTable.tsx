import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { displayAlert } from '../../actions';
import { ICharacter } from '../../types';
import { Level } from '../error/Alert';
import Loading from '../layout/Loading';
import Pagination from '../layout/Pagination';
import Member from './CharacterTableMember';

const cookies = new Cookies();
const count = 10;

export default () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [characters, setCharacters] = useState([] as ICharacter[]);
  const [sort, setSort] = useState('_id');
  const [sortOrder, setSortOrder] = useState(1);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/character?page=${page}&count=${count}&sortCol=${sort}&sortOrder=${sortOrder}`,
      {
        headers: {
          accepts: 'application/json',
          authorization: cookies.get('token'),
          'content-type': 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setCharacters(res.characters);
          setPages(res.pages);
          setLoading(false);
        } else {
          dispatch(displayAlert(res.message, Level.DANGER));
        }
      })
      .catch(e => dispatch(displayAlert(e.message, Level.DANGER)));
  }, [page, sort, sortOrder]);

  if (loading) {
    return <Loading />;
  }

  if (!characters) {
    return <p>No content found</p>;
  }

  const sortClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).innerHTML
      .split(' ')[0]
      .toLowerCase();
    if (sort === target) {
      if (sortOrder === 1) {
        setSortOrder(-1);
      } else {
        setSort('_id');
        setSortOrder(1);
      }
    } else {
      setSort(target);
      setSortOrder(1);
    }
  };

  const glyph = (item: string) => {
    if (item === sort) {
      /* Add a glyph with a sort direction */
      if (sortOrder === 1) {
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
    <div className='content'>
      <table style={{ width: '100%' }} className='table-data'>
        <thead>
          <tr>
            <th style={{ width: '20%', textAlign: 'left' }} onClick={sortClick}>
              Name {glyph('name')}
            </th>
            <th style={{ width: '80%', textAlign: 'left' }} onClick={sortClick}>
              Description {glyph('description')}
            </th>
          </tr>
        </thead>
        <tbody>
          {characters.map((item: ICharacter, index: number) => (
            <Member key={item._id} character={item} />
          ))}
        </tbody>
      </table>
      <Pagination page={page} pages={pages} handler={setPage} />
    </div>
  );
};
