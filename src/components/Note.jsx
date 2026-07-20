export default function Note({name,tags, timeCreated,text}){
    return(
        <div className="note bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm max-w-sm p-4">
            <h3 className="text-lg text-text font-figtree font-semibold mb-2">{name}</h3>
            <p className="text-sm text-detail mb-3">{text}</p>
            <div className="flex items-center justify-between text-xs text-detail">
                <span className="tags">
                    {tags.map(tag=><span className="bg-accent text-text mr-2 py-1 px-3 rounded-full">{tag}</span>)} 
                </span>
                <span>{timeCreated}</span>
            </div>
        </div>
    )
}