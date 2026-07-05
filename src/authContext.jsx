import { useEffect, useState, createContext, useContext } from "react";
import { auth } from "./firebase-config"
import { onAuthStateChanged } from "firebase/auth"

const authContext = createContext()

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false)
        });
        return unsubscribe;
    }, []);

    return(
        <authContext.Provider value={{ user, loading }}>
            {children}
        </authContext.Provider>
    )
}

export function useAuthContext(){
    return useContext(authContext)
}