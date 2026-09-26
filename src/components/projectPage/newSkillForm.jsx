import { Plus } from "lucide-react";
import { useState } from "react";
import { arrayUnion } from "firebase/firestore";
import { emptyInput } from "../../services/function";

export default function NewSkillForm({ updateProject }) {
    
    const [skill, setSkill] = useState("")
    
    async function addNewSkill(){
        const trimmedSkill = skill.trim();
        if(trimmedSkill === ""){
            await emptyInput("Skill cannot be empty!");
            return;
        }
        await updateProject({techStack: arrayUnion(trimmedSkill)})
        setSkill("")
    }

    return(
        <div className="tag bg-accent">
            <input
            className=" w-fit outline-none"
            placeholder="add new skill.."
            type="text" 
            name="skill" 
            value={skill}
            onChange={(e)=>setSkill(e.target.value)}
            />
            <button 
            className="cursor-pointer hover:opacity-50"
            onClick={addNewSkill}>
                <Plus width={17}/>
            </button>
        </div>
    )
}