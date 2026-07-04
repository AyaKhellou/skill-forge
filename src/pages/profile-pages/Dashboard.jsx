import { auth } from "../../firebase-config"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../authContext"
import Button from "../../components/Button";


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
        <section className="dashboard w-[80%] h-screen">
            <h1 className="font-archivo text-text text-6xl leading-18 font-bold">Hi {user?.displayName}</h1>
            <h2>Welcome to your dashboard!</h2>
            <Button onClick={logout}>logout</Button>
        </section>
    )
}