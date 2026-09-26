import Button from "../Button";
import { useState } from "react";
import { nanoid } from "nanoid";
import { arrayUnion } from "firebase/firestore";
import { emptyInput } from "../../services/function";

export default function LinkForm({ updateProject }) {

    const [linkName, setLinkName] = useState("")
    const [linkUrl, setLinkUrl] = useState("")

    async function addNewLink(){
        const trimmedLinkName = linkName.trim();
        const trimmedLinkUrl = linkUrl.trim();
        if(trimmedLinkName === "" || trimmedLinkUrl === ""){
            await emptyInput("Link title and URL cannot be empty!");
            return;
        }
        const id = nanoid()
        await updateProject({links: arrayUnion({
            id:id,
            title:trimmedLinkName,
            url:trimmedLinkUrl
        })})
        setLinkName("")
        setLinkUrl("") 
    }

    return(
        <div className="flex flex-col gap-3 rounded-xl border border-border-color bg-background px-3 py-3 text-sm font-semibold transition duration-200 ease-linear hover:border-accent">
            <div className="flex w-full flex-col gap-2">
                <input 
                type="text" 
                name="link-name" 
                className="w-full rounded-lg border border-accent/40 bg-background px-2 py-1.5 outline-none placeholder:text-detail/70"
                placeholder="Link title" 
                value={linkName}
                onChange={(e)=>setLinkName(e.target.value)}
                />
                <input 
                type="text" 
                name="link-url"
                className="w-full rounded-lg border border-accent/40 bg-background px-2 py-1.5 outline-none placeholder:text-detail/70"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e)=>setLinkUrl(e.target.value)}
                />
            </div>
            <Button
            primary={true}
            classes="whitespace-nowrap"
            onClick={addNewLink}>Add new link</Button>
        </div>
    )
}