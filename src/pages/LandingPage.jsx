import LandingPageHeader from "../components/LandingPageHeader"
import Button from "../components/Button"

export default function LandingPage(){
    return(
        <>
        <LandingPageHeader />
        <section 
        className="flex flex-col items-center justify-center text-center gap-6 h-[calc(100vh-5rem)] ">
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
                <Button primary={true}>Start Forging</Button>
                <Button primary={false}>Sign in</Button>
            </div>
        </section>
        </>
    )
}