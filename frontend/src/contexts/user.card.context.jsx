import { useReducer, createContext } from "react";
import PropTypes from 'prop-types';

export const UserCardContext = createContext();

export const UserCardReducer = (state, action) => {
    switch (action.type) {
        case 'STORE_USER_CARD_DATA':
            return {
                data: action.payload
            }
        case 'DELETE_USER_CARD_DATA':
            return {
                data: null
            }
        default:
            return state;
    }
}

export const UserCardContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(UserCardReducer, {
        data: null
    });

    return (
        <UserCardContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserCardContext.Provider>
    )
}

UserCardContextProvider.propTypes = {
  children: PropTypes.node,
};