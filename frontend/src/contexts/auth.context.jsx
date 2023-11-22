import { useReducer, createContext, useEffect } from "react";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'SIGN_IN_START':
            return {
                loading: true
            }
        case 'SIGN_IN_FAILURE':
            return {
                loading: false,
                error: action.payload
            }
        case 'SIGN_IN_SUCCESS':
            return {
                user: action.payload,
                loading: false,
                error: null
            }
        case 'UPDATE_USER_START':
            return {
                ...state,
                loading: true
            }
        case 'UPDATE_USER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'UPDATE_USER_SUCCESS':
            return {
                loading: false,
                error: null,
                user: action.payload
            }
        case 'DELETE_USER_START':
            return {
                loading: true
            }
        case 'DELET_USER_FAILURE':
            return {
                loading: false,
                error: action.payload
            }
        case 'DELETE_USER_SUCCESS':
            return {
                loading: false,
                error: null,
                user: null
            }
        case 'SIGN_OUT_START':
            return {
                loading: true
            }
        case 'SIGN_OUT_FAILURE':
            return {
                loading: false,
                error: action.payload
            }
        case 'SIGN_OUT_SUCCESS':
            return {
                loading: false,
                error: null,
                user: null
            }
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, {
        user: null,
        error: null,
        loading: false,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({ type: 'SIGN_IN_SUCCESS', payload: user });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};