import { useEffect, useRef, useState } from "react";
import DropDown from "../../components/DropDown";
import { getUserGoals } from "../../firebase/firestore";
import { useAuthContext } from "../../authContext";
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { nanoid } from "nanoid";
import Button from '../../components/Button'
import { useSearchParams } from "react-router-dom";
import StudySessionCard from "../../components/StudySessionCard";

export default function StudySkills(){
    const [searchParams, setSearchParams] = useSearchParams()
    const skillId = searchParams.get("skillId")
    console.log(skillId);
    
    
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    const { user } = useAuthContext();
    const [goals,setGoals] = useState(null);
    const [skills, setSkills] = useState([])
    const [studySessions, setStudySessions] = useState(null)



    
    const [selectedOption, setSelectedOption] = useState()

    const id = nanoid();

    
    //input states:

    const [sessionTitle, setSessionTitle] = useState("")
    const [todaysGoal, setTodaysGoal] = useState("")
    
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
    

    
    useEffect(()=>{
        if(!user) return;
        if(user){
            getUserGoals(user.uid)
            .then(goals => setGoals(goals))
        }
    },[user])

    const skillsByGoal = {}

    useEffect(()=>{
        if(goals){
            goals.map(goal=>{
                onSnapshot(
                    collection(db, "users", user.uid, "goals", goal.id, "skills"), (snapshot) => {
                    const skillsList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        goalId:goal.id,
                        name:doc.data().name,
                        duration:doc.data().duration || "00:00:00"
                    }));
                    skillsByGoal[goal.id] = skillsList;
                    setSkills(Object.values(skillsByGoal).flat())
                },
                (error) => {
                    console.error("Error fetching skills: ", error);
                }
                );

            })
        }
    },[goals,user])

    //get study sessions
    const sessionsBySkill = {}
    useEffect(()=>{
        if(skills){
            skills.map(skill=>{
                onSnapshot(
                    collection(db, "users", user.uid, "goals", skill.goalId, "skills",skill.id ,"studySessions"), (snapshot) => {
                    const sessionsList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    sessionsBySkill[skill.id] = sessionsList;
                    setStudySessions(Object.values(sessionsBySkill).flat())
                },
                (error) => {
                    console.error("Error fetching skills: ", error);
                }
                );

            })
        }
    },[skills,user])

const [currentSkillSession, setCurrentSkillSession] = useState(null)
useEffect(()=>{
    if(!selectedOption) return;
        onSnapshot(
            collection(db, "users", user.uid, "goals", selectedOption.goalId, "skills",selectedOption.id ,"studySessions"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setCurrentSkillSession(data)
            },
            (error) => {
                console.error("Error fetching skills: ", error);
            }
        );

},[selectedOption,user])
    

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
        }, 10);
    }
    
    function pauseSession(){
        clearInterval(intervalRef.current);
    }

    function timeToSeconds(time) {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    } 
    const currentDate = new Date()
    function finishSession() {
        const docRef = doc(db,"users", user.uid, "goals",selectedOption.goalId,"skills",selectedOption.id, "studySessions", id)
        console.log(time);
        clearInterval(intervalRef.current);

        async function saveStudySession() {
            try{
                await setDoc(docRef, {
                    id:id,
                    name: sessionTitle,
                    duration: timeToSeconds(time),
                    focus: todaysGoal,
                    date:currentDate.toLocaleDateString()
                });
                console.log("study session created!!!!!!!");
            } catch(err){
                console.log(err);
            }

            async function updateSkill(){
                try{
                    await updateDoc(doc(db,"users", user.uid, "goals",selectedOption.goalId,"skills",selectedOption.id), {
                        LastStudied: currentDate.toLocaleDateString(),
                        studySessionsCount: currentSkillSession.length
                    });
                }catch(err){
                    console.log(err);
                }
            }
            updateSkill()
            async function updateProfile(){
                try{
                    await updateDoc(doc(db,"users", user.uid), {
                        recentStudySession:{
                            id:id,
                            name: sessionTitle,
                            duration: timeToSeconds(time),
                            focus: todaysGoal,
                            date:currentDate.toLocaleDateString()
                        }
                    });
                }catch(err){
                    console.log(err);
                }
            }
            updateProfile()
        }
        saveStudySession()
        setTodaysGoal("")
        setSessionTitle("")
        setSeconds(0)
        setMinutes(0)
        setHours(0)
    }

    
    return(
        <section className="page flex flex-col gap-3">
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <h2>Let's build something today</h2>
                <div className="info flex gap-3 w-full">
                    <div className="flex flex-col gap-2 w-1/3">
                        <label htmlFor="session-title" className="detail">Session title</label>
                        <input 
                        type="text" 
                        id="session-title" 
                        className="p-2 border-b border-accent bg-background outline-none"
                        value={sessionTitle}
                        onChange={(e)=> setSessionTitle(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                        <label className="detail" htmlFor="skill">Skill</label>
                        <DropDown 
                        className="w-full"
                        id="skill"
                        options={skills}
                        value={selectedOption?.name}
                        onChange={setSelectedOption} />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                        <label htmlFor="session-goal" className="detail">Today's goal</label>
                        <input 
                        type="text" 
                        id="session-title" 
                        className="p-2 border-b border-accent bg-background outline-none"
                        value={todaysGoal}
                        onChange={(e)=> setTodaysGoal(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <h2>{time}</h2>
                <div className="buttons flex gap-4">
                    <Button onClick={startTimer}>start</Button>
                    <Button onClick={pauseSession}>pause</Button>
                    <Button onClick={finishSession}>end</Button>
                </div>
            </div>
            <div className="bg-card-background shadow rounded p-section">
                <h3 className="">Recent study sessions</h3>
                <div className="flex flex-col gap-3">
                    {
                        studySessions?.map(session=>(
                            <StudySessionCard key={session.id} session={session}/>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}