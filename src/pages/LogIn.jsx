import FormGroup from "../components/FormGroup"
import Button from "../components/Button"
import googleIcon from "../assets/icons8-google-96.png"
import { Link } from "react-router-dom"

export default function LogIn(){
    return(
        <section className="flex flex-row items-center justify-center p-section">
            <form className="signup-form bg-background flex flex-col items-center gap-4 w-[60%] p-section rounded-lg shadow-lg">
                <h2>Sign In</h2>
                <FormGroup label="Email" type="email" name="userEmail" id="user-email" />
                <FormGroup label="Password" type="password" name="userPassword" id="user-password" />
                <Button classes="w-full" type="submit" primary={true}>Sign In</Button>  
                <span className="text-detail">or</span>
                <Button classes="w-full flex items-center justify-center gap-2" type="button" primary={false}>
                    <img src={googleIcon} alt="Google Icon" className="w-7 h-7" />
                    Continue with Google
                </Button>
                <span className="text-detail">Don't have an account? <Link to="/signup" className="text-accent font-semibold">Sign Up</Link></span>
            </form>
        </section>
    )
}