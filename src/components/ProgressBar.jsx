export default function ProgressBar({progress}){
    return(
        <div className="relative">
            <span className="detail absolute bottom-4 right-0">{progress || 0}%</span>
            <div 
            className="relative progress-bar bg-[#D6D6D6] w-full h-2 rounded-full overflow-hidden my-4">
                <div 
                style={{width:`${progress || 0}%`}} 
                className={`bg-primary h-full rounded-full`}></div>
            </div>
        </div>
    )
}