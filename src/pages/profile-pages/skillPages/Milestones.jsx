import { useState, useEffect } from "react";
import Milestone from "../../../components/Milestone";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection,doc,onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

export default function Milestones(){
    const [updateMode, setUpdateMode] = useState(false)
    const [milestones, setMilestones] = useState(null)
    const [newMilstone, setNewMilestone] = useState("")
    const [loading, setLoading] = useState(true)
    
    const { skill, goal, userId } = useOutletContext();
    const now = new Date();
    const id = nanoid();

    useEffect(() => {
        const milestonesRef = collection(db, "users", userId, "goals", goal, "skills", skill, "milestones");
        onSnapshot(
            milestonesRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        
            setMilestones(data);
            setLoading(false);
        },
        (error) => {
            console.error("Error fetching milestones: ", error);
            setLoading(false);
        }
        );
    }, [userId, goal, skill]);

    function addMilestone(){
        setUpdateMode(true)
    }

    function saveMilestone(){
        async function createMilestone() {
            const docRef = doc(db, "users", userId, "goals",goal,"skills",skill,"milestones",id);
            try{
                await setDoc(docRef, {
                    id:id,
                    name: newMilstone,
                    status:false,
                    startedAt: now.toLocaleDateString() 
                });
                console.log("milestone created!!!!!!!");
            } catch(err){
                console.log(err);
            }
        }
        createMilestone()
        setUpdateMode(false)
        setNewMilestone("")
    }
    console.log(milestones);
    

    return(
        <div className="bg-card-background shadow rounded p-section flex flex-col">
            <div className="milestones shadow mb-4">
                {milestones.length !== 0 ?
                milestones.map((milestone)=>{
                    return <Milestone 
                    key={milestone.id}
                    checkVal={milestone.status}
                    milestoneVal={milestone.name}
                    userId={userId}
                    goalId={goal}
                    skillId={skill}
                    milestoneId={milestone.id}
                    />
                })
                :
                <p>new milestones!</p>
                }
            </div>
            {updateMode &&
                <input 
                className="bg-background border-b border-accent flex items-center gap-3 p-5"
                onChange={(e)=> setNewMilestone(e.target.value)}
                value={newMilstone}
                />
            }
            {updateMode ?
                <Button 
                classes="self-end"
                onClick={saveMilestone}>save milestone</Button>
                :
                <Button 
                classes="self-end"
                onClick={addMilestone}>add milestone</Button>
            }
        </div>
    )
}