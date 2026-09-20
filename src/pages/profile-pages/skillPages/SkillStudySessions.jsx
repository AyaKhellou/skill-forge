import { CalendarDays, Clock3, Play } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Loader from "../../../components/Loader";
import Stats from "../../../components/Stats";
import {secondsToTime} from "../../../services/function";
import StudySessionCard from "../../../components/StudySessionCard";


export default function SkillStudySessions() {
    const { skillId, goalId, userId, skillData } = useOutletContext();

    const [studySessions, setStudySessionsRef] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const totalSeconds = studySessions?.reduce((total, session) => total + session.duration, 0);
    
    useEffect(() => {
        const studySessionsRef = collection(db, "users", userId, "goals", goalId, "skills", skillId, "studySessions");
        onSnapshot(
            studySessionsRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        
            setStudySessionsRef(data);
            setLoading(false);
        },
        (error) => {
            console.error("Error fetching study sessions: ", error);
            setLoading(false);
        }
        );
    }, [userId, goalId, skillId]);

    useEffect(()=>{
        async function updateSkill(){
            try{
                await updateDoc(doc(db,"users", userId, "goals",goalId,"skills",skillId), {
                    totalTimeStudied:totalSeconds
                });
            }catch(err){
                console.log(err);
            }
        }
        updateSkill()
    },[userId, goalId, skillId, totalSeconds])
    

    if(loading){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col">
                <Loader/>
            </div>
        )
    }

    return (
        <div className="bg-card-background shadow rounded p-section flex flex-col gap-6">
            <div className="grid gap-3 sm:grid-cols-3">
                <Stats title="Sessions completed" value={studySessions?.length} className="bg-background!" />
                <Stats title="Time studied" value={secondsToTime(totalSeconds)} className="bg-background!" />
                <Stats title="Last studied" value={skillData?.LastStudied} className="bg-background!" />
            </div>
            <Button primary={true} classes="self-end">
                <Link to={`/user/study-sessions?skillId=${skillId}`} className="flex items-center gap-2 ">
                    <Play size={17} fill="currentColor" />
                    Start study session
                </Link>
            </Button>

            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">Recent activity</h3>

                {studySessions.map((session) => (
                    <StudySessionCard key={session.id} session={session}/>
                ))}
            </div>
        </div>
    );
}