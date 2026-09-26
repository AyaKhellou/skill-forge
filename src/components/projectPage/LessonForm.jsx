import { Check } from "lucide-react";
import { useState } from "react";
import { emptyInput } from "../../services/function";
import { nanoid } from "nanoid";
import { arrayUnion } from "firebase/firestore";

export default function LessonForm({ updateProject }) {

    const [lesson, setLesson] = useState("")

    async function addNewLesson(){
        const trimmedLesson = lesson.trim();
        
        if(trimmedLesson === ""){
            await emptyInput("Lesson content cannot be empty!");
            return;
        }
        const id = nanoid()
        await updateProject({lessonsLearned: arrayUnion({
            id:id,
            content:trimmedLesson
        })})
        setLesson("")
    }
    return(
        <div className="rounded-xl border border-accent bg-background p-3 flex items-center justify-between gap-3">
            <input 
            type="text" 
            className="w-full outline-none" 
            placeholder="new lesson..."
            value={lesson}
            onChange={(e)=> setLesson(e.target.value)}
            />
            <button 
            type="button"
            onClick={addNewLesson}
            className="cursor-pointer text-text transition hover:opacity-70">
                <Check/>
            </button>
        </div>
    )
}