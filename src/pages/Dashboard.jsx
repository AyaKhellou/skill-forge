import { auth } from "../firebase-config"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../authContext"


export default function Dashboard(){
    const { user } = useAuthContext();
    console.log(user);
    

    const navigate = useNavigate();
    function logout(){
        signOut(auth)
        .then(() => {
            navigate('/')
        })
        .catch((error) => {
            console.log(error);
            
        });
    }
    return(
        <>
            <h1 className="font-archivo text-text text-6xl leading-18 font-bold">Dashboard HERE</h1>
            <button onClick={logout}>logout</button>
        </>
    )
}