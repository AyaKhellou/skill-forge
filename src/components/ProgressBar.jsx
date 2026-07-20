export default function ProgressBar({progress}){
    return(
        <div className="progress-bar bg-[#D6D6D6] w-full h-3 rounded-full overflow-hidden my-4">
            <div style={{width:`${progress}%`}} className={`bg-primary h-full rounded-full`}></div>
        </div>
    )
}