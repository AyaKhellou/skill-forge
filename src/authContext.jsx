import { useEffect, useState, createContext, useContext } from "react";
import { auth } from "./firebase-config"
import { onAuthStateChanged } from "firebase/auth"

const authContext = createContext()

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    return(
        <authContext.Provider value={{ user }}>
            {children}
        </authContext.Provider>
    )
}

export function useAuthContext(){
    return useContext(authContext)
}