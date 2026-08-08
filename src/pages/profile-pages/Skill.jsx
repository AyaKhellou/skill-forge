import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "../../authContext";
import ProgressBar from "../../components/ProgressBar";
import { doc,onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";


export default function Skill(){
    const { user } = useAuthContext();
    const[loading, setLoading] = useState(true)
    const[skillData, setSkillData] = useState(null)
    const { goal, skill } = useParams()


    const userId = user.uid;


    useEffect(()=>{
        async function fetchData() {
            onSnapshot(doc(db,"users", userId, "goals",goal,"skills",skill), (doc) => {
                setSkillData(doc.data())
            })
            setLoading(false)
        }
        fetchData();
    },[userId,goal,skill])
    
    if(loading){
        return (
            <section className="page">
                <Loader/>
            </section>
        )
    }

    if(!loading){
    return (
        <section className="page flex flex-col gap-3">
            <div 
            className="bg-card-background shadow rounded p-section">
                <Link to={`/user/goals/${goal}`} className="text-blue-500 flex items-center gap-2 my-3">
                    <ArrowLeft width={17}/>
                    <p>go back</p>
                </Link>
                <h2>{skillData?.name}</h2>
                <span 
                    className={`text-sm rounded-full p-1 ${skillData?.status ? "bg-sage" : "bg-peach"}`}
                >{skillData?.status ? "completed" : "pending"}
                </span>
                <ProgressBar/>
            </div>
            <div className="nav-bar bg-card-background shadow p-section flex justify-around">
                <NavLink to="" end className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Milestones</NavLink>
                <NavLink to="notes" className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Notes</NavLink>
                <NavLink to="resources" className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Resources</NavLink>
                {/* <NavLink to="projects" className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Projects</NavLink> */}
                {/* <NavLink to="study-sessions">Study Sessions</NavLink> */}
            </div>
            <Outlet context={ {goal, skill, userId} }/>
        </section>
    )
    }
}