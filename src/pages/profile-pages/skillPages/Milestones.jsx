import { useState, useEffect } from "react";
import { emptyInput } from "../../../services/function";
import Milestone from "../../../components/Milestone";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import useMilestones from "../../../hooks/useMilestones";
import Loader from "../../../components/Loader";
import useSkill from "../../../hooks/useSkill";


export default function Milestones(){

    const [updateMode, setUpdateMode] = useState(false)
    const [newMilestone, setNewMilestone] = useState("")
    
    let { skillId, goalId } = useOutletContext();

    
    const { milestones, loadingMilestones, error, addMilestone, editMilestone, deleteCurrentMilestone } = useMilestones(goalId, skillId);
    const { updateSkillData } = useSkill(goalId, skillId);

    async function saveMilestone(){
        const milestoneName = newMilestone.trim();
        if(!milestoneName) {
            await emptyInput("Milestone name cannot be empty");
            return;
        }
        try{
            await addMilestone(milestoneName);
            setUpdateMode(false)
            setNewMilestone("")
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        const progress = 
        Math.round(milestones?.filter(milestone=> milestone.status === true).length * 100 / milestones?.length)
        
        async function updateProgress(){
            try{
                await updateSkillData({
                    progress : progress,
                    status: progress === 100 ? true : false,
                    milestonesCount:milestones?.length
                })
            }catch(err){
                console.log(err);
            }
        }
        updateProgress();
        
    },[milestones,goalId,skillId])

    
    if(loadingMilestones){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center justify-center">
                <Loader/>
            </div>
        )
    }
    return(
        <div className="bg-card-background shadow rounded p-section flex flex-col">
            <div className="milestones mb-4">
                {
                error ? <p>{error}</p> :
                milestones?.length !== 0 && milestones ?
                milestones.map((milestone)=>{
                    return <Milestone 
                    key={milestone.id}
                    milestone={milestone}
                    onEdit={editMilestone}
                    onDelete={deleteCurrentMilestone}
                    />
                })
                :
                <p>No milestones!</p>
                }
            </div>
            {updateMode &&
                <input 
                className="bg-background border-b border-accent flex items-center gap-3 p-5"
                onChange={(e)=> setNewMilestone(e.target.value)}
                value={newMilestone}
                />
            }
            {updateMode ?
                <Button 
                classes="self-end mt-3"
                onClick={saveMilestone}>save milestone</Button>
                :
                <Button 
                classes="self-end"
                onClick={()=>setUpdateMode(true)}>add milestone</Button>
            }
        </div>
    )
}