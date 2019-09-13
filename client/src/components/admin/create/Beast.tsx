import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import useCSRF from '../../../hooks/useCSRF';

const cookies = new Cookies();
/* TODO: Images */
export default () => {
  const [beast, setBeast] = useState({
    images: [],
    longDesc: '',
    name: '',
    shortDesc: '',
  });
  const token = useCSRF();

  const submit = (e: React.MouseEvent) => {
    // setAlert({
    //   level: 'info',
    //   message: '',
    //   show: false,
    // });

    e.preventDefault();
    fetch('/api/bestiary', {
      body: JSON.stringify(beast),
      headers: {
        CSRF: token,
        authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setBeast({
            images: [],
            longDesc: '',
            name: '',
            shortDesc: '',
          });
          // setAlert({
          //   level: 'success',
          //   message: res.message || 'Success',
          //   show: true,
          // });
        } else {
          // setAlert({
          //   level: 'danger',
          //   message: res.message || 'An unknown error occured',
          //   show: true,
          // });
        }
      })
      .catch(
        err => console.log(err.message)
        // setAlert({
        //   level: 'danger',
        //   message: err.message || 'An unknown error occured',
        //   show: true,
        // })
      );
  };

  return (
    <>
      <form className="create">
        <label htmlFor="Name">Name</label>
        <input
          type="text"
          name="Name"
          value={beast.name}
          onChange={e => setBeast({ ...beast, name: e.target.value })}
        />

        <label htmlFor="Short Desc">Short Description</label>
        <input
          type="text"
          name="shortDesc"
          value={beast.shortDesc}
          onChange={e => setBeast({ ...beast, shortDesc: e.target.value })}
        />

        <label htmlFor="longDesc">Long Description</label>
        <textarea
          rows={10}
          cols={30}
          name="longDesc"
          value={beast.longDesc}
          onChange={e => setBeast({ ...beast, longDesc: e.target.value })}
        />

        <button onClick={submit}>Submit</button>
      </form>
    </>
  );
};
