import React, { useState, useRef } from 'react'

export const Context = React.createContext();

const ContextProvider = (props) => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState('');
    const [contacts, setContacts] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [onLogout, setOnLogout] = useState(false);
    const socket = useRef();

    return (
        <Context.Provider value={{
            user,
            setUser,
            token,
            setToken,
            contacts,
            setContacts,
            forceUpdate,
            setForceUpdate,
            onLogout,
            setOnLogout,
            socket
        }}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
