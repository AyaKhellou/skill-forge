import { ArrowUpRight, Check, X, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { emptyInput, deleteWarning } from "../../services/function";

export default function Link({ link, updateProject }) {
    
    
    const [editingLinkId, setEditingLinkId] = useState(null)
    const [editLinkTitle, setEditLinkTitle] = useState("")
    const [editLinkUrl, setEditLinkUrl] = useState("")

    function startEditLink(linkItem){
        setEditingLinkId(linkItem.id)
        setEditLinkTitle(linkItem.title)
        setEditLinkUrl(linkItem.url)
    }

    function cancelEditLink(){
        setEditingLinkId(null)
        setEditLinkTitle("")
        setEditLinkUrl("")
    }

    async function saveEditedLink(oldLink){
        const trimmedTitle = editLinkTitle.trim();
        const trimmedUrl = editLinkUrl.trim();
        if(trimmedTitle === "" || trimmedUrl === ""){
            await emptyInput("Link title and URL cannot be empty!");
            return;
        }
        const updated = { ...oldLink, title: trimmedTitle, url: trimmedUrl }
        await updateProject({ links: arrayRemove(oldLink) })
        await updateProject({ links: arrayUnion(updated) })
        cancelEditLink()
    }

    async function removeLink(linkItem){
        const result = await deleteWarning('link');
        if(!result) return;
        await updateProject({ links: arrayRemove(linkItem) })
    }


    return (
        <div className="group flex items-center justify-between gap-2 rounded-xl border border-border-color bg-background px-3 py-3 text-sm font-semibold transition duration-200 ease-linear hover:-translate-y-0.5 hover:border-accent hover:shadow-sm">
            {editingLinkId === link.id ? (
                <div className="flex flex-1 flex-col gap-2">
                    <input 
                    value={editLinkTitle} 
                    onChange={(e)=>setEditLinkTitle(e.target.value)} 
                    className="w-full outline-none" />
                    <input 
                    value={editLinkUrl} 
                    onChange={(e)=>setEditLinkUrl(e.target.value)} 
                    className="w-full outline-none" />
                    <div className="flex gap-2 self-end">
                        <button onClick={()=>saveEditedLink(link)} 
                        className="cursor-pointer"><Check/></button>
                        <button onClick={cancelEditLink} 
                        className="cursor-pointer">
                            <X className="text-red"/>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <a href={link.url} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-between gap-3 text-text hover:text-accent">
                        <span className="truncate">{link.title}</span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <ArrowUpRight width={15} />
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="cursor-pointer text-detail transition hover:text-accent"
                            onClick={() => startEditLink(link)}
                            aria-label={`Edit link ${link.title}`}
                        >
                            <Pen width={14} height={14} />
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer text-detail transition hover:text-red-500"
                            onClick={() => removeLink(link)}
                            aria-label={`Delete link ${link.title}`}
                        >
                            <Trash width={15} height={15} />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
