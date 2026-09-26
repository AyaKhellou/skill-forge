import { useEffect, useRef, useState } from "react";
import useProfileInfo from "../../hooks/useProfileInfo";
import DropDown from "../../components/DropDown";
import { nanoid } from "nanoid";
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { useSearchParams } from "react-router-dom";
import StudySessionCard from "../../components/StudySessionCard";
import useSkill from "../../hooks/useSkill";
import useAllSkills from "../../hooks/useAllSkills";
import useStudySessions from "../../hooks/useStudySessions";
import { emptyInput } from "../../services/function";

export default function StudySkills(){
    const [searchParams, setSearchParams] = useSearchParams()
    const skillId = searchParams.get("skillId")

    const [timerOn, setTimerOn] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    
    const { allSkills: skills, loadingAllSkills: loadingSkills, error: skillsError } = useAllSkills();


    const [selectedOption, setSelectedOption] = useState()

    //input states:

    const [sessionTitle, setSessionTitle] = useState("")
    const [todaysGoal, setTodaysGoal] = useState("")
    
    // find current selected skill based on skillId query parameter
    useEffect(()=>{
        if(skillId){
            if (!skills?.length) return;

            const skill = skills.find(skill=> skillId === skill.id)

            if(skill){
                setSelectedOption(skill);
            }
            
            setSearchParams(prev=>{
                prev.delete("skillId");
                return prev;
            })

        }else{
            setSelectedOption(skills[0])
        }
    },[skills])
    

    const { studySessions , loadingStudySessions, error: studySessionsError, createNewStudySession } = useStudySessions(selectedOption?.goalId, selectedOption?.id);
    const { updateSkillData } = useSkill(selectedOption?.goalId, selectedOption?.id);
    const { updateUserDetails } = useProfileInfo();



    useEffect(()=>{
        if(seconds > 59){
            setMinutes(prev=> prev + 1)
            setSeconds(0)
        }
        if(minutes > 59){
            setHours(prev=> prev + 1)
            setMinutes(0)
        }
    },[seconds,minutes])

    const time = `${hours <= 9 ? "0" + hours : hours}:${minutes <= 9 ? "0" + minutes : minutes}:${seconds <= 9 ? "0" + seconds : seconds}`
    

    const intervalRef = useRef(null);

    function startTimer() {
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
        setTimerOn(true);
    }
    
    function pauseSession(){
        clearInterval(intervalRef.current);
    }

    function timeToSeconds(time) {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    } 


    async function finishSession() {
        if(!sessionTitle.trim() || !todaysGoal.trim()) {
            await emptyInput("Please fill in all required fields")
            return;
        }
        const id = nanoid();
        const currentDate = new Date()
        clearInterval(intervalRef.current);
        setTimerOn(false);

        async function saveStudySession() {
            try{
                await createNewStudySession(sessionTitle, timeToSeconds(time), todaysGoal)
                await updateSkillData({
                    LastStudied: currentDate.toLocaleDateString(),
                    studySessionsCount: studySessions.length + 1
                })
                await updateUserDetails({
                    recentStudySession: {
                        id: id,
                        name: sessionTitle,
                        duration: timeToSeconds(time),
                        focus: todaysGoal,
                        date: currentDate.toLocaleDateString()
                    }
                })
            } catch(err){
                console.log(err);
            }
        }
        await saveStudySession()
        setTodaysGoal("")
        setSessionTitle("")
        setSeconds(0)
        setMinutes(0)
        setHours(0)
    }

    if (loadingSkills) {
    return (
        <div className="page flex flex-col gap-3 items-center">
            <Loader />
        </div>
    );
    }
    if (!skills.length) {
        return (
            <div className="page flex flex-col gap-3 items-center">
                <p>No skills available yet.</p>
            </div>
        );
    }
    if (!selectedOption) {
        return null;
    }
    if (skillsError) {
        return (
            <div className="page">
                <p>{skillsError.message}</p>
            </div>
        );
    }
    return(
        <section className="page flex flex-col gap-3">
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <h2>Let's build something today</h2>
                <div className="info flex flex-wrap gap-3 w-full">
                    <div className="flex flex-col gap-2 flex-1 min-w-38">
                        <label htmlFor="session-title" className="detail">Session title</label>
                        <input 
                        type="text" 
                        id="session-title" 
                        className="p-2 border-b border-accent bg-background outline-none"
                        placeholder="Enter session title"
                        value={sessionTitle}
                        onChange={(e)=> setSessionTitle(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-38">
                        <label className="detail" htmlFor="skill">Skill</label>
                        <DropDown
                        id="skill"
                        options={skills}
                        value={selectedOption?.name}
                        onChange={setSelectedOption} />
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-38">
                        <label htmlFor="session-goal" className="detail">Today's goal</label>
                        <input 
                        type="text" 
                        id="session-goal" 
                        className="p-2 border-b border-accent bg-background outline-none"
                        placeholder="Enter today's goal"
                        value={todaysGoal}
                        onChange={(e)=> setTodaysGoal(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <h2>{time}</h2>
                <div className="buttons flex gap-4">
                    <Button disabled={timerOn} onClick={startTimer}>start</Button>
                    <Button disabled={!timerOn} onClick={pauseSession}>pause</Button>
                    <Button disabled={!timerOn} onClick={finishSession}>end</Button>
                </div>
            </div>
            <div className="bg-card-background shadow rounded p-section">
                <h3 className="">Recent study sessions</h3>
                <div className="flex flex-col gap-3">
                    {
                        studySessionsError ?
                        <p className="text-red-500">{studySessionsError.message}</p> :
                        loadingStudySessions ?
                        <p>Loading...</p> :
                        studySessions?.map(session=>(
                            <StudySessionCard key={session.id} session={session}/>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}