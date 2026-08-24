import { ArrowRight, CalendarDays, Clock3, Play } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Loader from "../../../components/Loader";


export default function SkillStudySessions() {
    const { skill, goal, userId, skillData } = useOutletContext();

    console.log(skill);
    
    const [studySessions, setStudySessionsRef] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const totalSeconds = studySessions?.reduce((total, session) => total + session.duration, 0);
    
    
    function secondsToTime(seconds){
        
    
        const totalMinutes = Math.floor(seconds / 60);
        
        const totalHours = Math.floor(totalMinutes / 60);
    
        const remainingSeconds = seconds % 60;

        const remainingMinutes = totalMinutes % 60;

        
        return`${totalHours <= 9 ? "0"+totalHours : totalHours}:${remainingMinutes <= 9 ? "0"+remainingMinutes : remainingMinutes}:${remainingSeconds <= 9 ? "0"+remainingSeconds : remainingSeconds}`;
    }
    // console.log(`${totalHours}:${totalMinutes}:${remainingSeconds}`);

    

    useEffect(() => {
        const studySessionsRef = collection(db, "users", userId, "goals", goal, "skills", skill, "studySessions");
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
    }, [userId, goal, skill]);

    useEffect(()=>{
        async function updateSkill(){
            try{
                await updateDoc(doc(db,"users", userId, "goals",goal,"skills",skill), {
                    totalTimeStudied:totalSeconds
                });
            }catch(err){
                console.log(err);
            }
        }
        updateSkill()
    },[userId, goal, skill, totalSeconds])
    

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
                <div className="rounded bg-background p-4">
                    <p className="detail">Sessions completed</p>
                    <p className="mt-1 text-2xl font-semibold text-text">{studySessions?.length}</p>
                </div>
                <div className="rounded bg-background p-4">
                    <p className="detail">Time studied</p>
                    <p className="mt-1 text-2xl font-semibold text-text">{secondsToTime(totalSeconds)}</p>
                </div>
                <div className="rounded bg-background p-4">
                    <p className="detail">Last studied</p>
                    <p className="mt-1 text-2xl font-semibold text-text">{skillData?.LastStudied}</p>
                </div>
            </div>
            <Button primary={true} classes="self-end">
                <Link to={`/user/studysessions?skillId=${skill}`} className="flex items-center gap-2 ">
                    <Play size={17} fill="currentColor" />
                    Start study session
                </Link>
            </Button>

            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">Recent activity</h3>

                {studySessions.map((session) => (
                    <article key={session.id} className="flex flex-col gap-3 rounded bg-background p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3>{session.focus}</h3>
                            <p className="detail mt-1">{session.note}</p>
                        </div>
                        <div className="flex shrink-0 gap-4 text-sm font-semibold text-detail sm:flex-col sm:items-end sm:gap-1">
                            <span className="inline-flex items-center gap-1"><CalendarDays size={15} /> {session.date}</span>
                            <span className="inline-flex items-center gap-1"><Clock3 size={15} /> {secondsToTime(session.duration)}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}