import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import useSkill from "../../hooks/useSkill";
import { ArrowLeft, Check, Pen, X } from "lucide-react";
import { useAuthContext } from "../../AuthContext";
import ProgressBar from "../../components/ProgressBar";
import { emptyInput } from "../../services/function";


export default function Skill(){
    const { user } = useAuthContext();
    const { goalId, skillId } = useParams() 
    const {skillData, loadingSkill, error, updateSkillData } = useSkill(goalId, skillId);

    const [skillTitle, setSkillTitle] = useState("")
    const [editTitleMode, setEditTitleMode] = useState(false)

    const userId = user.uid;
    
    useEffect(()=>{
        if(skillData?.name !== undefined){
            setSkillTitle(skillData.name)
        }
    },[skillData])

    async function editTitle(){
        const name = skillTitle.trim();
        if(name === ""){
            emptyInput('Skill title cannot be empty');
            return;
        }
        try{
            await updateSkillData({ name: skillTitle });
            setEditTitleMode(false)
        }catch(err){
            console.log(err);
        }
    }
    return (
        <section className="page flex flex-col gap-3">
            <div 
            className="bg-card-background shadow rounded p-section">
                <Link to={`/user/goals/${goalId}`} className="text-blue-500 flex items-center gap-2 my-3">
                    <ArrowLeft width={17}/>
                    <p>go back</p>
                </Link>
                <span 
                    className={`text-sm text-[#1F2937]! rounded-full p-1 ${skillData?.status ? "bg-sage" : "bg-peach"}`}
                >{skillData?.status ? "completed" : "pending"}
                </span>
                <div className="flex gap-3 ">
                    {
                        editTitleMode?
                        <input 
                        type="text" 
                        className="text-3xl font-bold text-text outline-none w-55"
                        value={skillTitle}
                        onChange={(e)=> setSkillTitle(e.target.value)}
                        />
                        :
                        <h2 className="mb-0!">
                            {skillData?.name}
                        </h2>
                    }
                    {
                    editTitleMode ?
                    <div className="flex gap-2">
                        <button 
                        className="cursor-pointer" 
                        onClick={editTitle}
                        >
                            <Check width={17}/>
                        </button>
                        <button 
                        className="cursor-pointer" 
                        onClick={()=>setEditTitleMode(false)}
                        >
                            <X width={17}/>
                        </button>
                    </div>                    
                    :
                    <button 
                    className="cursor-pointer" 
                    onClick={()=>setEditTitleMode(true)}>
                        <Pen width={17} className="text-text"/>
                    </button>}
                </div>
                <div className="detail flex flex-col gap-2">
                    <span>Created at: {skillData?.createdAt}</span>
                </div>
                <ProgressBar progress={skillData?.progress}/>
            </div>
            <div className="nav-bar bg-card-background shadow p-section flex justify-around">
                <NavLink to="" end className={ ({isActive}) => isActive? "text-accent! font-bold": ""}>Milestones</NavLink>
                <NavLink to="notes" className={ ({isActive}) => isActive? "text-accent! font-bold": ""}>Notes</NavLink>
                <NavLink to="resources" className={ ({isActive}) => isActive? "text-accent! font-bold": ""}>Resources</NavLink>
                <NavLink to="study-sessions" className={ ({isActive}) => isActive? "text-accent! font-bold": ""}>Study Sessions</NavLink>
            </div>
            <Outlet context={ {goalId, skillId, userId, skillData} }/>
        </section>
    )
}