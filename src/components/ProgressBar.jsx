export default function ProgressBar({width}){
    return(
        <div className="progress-bar bg-background border border-text  w-full h-3 rounded-full overflow-hidden my-4">
            <div className={`bg-primary w-[${width}] h-full rounded-full`}></div>
        </div>
    )
}