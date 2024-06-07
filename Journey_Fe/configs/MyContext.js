import React, { createContext, useReducer } from 'react';

const MyContext = createContext();
const MyDispatchContext = createContext();

const initialState = {
    user: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'login':
            return { ...state, user: action.payload ,isLoggedIn: true};
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
