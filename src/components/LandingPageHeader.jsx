import Logo from "./Logo"
import Button from "./Button"
export default function LandingPageHeader(){
    return(
        <header 
        className="flex items-center justify-between px-8 py-4 border-b border-detail">
            <Logo/>
            <div className="buttons flex items-center gap-4">
                <Button primary={true}>Start Forging</Button>
                <Button primary={false}>Sign in</Button>
            </div>
        </header>
    )
}