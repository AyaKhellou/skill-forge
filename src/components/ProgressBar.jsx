import { useContext } from "react"

export default function ProgressBar({progress}){
    return(
        <div className="progress-bar bg-background w-full h-3 rounded-full overflow-hidden my-4">
            <div style={{width:`${progress}%`}} className={`bg-primary h-full rounded-full`}></div>
        </div>
    )
}