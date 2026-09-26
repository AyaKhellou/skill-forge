import { Play } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import Button from "../../../components/Button";
import { useEffect } from "react";
import useStudySessions from "../../../hooks/useStudySessions";
import useSkill from "../../../hooks/useSkill";
import Loader from "../../../components/Loader";
import Stats from "../../../components/Stats";
import {secondsToTime} from "../../../services/function";
import StudySessionCard from "../../../components/StudySessionCard";


export default function SkillStudySessions() {

    const { skillId, goalId, lastStudied } = useOutletContext();
    const { studySessions, loadingStudySessions, error } = useStudySessions(goalId, skillId);
    const { updateSkillData } = useSkill(goalId,skillId);
    const totalSeconds = studySessions?.reduce((total, session) => total + session.duration, 0);

    useEffect(()=>{
        async function updateSkill(){
            try{
                await updateSkillData({totalTimeStudied: totalSeconds});
            }catch(err){
                console.log(err);
            }
        }
        updateSkill()
    },[totalSeconds])
    

    if(loadingStudySessions){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <Loader/>
            </div>
        )
    }

    return (
        <div className="bg-card-background shadow rounded p-section flex flex-col gap-6">
            <div className="grid gap-3 sm:grid-cols-3">
                <Stats title="Sessions completed" value={studySessions?.length} className="bg-background!" />
                <Stats title="Time studied" value={secondsToTime(totalSeconds)} className="bg-background!" />
                <Stats title="Last studied" value={lastStudied} className="bg-background!" />
            </div>
            <Button primary={true} classes="self-end">
                <Link to={`/user/study-sessions?skillId=${skillId}`} className="flex items-center gap-2 ">
                    <Play size={17} fill="currentColor" />
                    Start study session
                </Link>
            </Button>

            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">Recent activity</h3>
                {error ?
                    <p>Error loading study sessions.</p>
                :
                studySessions.length === 0 ? (
                    <p>No recent activity.</p>
                ) : (
                    studySessions.map((session) => (
                        <StudySessionCard key={session.id} session={session}/>
                    ))
                )}
            </div>
        </div>
    );
}