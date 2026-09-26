import { Pen, Trash, Check, X } from "lucide-react";
import { useState } from "react";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { deleteWarning, emptyInput } from "../../services/function";

export default function Reflection({ reflection, updateProject }) {

    const [editingReflectionId, setEditingReflectionId] = useState(null)
    const [editReflectionTitle, setEditReflectionTitle] = useState("")
    const [editReflectionContent, setEditReflectionContent] = useState("")

    function startEditReflection(reflection){
        setEditingReflectionId(reflection.id)
        setEditReflectionTitle(reflection.title)
        setEditReflectionContent(reflection.content)
    }

    function cancelEditReflection(){
        setEditingReflectionId(null)
        setEditReflectionTitle("")
        setEditReflectionContent("")
    }

    async  function saveEditedReflection(oldReflection){
        const trimmedTitle = editReflectionTitle.trim();
        const trimmedContent = editReflectionContent.trim();
        if(trimmedTitle === "" || trimmedContent === ""){
            await emptyInput('Title and content cannot be empty');
            return;
        }
        const updated = { ...oldReflection, title: trimmedTitle, content: trimmedContent }
        await updateProject({ reflections: arrayRemove(oldReflection) })
        await updateProject({ reflections: arrayUnion(updated) })
        cancelEditReflection()
    }
    async function removeReflection(reflection){
        const result = await deleteWarning('reflection');
        if (!result) return;
        await updateProject({ reflections: arrayRemove(reflection) })
    }


    return (
        <div className="relative rounded-xl border border-accent bg-background p-4">
            <div className="absolute right-3 top-3 flex gap-2">
                <button
                    type="button"
                    className="cursor-pointer text-detail transition hover:text-accent"
                    onClick={() => startEditReflection(reflection)}
                    aria-label={`Edit reflection ${reflection.title}`}
                >
                    <Pen width={14} height={14} />
                </button>
                <button
                    type="button"
                    className="cursor-pointer text-detail transition hover:text-red-500"
                    onClick={() => removeReflection(reflection)}
                    aria-label={`Delete reflection ${reflection.title}`}
                >
                    <Trash width={16} height={16} />
                </button>
            </div>
            {editingReflectionId === reflection.id ? (
                <div className="flex flex-col gap-2">
                    <input
                        className="font-semibold text-text w-full outline-none"
                        type="text"
                        value={editReflectionTitle}
                        onChange={(e) => setEditReflectionTitle(e.target.value)}
                    />
                    <textarea
                        className="mt-2 text-sm leading-6 text-detail w-full outline-none resize-none h-fit"
                        value={editReflectionContent}
                        onChange={(e) => setEditReflectionContent(e.target.value)}
                    />
                    <div className="flex gap-2 self-end">
                        <button className="cursor-pointer" onClick={() => saveEditedReflection(reflection)}>
                            <Check />
                        </button>
                        <button className="cursor-pointer" onClick={cancelEditReflection}>
                            <X className="text-red"/>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h4 className="font-semibold text-text pr-8">{reflection.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-detail">{reflection.content}</p>
                </>
            )}
        </div>
    )
}