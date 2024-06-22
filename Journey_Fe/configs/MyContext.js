import React, { createContext, useReducer } from 'react';

const MyContext = createContext();
const MyDispatchContext = createContext();

const initialState = {
    user: null,
    isLoggedIn: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'login':
            return { ...state, user: action.payload, isLoggedIn: true };
        case 'logout':
            return { ...state, user: null, isLoggedIn: false };
        default:
            return state;
    }
};

const MyProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <MyContext.Provider value={state}>
            <MyDispatchContext.Provider value={dispatch}>
                {children}
            </MyDispatchContext.Provider>
        </MyContext.Provider>
    );
};

export { MyContext, MyDispatchContext, MyProvider };
