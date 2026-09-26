import { Check, X, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { deleteWarning } from "../../services/function";

export default function TechStack({ skill, updateProject }) {
    
    const [editingTech, setEditingTech] = useState(null)
    const [editTechValue, setEditTechValue] = useState("")

    function startEditTech(skillItem){
        setEditingTech(skillItem)
        setEditTechValue(skillItem)
    }

    async function saveEditedTech(oldSkill){
        const trimmedValue = editTechValue.trim();
        if(!trimmedValue) return cancelEditTech()
        await updateProject({ techStack: arrayRemove(oldSkill) })
        await updateProject({ techStack: arrayUnion(trimmedValue) })
        cancelEditTech()
    }

    function cancelEditTech(){
        setEditingTech(null)
        setEditTechValue("")
    }

    async function removeTechSkill(skillItem){
        const result = await deleteWarning('tech skill');
        if (!result) return;
        await updateProject({ techStack: arrayRemove(skillItem) })
    }


    return (
        editingTech === skill ? (
            <div className="tag bg-accent flex items-center gap-2">
                <input className="outline-none bg-transparent" value={editTechValue} onChange={(e)=>setEditTechValue(e.target.value)} />
                <button className="cursor-pointer" onClick={()=>saveEditedTech(skill)}><Check width={14} /></button>
                <button className="cursor-pointer" onClick={cancelEditTech}>
                    <X width={14} className="text-red"/>
                </button>
            </div>
        ) : (
            <span className="tag bg-accent flex items-center gap-2">
                {skill}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="cursor-pointer text-detail transition hover:text-accent"
                        onClick={() => startEditTech(skill)}
                        aria-label={`Edit skill ${skill}`}
                    >
                        <Pen width={12} height={12} />
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer text-detail transition hover:text-red-500"
                        onClick={() => removeTechSkill(skill)}
                        aria-label={`Delete skill ${skill}`}
                    >
                        <Trash width={12} height={12} />
                    </button>
                </div>
            </span>
        )
    )
}