import { auth } from "../firebase-config"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../authContext"
import Button from "../components/Button";


export default function StartPage(){
    const { user } = useAuthContext();

    return(
        <>
            <h1 className="font-archivo text-text text-6xl leading-18 font-bold">Hi {user?.displayName}</h1>
            <h2>Welcome to SkillForge!</h2>
            <p>Let's start your journey!</p>
            <Button onClick={logout}>logout</Button>
        </>
    )
}