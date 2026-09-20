import ProgressBar from "../components/ProgressBar"
import { useState, useEffect } from "react"
import { useAuthContext } from "../AuthContext"
import { Link } from "react-router-dom"
import { deleteGoal, getUserskills } from "../services/firestore"
import { Trash } from "lucide-react"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'




export default function GoalCard({ goalName, goalId }){
    const [skills,setSkills] = useState(null)
    const {user} = useAuthContext();
    const userId = user?.uid;
    const MySwal = withReactContent(Swal);

    useEffect(()=>{
        if(!userId) return;
        if(userId){
            getUserskills(userId,goalId)
            .then(skills => setSkills(skills))
        }
    },[goalId,userId])

    const progress  = 
        skills?.length === 0 ?
        0:
        Math.round((100 * skills?.filter(skill=> skill.status === true).length) / skills?.length)

    async function deleteCurrentGoal(){

        const result = await MySwal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "You will not be able to recover this goal!",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            customClass: {
                popup: "alert",
                title: "alert-title",
                confirmButton: "confirm-button",
                cancelButton: "cancel-button",
            },
        });
        if (!result.isConfirmed) return;

        try {
            await deleteGoal(userId, goalId);
        } catch (error) {
            console.error("Error deleting goal:", error);
        }

    
    }

    return(
            <div className={`rounded p-section bg-card-background border border-accent shadow`}>
                <div className="header flex items-center gap-2">
                    <button 
                    className="text-detail hover:text-red cursor-pointer m-0!"
                    onClick={deleteCurrentGoal} >
                        <Trash width={15} />
                    </button>
                    <Link to={`${goalId}`}>
                        <h3 className="font-figtree text-xl font-semibold text-text m-0!">{goalName}</h3>
                    </Link>
                    
                </div>
                <ProgressBar progress={progress}/>
                <div className="flex flex-wrap gap-1">
                    {skills?.map((skill)=>{
                        return <span 
                        key={skill.id} 
                        className={`bg-[#D6D6D6] text-[#1F2937]! p-2 rounded-full text-[12px] mx-1 ${skill.status ? "bg-sage": "bg-peach"}`}
                        >{skill.name}</span>
                    })}
                </div>
            </div>
    )
}