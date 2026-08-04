import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../../authContext"
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"
import Loader from "../../components/Loader";
import Button from "../../components/Button"
import { ArrowLeft } from "lucide-react";
import Note from "../../components/Note";
import DetailedSkillCard from "../../components/DetailedSkillCard";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function Goal(){
    const { goal } = useParams();
    const { user } = useAuthContext();
    const[goalData,setGoalData] = useState(null)
    const [skills, setSkills] = useState(null)

    console.log(user.uid);
    console.log(goal);
    
    
    const progress  =
        skills?.length === 0 ?
        0:
        Math.round((100 * skills?.filter(skill=> skill.status === true).length) / skills?.length)

    
    useEffect(()=>{
        if(!user || !goal) return;
        async function fetchData() {
            //get goal info
            async function getUserGoal() {
                const docRef = doc(db,"users", user.uid, "goals",goal);
                const docSnap = await getDoc(docRef);
            
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setGoalData(data)
                } else {
                    console.log("No such document!");
                }
            }
            getUserGoal()
            //get skills for the goal
            async function getUserskills() {
                try{
                const querySnapshot = await getDocs(collection(db,"users", user?.uid, "goals",goal,"skills"));
            
                const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
                }));
                setSkills(data)
                }catch(err){
                    console.log(err);
                }
            }
            getUserskills()
        }
        fetchData();
    },[user,goal])

    console.log(skills);
    console.log(goalData);
    
    const loading = !goalData || !skills;


    if(loading){
        return (
            <section className="page">
                <Loader/>
            </section>
        )
    }
    return (
        <section className="page flex flex-col gap-3">
            <div 
            className="bg-card-background shadow rounded p-section">
                <Link to=".." relative="path" className="text-blue-500 flex items-center gap-2 my-3">
                    <ArrowLeft width={17}/>
                    <p>go back to goals</p>
                </Link>
                <h2>{goalData?.goalName}</h2>
                <ProgressBar progress={progress}/>
                <div className="details flex justify-between">
                    <span className="detail font-bold!">
                        {skills?.filter(skill=>skill.status === true).length}/{skills?.length} skills . {progress} %
                    </span>
                    <span className="detail study-hours">
                        total study time
                        10 hours
                    </span>
                </div>
            </div>
            <div className="rounded flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-text">skills</h3>
                <div className="skills">
                    {skills?.map(skill=>
                        <DetailedSkillCard 
                        key={skill.id}
                        id={skill.id}
                        name={skill.name}
                        status={skill.status}/>
                    )}
                </div>
                <Button classes="self-end mt-4">
                    add new skill
                </Button>
            </div>
            {/* <div className="bg-card-background shadow rounded p-section flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-text">Notes</h3>
                <div className="notes">
                    <Note userId={user?.uid} goalId={goal} skillId={skill.id} noteId={note.id} title={note.title} timeCreated={note.timeCreated} content={note.content} />
                </div>
                <Button classes="self-end">
                    add note
                </Button>
            </div> */}
        </section>
    )
}