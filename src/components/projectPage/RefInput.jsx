import Button from "../Button";
import { Check } from "lucide-react";
import { arrayUnion } from "firebase/firestore";
import { nanoid } from "nanoid";
import { useState } from "react";
import { emptyInput } from "../../services/function";

export default function RefInput({ updateProject}) {

    const [reflectionTitle, setReflectionTitle] = useState("")
    const [reflectionContent, setReflectionContent] = useState("")

    async function addNewReflection(){
        const trimmedTitle = reflectionTitle.trim();
        const trimmedContent = reflectionContent.trim();
        if(trimmedTitle === "" || trimmedContent === ""){
            await emptyInput('Title and content cannot be empty');
            return;
        }
        const id = nanoid();
        await updateProject({reflections: arrayUnion({
            id:id,
            title:trimmedTitle,
            content:trimmedContent
        })})
        setReflectionContent("")
        setReflectionTitle("")
    }

    return (
        <div className="rounded-xl border border-accent bg-background p-4 flex flex-col">
            <input 
            className="font-semibold text-text w-full outline-none"
            type="text" 
            name="reflection-title" 
            id="reflection-title"
            placeholder="title"
            value={reflectionTitle}
            onChange={(e)=> setReflectionTitle(e.target.value)}
            />
            <textarea 
            className="mt-2 text-sm leading-6 text-detail w-full outline-none resize-none h-fit"
            type="text" 
            name="reflection-content" 
            id="reflection-content"
            placeholder="write reflection..."
            value={reflectionContent}
            onChange={(e)=> setReflectionContent(e.target.value)}
            />
            <Button 
            classes="p-0! ml-auto" 
            primary={true} 
            onClick={addNewReflection}
            >
                <Check/>
            </Button>
        </div>
    )
}