import CheckBox from "./CheckBox"
import { useState } from "react"
import { Trash, Pen, Check } from "lucide-react"

export default function SkillCard({
    status,name,toggleCheck, deleteSkill, editSkill,id , goalId
}){
    const[editSkillMode, SetEditSkilMode] = useState(false)
    const [editedSkill, setEditedSkill] = useState(name)
    function handleEdit(){
        SetEditSkilMode(true)
    }

    function saveEdit(){
        editSkill(goalId,id,editedSkill)
        SetEditSkilMode(false)
    }

    return(
        <div className="skill flex items-center justify-between bg-background p-4 my-4 rounded">
            {editSkillMode?
                <input 
                className="outline-none border-none"
                value={editedSkill}
                onChange={e=>setEditedSkill(e.target.value)}
                />
            :
                <div className="info flex items-center gap-5">
                <CheckBox checked={status} toggleCheck={toggleCheck} />
                <div>
                    <h4 className="text-lg font-figtree text-text">{name}</h4>
                </div>
            </div>
            }
            <div className="buttons">
                <button 
                onClick={deleteSkill}
                type="button" 
                className="cursor-pointer">
                    <Trash width={17} />
                </button>
                {
                editSkillMode?
                <button 
                onClick={saveEdit}
                type="button" 
                className="cursor-pointer pl-3">
                    <Check width={17}/>
                </button>
                :
                <button 
                onClick={handleEdit}
                type="button" 
                className="cursor-pointer pl-3">
                    <Pen width={17}/>
                </button>
                }
            </div>
        </div>
        
    )
}