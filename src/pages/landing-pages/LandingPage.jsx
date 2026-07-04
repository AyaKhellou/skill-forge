import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { auth } from "../../firebase-config"

export default function LandingPage(){
    return(
        <section 
        className="flex flex-col items-center justify-center text-center gap-6 h-[calc(100vh-5rem)] p-section">
            <h1 
            className="font-archivo text-text text-6xl leading-18 font-bold">
                Forge Your Skills,
                <br/>
                <span className="text-accent">Master</span> Anything.</h1>
            <p className="description">
                StudyForge gives you visual skill maps, daily tracking, and AI coaching so every practice session
                <br/> moves you forward. No more wasted effort — just measurable growth.
            </p>
            <div className="buttons flex items-center gap-4">
                <Link to="signup">
                    <Button primary={true}>Start Forging</Button>
                </Link>
                <Link to="login">
                    <Button primary={false}>Sign in</Button>
                </Link>
            </div>
        </section>
    )
}