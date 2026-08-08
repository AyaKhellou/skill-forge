import { Link } from "react-router-dom"
import { useState } from "react"
import ProgressBar from "./ProgressBar"


export default function DetailedSkillCard({ id, name, status}){

    const[notes,setNotes] = useState(null)
    const[projects,setProjects] = useState(null)
    const[studyTimer,setStudyTimer] = useState(null)
    const[sources,setSources] = useState(null)
    const[milestones,setMilestones] = useState(null)

    return(
        <div className="bg-background skill rounded my-2 p-3 shadow flex items-center gap-4 skill-card">
            <Link to={`skills/${id}`} className="w-full">
                <div className="flex items-center gap-4">
                    <h4 className="text-xl text-accent font-figtree m-0">
                        {name}
                    </h4>
                    <span 
                    className={`text-sm rounded-full p-1 ${status ? "bg-sage" : "bg-peach"}`}
                    >{status ? "completed" : "pending"}
                    </span>
                </div>
                    <ProgressBar progress={50}/>
                <div className="flex items-center gap-4 mt-3">
                    <div className="skill-details text-sm text-detail flex gap-4">
                        <span>{notes ? notes.length : 0} notes</span>
                        <span>{projects ? projects.length : 0} projects</span>
                        <span>studied {studyTimer ?? 0} hrs</span>
                        <span>{sources ? sources.length : 0} sources</span>
                        <span>{milestones ? milestones.length : 0} milestones</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}