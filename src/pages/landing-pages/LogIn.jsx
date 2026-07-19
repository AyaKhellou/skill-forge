import FormGroup from "../../components/FormGroup"
import Button from "../../components/Button"
import googleIcon from "../../assets/icons8-google-96.png"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { auth } from "../../firebase-config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { signInGoogle } from "../../firebase/signInGoogle"
import ErrorMessage from "../../components/ErrorMessage"

export default function LogIn(){
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    function loginUser(e){
        e.preventDefault();
        signInWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            setErrorMessage(error.code.slice(error.code.indexOf("/") + 1));
        });
    }

    return(
        <section className="flex flex-row items-center justify-center p-section">
            <form className="signup-form bg-background flex flex-col items-center gap-4 w-[60%] p-section rounded-lg shadow-lg">
                <h2>Sign In</h2>
                <FormGroup label="Email" type="email" name="userEmail" id="user-email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                <FormGroup label="Password" type="password" name="userPassword" id="user-password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                {errorMessage && <ErrorMessage message={errorMessage} />}
                <Button classes="w-full" primary={true} onClick={loginUser}>
                    Sign In
                </Button>
                <span className="text-detail">or</span>
                <Button 
                classes="w-full flex items-center justify-center gap-2" 
                type="button" 
                primary={false}
                onClick={signInGoogle}>
                    <img src={googleIcon} alt="Google Icon" className="w-7 h-7" />
                    Continue with Google
                </Button>
                <span className="text-detail">Don't have an account? <Link to="/signup" className="text-accent font-semibold">Sign Up</Link></span>
            </form>
        </section>
    )
}