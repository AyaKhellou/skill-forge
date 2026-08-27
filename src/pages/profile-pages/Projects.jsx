import { useEffect, useState } from "react";
import { useAuthContext } from "../../authContext";
import { getUserGoal, getUserGoals } from "../../firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import ProjectCard from "../../components/ProjectCard";


export default function Projects(){
    const { user } = useAuthContext(); 
    const [goals,setGoals] = useState(null);
    const [projects, setProjects] = useState(null)

    
    
        useEffect(()=>{
            if(!user) return;
            if(user){
                getUserGoals(user.uid)
                .then(goals => setGoals(goals))
            }
        },[user])

        const projectsByGoal = {}

        useEffect(()=>{
            if(!goals) return;
            if(goals){
                goals.forEach(goal => {
                    const projectsRef = collection(db, "users", user.uid, "goals", goal.id, "projects");

                    onSnapshot(
                        projectsRef, (snapshot) => {
                        const data = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            goalId: goal.id,
                            ...doc.data(),
                        }));
                        
                        projectsByGoal[goal.id] = data;
                        setProjects(Object.values(projectsByGoal).flat())
                    },
                    (error) => {
                        console.error("Error fetching projects: ", error);
                    })
                });
            }
        },[user,goals])


    return(
        <section className="page flex flex-col gap-3">
            <div className="bg-card-background shadow rounded p-section">
                <h2>Projects goes here</h2>
                <div>
                    {
                        projects?.map(project =>{
                            return <ProjectCard 
                            key={project.id} 
                            project={project}
                            userId={user.uid}
                            goalId={project.goalId}/>
                        })
                    }
                </div>
            </div>
        </section>
    )
}