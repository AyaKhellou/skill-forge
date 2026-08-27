import { ArrowRight, Play} from "lucide-react";
import { useAuthContext } from "../../authContext";
import Button from "../../components/Button";
import { createUserData, getUserGoals } from "../../firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Stats from "../../components/Stats";
import ProgressBar from "../../components/ProgressBar";
import StudySessionCard from "../../components/StudySessionCard";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import secondsToTime from "../../firebase/function";


  const stats = [
    { label: "Current streak", value: "7 days", detail: "You are on a roll" },
    { label: "Hours studied", value: "12.4h", detail: "This week" },
    { label: "Completed lessons", value: "18", detail: "Across your paths" },
  ];

  const focusAreas = [
    { title: "React fundamentals", progress: "82%" },
    { title: "UI design systems", progress: "64%" },
    { title: "JavaScript practice", progress: "91%" },
  ];
  const session = {
    id:"IdGfnSBpmYo70jRQxPkq4",
    focus:"sdfa",
    note:"nno",
    duration:831,
    date:"8/24/2026"
  }
  


export default function Dashboard() {
  const dateNow = new Date();
  const currentHour = dateNow.getHours();
  const { user } = useAuthContext();
  const displayName = user?.displayName?.split(" ")[0] || "there";
  const navigate = useNavigate()
  const [goals,setGoals] = useState(null);
  const [skills,setSkills] = useState(null)
  
  
      useEffect(()=>{
          if(!user) return;
          if(user){
              getUserGoals(user.uid)
              .then(goals => setGoals(goals))
          }
      },[user])

      const activeGoals =  goals?.filter(goal=> goal.status === "pending")

      const skillsByGoal = {}
      
          useEffect(()=>{
              if(goals){
                  goals.map(goal=>{
                      onSnapshot(
                          collection(db, "users", user.uid, "goals", goal.id, "skills"), (snapshot) => {
                          const skillsList = snapshot.docs.map((doc) => ({
                              id: doc.id,
                              totalTimeStudied:doc.data().totalTimeStudied,
                              studySessionsCount:doc.data().studySessionsCount
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

          const [recentStudySession, setRecentStudySession] = useState(null)
          useEffect(()=>{
            async function fetchData() {
              onSnapshot(doc(db,"users", user.uid), (doc) => {
                  setRecentStudySession(doc.data().recentStudySession)
              })
              }
            fetchData();
          },[goals,user])
          console.log(recentStudySession);
        
          

          const TotalStudySessionsTime = skills?.filter(skill=> skill.totalTimeStudied)
          .map(skill=>skill.totalTimeStudied)
          .reduce((total,time) => total + time,0)

          const totalStudySessions = skills?.filter(skill=> skill.studySessionsCount)
          .map(skill=> skill.studySessionsCount)
          .reduce((total,count)=> total + count,0)

          
          
      


  function greeting() {
    if (currentHour > 5 && currentHour < 13) {
      return `Good morning, ${displayName}`;
    } else if (currentHour >= 13 && currentHour < 16) {
      return `Good afternoon, ${displayName}`;
    } else {
      return `Good evening, ${displayName}`;
    }
  }

  return (
    <section className="page flex flex-col gap-3">
      <div className="bg-card-background shadow rounded p-4 flex items-end justify-between">
        <div>
          <p className="detail">{dateNow.toDateString()}</p>
          <h3>{greeting()}</h3>
          <p>Ready to keep building?</p>
        </div>
          <Button primary={true} classes="flex items-center gap-1" onClick={()=>navigate('/user/studysessions')}>
            <Play className="text-inherit!"/>
            Start a study session
          </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stats title="Active goals" value={activeGoals?.length}/>
        <Stats title="Study time" value={secondsToTime(TotalStudySessionsTime)}/>
        <Stats title="Study sessions" value={totalStudySessions}/>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card-background shadow rounded p-4">
          <h4>typeScript</h4>
          <p className="detail">Goal: become a front-end dev</p>
          <ProgressBar progress={40}/>
          <Button classes="ml-auto w-full">
            Continue Forging 
            {`>>`}
          </Button>
        </div>
        <div className="bg-card-background shadow rounded p-4">
          <h4>Korean vocabulary</h4>
          <p className="detail">Goal: learn korean</p>
          <ProgressBar progress={18}/>
          <Button classes="ml-auto w-full">
            Continue Forging 
            {`>>`}
          </Button>
        </div>
      </div>
      {/* <div className=""> */}
        <div className="flex items-center justify-between">
          <h4>Your goals:</h4>
          <Link to="/user/goals" className="flex items-center gap-1">
            <p>see all</p>
            <ArrowRight width={17}/>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {
            activeGoals?.length <= 3 ?
            activeGoals?.map(goal=>{
              return (
                <div className="bg-card-background shadow rounded p-4">
                  <p>{goal?.goalName}</p>
                  <ProgressBar progress={goal?.progress}/>
                </div>
              )
            })
            :
            activeGoals?.slice(0,3).map(goal=>{
              return (
                <div className="bg-card-background shadow rounded p-4">
                  <p>{goal?.goalName}</p>
                  <ProgressBar progress={goal?.progress}/>
                </div>
              )
            })
          }
        </div>
        <div className="flex flex-col w-full">
          <h4>Recent study sessions:</h4>
          <div className="bg-card-background shadow rounded p-4">
            { recentStudySession &&
                <StudySessionCard session={recentStudySession}/>
            }
          </div>
        </div>
    </section>
  );
}