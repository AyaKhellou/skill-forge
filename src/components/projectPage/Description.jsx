import Button from '../Button';
import { useEffect, useState } from 'react';
import { emptyInput } from '../../services/function.js';
export default function Description({ description, updateProject }) {


    const [descriptionState, setDescriptionState] = useState("")

    useEffect(()=>{
        if(description !== undefined){
            setDescriptionState(description)
        }else{
            setDescriptionState("No description yet!")
        }
    },[description])

    async function saveDescription(){
        const trimmedDescription = descriptionState.trim()
        if(trimmedDescription === ""){
            await emptyInput("Description cannot be empty!")
            return;
        }
        await updateProject({description:trimmedDescription})
    }

    return (
        <div id="description" className="project-card flex flex-col gap-3 rounded-2xl border border-border-color bg-background/80 p-5 shadow-sm">
            <h3 className="text-2xl font-semibold text-text">Description</h3>
            <div className="mt-1 rounded-xl border border-accent bg-background p-3">
                <textarea
                    value={descriptionState}
                    onChange={(e)=> setDescriptionState(e.target.value)}
                    className="w-full min-h-32 resize-none bg-transparent text-sm leading-7 text-detail outline-none"
                    placeholder="Add a project description..."
                />
            </div>
            <Button 
                classes="self-end"
                disabled={description !== descriptionState ? false : true} 
                onClick={saveDescription}>save desc</Button>
        </div>
    )
}