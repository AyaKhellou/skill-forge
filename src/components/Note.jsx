export default function Note({title, timeCreated,content}){
    return(
        <div className="note relative bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm w-75 p-4">
            <h3 className="text-lg text-text font-figtree font-semibold mb-2">{title}</h3>
            <p className="text-sm text-detail mb-3">{content}</p>
            <div className="flex items-center justify-between text-xs text-detail">
                {/* <span className="tags">
                    {tags.map(tag=><span className="bg-accent text-text mr-2 py-1 px-3 rounded-full">{tag}</span>)} 
                </span> */}
                <span className="text-xs text-detail absolute bottom-2">{timeCreated}</span>
            </div>
        </div>
    )
}