export default function Stats({title,value ,className}){
    return(
        <div className={`bg-card-background shadow flex-1 min-w-37 p-4 rounded ${className}`}>
            <p className="detail">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
        </div>
    )
}