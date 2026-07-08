export default function ProgressBar({width}){
    return(
        <div className="progress-bar bg-background w-full h-3 rounded-full overflow-hidden my-4">
            <div style={{width:width}} className={`bg-primary h-full rounded-full`}></div>
        </div>
    )
}