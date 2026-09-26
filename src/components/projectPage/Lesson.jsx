import { Pen, Trash, Check, X } from "lucide-react";
import { useState } from "react";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { deleteWarning, emptyInput } from "../../services/function";

export default function Lesson({ lessonLearned, updateProject }) {

    const [editingLessonId, setEditingLessonId] = useState(null)
    const [editLessonContent, setEditLessonContent] = useState("")

    function startEditLesson(lessonItem){
        setEditingLessonId(lessonItem.id)
        setEditLessonContent(lessonItem.content)
    }

    function cancelEditLesson(){
        setEditingLessonId(null)
        setEditLessonContent("")
    }

    async function removeLesson(lessonLearned){
        const result = await deleteWarning('lesson');
        if(!result) return;
        await updateProject({ lessonsLearned: arrayRemove(lessonLearned) })
    }

    async function saveEditedLesson(oldLesson){
        const trimmedContent = editLessonContent.trim();
        if(trimmedContent === ""){
            await emptyInput("Lesson content cannot be empty!");
            return;
        }
        const updated = { ...oldLesson, content: trimmedContent }
        await updateProject({ lessonsLearned: arrayRemove(oldLesson) })
        await updateProject({ lessonsLearned: arrayUnion(updated) })
        cancelEditLesson()
    }



    return(
        <div className="flex flex-row-reverse justify-between rounded-xl border border-accent bg-background p-4">
                <div className="flex gap-2 items-start">
                    <button
                        type="button"
                        className="cursor-pointer text-detail transition hover:text-accent"
                        onClick={() => startEditLesson(lessonLearned)}
                        aria-label={`Edit lesson ${lessonLearned.content}`}
                    >
                        <Pen width={14} height={14} />
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer text-detail transition hover:text-red-500"
                        onClick={() => removeLesson(lessonLearned)}
                        aria-label={`Delete lesson ${lessonLearned.content}`}
                    >
                        <Trash width={15} height={15} />
                    </button>
                </div>
                {editingLessonId === lessonLearned.id ? (
                    <div className="flex-1 pr-8">
                        <input
                            className="w-full outline-none"
                            value={editLessonContent}
                            onChange={(e) => setEditLessonContent(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => saveEditedLesson(lessonLearned)} className="cursor-pointer"><Check/></button>
                            <button onClick={cancelEditLesson} className="cursor-pointer">
                                <X className="text-red"/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="pr-8 text-sm leading-6 text-detail">{lessonLearned.content}</p>
                )}
            </div>
    )
}