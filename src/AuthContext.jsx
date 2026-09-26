import { useEffect, useState, createContext, useContext } from "react";
import { auth } from "./firebase-config"
import { onAuthStateChanged } from "firebase/auth"

const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false)
        },
        (error) => {
            setError(error);
            setLoading(false)
        }
        );
        return unsubscribe;
    }, []);

    return(
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error(
            "useAuthContext must be used within an AuthContextProvider"
        )
    }
    return context;
}
