import React, { useState } from 'react';
/* Will toggle an item on and off when it is clicked */

export interface IProps {
  heading: string;
  component: React.ElementType;
}
export default (props: IProps) => {
  const [hidden, setHidden] = useState(true);

  const headStyle = {
    cursor: 'pointer',
    userSelect: 'none',
  };

  /* TODO: define slide down animation for the body */

  return (
    <>
      <h4 onClick={e => setHidden(!hidden)} style={{}}>
        {props.heading}
      </h4>
      {hidden ? null : <props.component />}
    </>
  );
};
