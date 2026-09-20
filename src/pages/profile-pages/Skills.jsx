import { useEffect, useState } from "react";
import { useAuthContext } from "../../AuthContext";
import { getUserGoals } from "../../firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import DetailedSkillCard from "../../components/DetailedSkillCard";


export default function Skills(){
    const { user } = useAuthContext(); 
        const [goals,setGoals] = useState(null);
        const [skills, setSkills] = useState(null)
    
        
        
            useEffect(()=>{
                if(!user) return;
                if(user){
                    getUserGoals(user.uid)
                    .then(goals => setGoals(goals))
                }
            },[user])
    
            const skillsByGoal = {}
    
            useEffect(()=>{
                if(!goals) return;
                if(goals){
                    goals.forEach(goal => {
                        const skillsRef = collection(db, "users", user.uid, "goals", goal.id, "skills");
                        onSnapshot(
                            skillsRef, (snapshot) => {
                            const data = snapshot.docs.map((doc) => ({
                                id: doc.id,
                                goalId:goal.id,
                                ...doc.data(),
                            }));
                            skillsByGoal[goal.id] = data;
                            setSkills(Object.values(skillsByGoal).flat())
                        },
                        (error) => {
                            console.error("Error fetching skills: ", error);
                        }
                        )
                    });
                }
            },[user,goals])

            console.log(skills);
            
    
    
    return(
        <section className="page">
            <h2>Skills goes here</h2>
            <div className="skills">
                {skills?.map(skill=>
                    <DetailedSkillCard 
                    key={skill.id}
                    id={skill.id}
                    name={skill.name}
                    status={skill.status}
                    progress={skill.progress}
                    skill={skill}
                    userId={user.uid}
                    goalId={skill.goalId}
                    />
                )}
            </div>
        </section>
    )
}