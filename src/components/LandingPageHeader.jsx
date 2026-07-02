import Logo from "./Logo"
import Button from "./Button"
import { Link } from "react-router-dom"

export default function LandingPageHeader(){
    return(
        <header 
        className="flex items-center justify-between px-section py-4 border-b border-detail">
            <Link to="/">
                <Logo/>
            </Link>
            <div className="buttons flex items-center gap-4">
                <Link to="signup">
                    <Button primary={true}>Start Forging</Button>
                </Link>
                <Link to="login">
                    <Button primary={false}>Sign in</Button>
                </Link>
            </div>
        </header>
    )
}