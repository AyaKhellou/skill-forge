import { Trash } from "lucide-react"
import { Link } from "react-router-dom"
import useProject from "../hooks/useProject";
import { deleteWarning } from "../services/function"
export default function ProjectCard ({ project, goalId }) {

    const { deleteProjectData } = useProject(goalId, project.id);

    async function deleteProject(){
        const result = await deleteWarning("project");
        if (!result) return;

        try{
            await deleteProjectData();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className="project bg-background rounded my-2 p-3 shadow w-full">
            <div className="image-box">
                <img 
                className="w-full object-cover aspect-square" 
                src={project.imageUrl} />
            </div>
            <div className="flex flex-col gap-2 mt-2">
                <Link to={`/user/goals/${goalId}/projects/${project.id}`} className="text-blue-500 font-bold text-lg">
                    <h4 className="text-lg font-bold text-text">{project.name}</h4>
                </Link>
                <span className="text-sm text-detail">{project.briefDescription}</span>
                <button className="self-end cursor-pointer" onClick={deleteProject}>
                    <Trash width={17} height={17}/>
                </button>
            </div>
        </div>
    )
}