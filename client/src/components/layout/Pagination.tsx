import React, { useEffect, useState } from 'react';

const maxButtons = 5;
const adjacents = 2;

export interface IProps {
  page: number;
  pages: number;
  handler: (arg0: number) => void;
}

export interface IButton {
  page: number;
}

export default (props: IProps) => {
  const [buttons, setButtons] = useState({ buttonList: [] as IButton[] });

  const update = () => {
    const buttonList = [];
    const { page, pages } = props;
    /* Add the buttons that are needed to the list */

    if (pages <= maxButtons) {
      /* Add all buttons to the list */
      for (let i = 1; i <= pages; i++) {
        buttonList.push({ page: i });
      }
    } else {
      /* Add the current page, first page and the last page, then fill up the buttons around the current page */
      if (page === pages) {
        /* Current page is the last page */
        buttonList.push({ page: 1 });
        buttonList.push({ page });
      } else if (page === 1) {
        /* Page is the first page */
        buttonList.push({ page });
        buttonList.push({ page: pages });
      } else {
        /* Page is not first or last */
        buttonList.push({ page: 1 });
        buttonList.push({ page });
        buttonList.push({ page: pages });
      }

      /* Add all the other required pages */
      for (let i = -adjacents; i <= adjacents; i++) {
        if (page + i > 1 && page + i < pages && i !== 0) {
          buttonList.push({ page: page + i });
        }
      }

      buttonList.sort((a, b) => a.page - b.page);
    }

    setButtons({
      buttonList,
    });
  };

  useEffect(update, [props]);

  return (
    <>
      {buttons.buttonList.map((item, key) => {
        return (
          <button
            key={item.page}
            disabled={item.page === props.page}
            className="btn btn-sm btn-primary"
            onClick={e => props.handler(item.page)}
          >
            {item.page}
          </button>
        );
      })}
    </>
  );
};
