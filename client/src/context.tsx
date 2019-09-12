import React, { createContext, useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
const Context = createContext();

export const Consumer = Context.Consumer;
export const Provider = props => {
  const [state, dispatch] = useReducer(reducer, {
    heading: 'The Chain',
    isLoggedIn: false,
    user: null,
  });

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};
export default Context;
