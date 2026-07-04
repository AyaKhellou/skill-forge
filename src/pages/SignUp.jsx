import FormGroup from "../components/FormGroup"
import Button from "../components/Button"
import googleIcon from "../assets/icons8-google-96.png"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { auth } from "../firebase-config"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"


export default function SignUp(){

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const navigate = useNavigate();

    function createUser(e){
        e.preventDefault();
        createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("User created successfully: ", user);
            // navigate("/dashboard");
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
        });
    }

    function signInGoogle(e){
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }


    return(
        <section className="flex flex-row items-center justify-center p-section">
            <form className="signup-form bg-background flex flex-col items-center gap-4 w-[60%] p-section rounded-lg shadow-lg">
                <h2>Create 
                    <span className="text-accent"> Your Account</span>
                </h2>
                <FormGroup label="Name" type="text" name="userName" id="user-name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <FormGroup label="Email" type="email" name="userEmail" id="user-email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                <FormGroup label="Password" type="password" name="userPassword" id="user-password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                <Button 
                classes="w-full" 
                primary={true} 
                onClick={createUser}
                >Create Account</Button>  
                <span className="text-detail">or</span>
                <Button 
                classes="w-full flex items-center justify-center gap-2" 
                type="button" 
                primary={false}
                onClick={signInGoogle}>
                    <img src={googleIcon} alt="Google Icon" className="w-7 h-7" />
                    Continue with Google
                </Button>
                <span className="text-detail">Already have an account? <Link to="/login" className="text-accent font-semibold">Log In</Link></span>
            </form>
        </section>
    )
}