import { ArrowRight, Play} from "lucide-react";
import Loader from "../../components/Loader";
import { useAuthContext } from "../../AuthContext";
import useSummary from "../../hooks/useSummary";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Stats from "../../components/Stats";
import ProgressBar from "../../components/ProgressBar";
import StudySessionCard from "../../components/StudySessionCard";
import {secondsToTime} from "../../services/function";
import useGoals from "../../hooks/useGoals";
import useAllSkills from "../../hooks/useAllSkills";

export default function Dashboard() {
  const dateNow = new Date();
  const currentHour = dateNow.getHours();
  const { user } = useAuthContext();
  const displayName = user?.displayName?.split(" ")[0] || "there";
  const navigate = useNavigate()

  const {  goals, loadingGoals, error: goalsError } = useGoals();
  const { allSkills: skills, loadingAllSkills, error: skillsError } = useAllSkills();

  const activeGoals =  goals?.filter(goal=> goal.status === "pending")

  const { recentStudySession, loadingRecentStudySession, recentStudyError } = useSummary();

  const TotalStudySessionsTime = skills?.filter(skill=> skill.totalTimeStudied)
  .map(skill=>skill.totalTimeStudied)
  .reduce((total,time) => total + time,0)

  const totalStudySessions = skills?.filter(skill=> skill.studySessionsCount)
  .map(skill=> skill.studySessionsCount)
  .reduce((total,count)=> total + count,0)

  const sortedSkills = skills?.filter(skill=> skill.LastStudied).sort((a,b)=> new Date(b.LastStudied) - new Date(a.LastStudied))

  function greeting() {
    if (currentHour > 5 && currentHour < 13) {
      return `Good morning, ${displayName}`;
    } else if (currentHour >= 13 && currentHour < 16) {
      return `Good afternoon, ${displayName}`;
    } else {
      return `Good evening, ${displayName}`;
    }
  }

  if(loadingGoals || loadingAllSkills || loadingRecentStudySession) {
    return(
      <div className="page flex flex-col gap-3 items-center">
        <Loader/>
      </div>
    )
  }
  if(recentStudyError || goalsError || skillsError) {
    return(
      <div className="page flex flex-col gap-3 items-center">
        <p>Error loading data.</p>
      </div>
    )
  }
  return (
    <section className="page flex flex-col gap-3">
      <div className="bg-card-background shadow rounded p-4 flex flex-col items-start justify-between">
        <div>
          <p className="detail">{dateNow.toDateString()}</p>
          <h3>{greeting()}</h3>
          <p>Ready to keep building?</p>
        </div>
          <Button primary={true} classes="flex items-center gap-1 mt-3 self-end" 
          onClick={()=>navigate('/user/study-sessions')}>
            <Play className="text-inherit!"/>
            Start a study session
          </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Stats title="Active goals" value={activeGoals?.length}/>
        <Stats title="Study time" value={secondsToTime(TotalStudySessionsTime)}/>
        <Stats title="Study sessions" value={totalStudySessions}/>
      </div>
      <div className="flex gap-3 flex-wrap">
        {
          sortedSkills &&
          sortedSkills.slice(0,2).map(skill=>(
            <div key={skill.id} className="bg-card-background shadow rounded p-4 flex-1 min-w-72">
              <h4>{skill.name}</h4>
              <p className="detail">Goal: {goals?.find(goal => goal.id === skill.goalId)?.goalName}</p>
              <ProgressBar progress={skill.progress}/>
              <Button onClick={()=> navigate(`/user/goals/${skill.goalId}/skills/${skill.id}`)} classes="ml-auto w-full">
                Continue Forging 
                {`>>`}
              </Button>
            </div>
          ))
        }
      </div>
      {/* <div className=""> */}
        <div className="flex items-center justify-between">
          <h4>Your goals:</h4>
          <Link to="/user/goals" className="flex items-center gap-1">
            <p>see all</p>
            <ArrowRight width={17}/>
          </Link>
        </div>
        <div className="flex gap-3 flex-wrap">
          {activeGoals?.slice(0,3).map(goal=>{
              return (
                <div key={goal.id} className="bg-card-background flex-1 min-w-55 shadow rounded p-4">
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