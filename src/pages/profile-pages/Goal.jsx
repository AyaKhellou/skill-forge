import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"
import Button from "../../components/Button"
import { ArrowLeft, Check, Pen, X } from "lucide-react";
import DetailedSkillCard from "../../components/DetailedSkillCard";
import ProjectCard from "../../components/ProjectCard";
import useGoal from "../../hooks/useGoal";
import useSkills from "../../hooks/useSkills";
import useProjects from "../../hooks/useProjects";
import {secondsToTime, emptyInput} from "../../services/function";
import ErrorMessage from "../../components/ErrorMessage";


export default function Goal(){
    const { goalId } = useParams();
    const { goalData, loadingGoal, error: goalError, updateGoalData } = useGoal(goalId);
    const { skills, loadingSkills, error: skillsError, addSkill } = useSkills(goalId);
    const { projects, loadingProjects, error: projectsError, addProject } = useProjects(goalId);
    
    //goal states
    const [editTitleMode, setEditTitleMode] = useState(false);
    const [goalTitle, setGoalTitle] = useState("");

    useEffect(() => {
        if(goalData){
            setGoalTitle(goalData.goalName)
        }
    }, [goalData]);
    // Skills states:
    const [newSkillName, setNewSkillName] = useState("")
    // Projects states:
    const [imagePath, setImagePath] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const totalSeconds = skills?.reduce((total, skill) => total + (skill.totalTimeStudied ?? 0) , 0);

    const completedSkills =
    skills?.filter(skill => skill.status).length ?? 0;

    const progress =
    skills?.length
        ? Math.round((completedSkills / skills.length) * 100)
        : 0;

        useEffect(()=>{
            async function updateProgress() {
                try{
                    await updateGoalData({
                        status: progress === 100 ? "completed" : "pending",
                        progress: progress
                    });
                }catch(err){
                    console.log(err);
                }
            }
            updateProgress();
        },[progress])

    async function editTitle(){
        console.log("editing...");

        try{
            await updateGoalData({
                goalName: goalTitle
            });
        }catch(err){
            console.log(err);
        }
        
        setEditTitleMode(false)
    }
        
    async function addNewSkill(){
        const skillName = newSkillName.trim();
        if(!skillName) {
            await emptyInput("Please enter a skill name.");
            return;
        }
        try{
            await addSkill(skillName);
            setNewSkillName("");
        } catch(err){
            console.log(err);
        }
    }


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePath(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    
    
    async function addNewProject(){
        const trimmedProjectName = projectName.trim();
        const trimmedProjectDesc = projectDesc.trim();
        if(!imagePath || !trimmedProjectName || !trimmedProjectDesc){
            await emptyInput("Please fill out all project fields.");
            return;
        }
        try{
            await addProject(imagePath, trimmedProjectName, trimmedProjectDesc);
            setImagePath(null)
            setImagePreview(null)
            setProjectName("")
            setProjectDesc("")
        } catch(err){
            console.log(err);
        }
    }
    
    return (
        <section className="page flex flex-col gap-3">
            <div 
            className="bg-card-background shadow rounded p-section">
                <Link to=".." relative="path" className="text-blue-500 flex items-center gap-2 my-3">
                    <ArrowLeft width={17}/>
                    <p>go back to goals</p>
                </Link>
                <div className="flex gap-3 ">
                    {
                        editTitleMode?
                        <input 
                        type="text" 
                        className="text-3xl font-bold text-text outline-none w-55"
                        value={goalTitle}
                        onChange={(e)=> setGoalTitle(e.target.value)}
                        />
                        :
                        <h2 className="mb-0!">
                            {loadingGoal? "Loading..." : goalError ? goalError.message : goalData?.goalName}
                        </h2>
                    }
                    {
                        editTitleMode ?
                        <div className="flex gap-2">
                            <button 
                            className="cursor-pointer" 
                            onClick={editTitle}
                            >
                                <Check width={17}/>
                            </button>
                            <button 
                            className="cursor-pointer" 
                            onClick={()=>setEditTitleMode(false)}
                            >
                                <X width={17}/>
                            </button>
                        </div>
                        :
                        <button 
                        className="cursor-pointer" 
                        onClick={()=>setEditTitleMode(true)}>
                            <Pen width={17} className="text-text"/>
                        </button>
                    }

                </div>
                <ProgressBar progress={progress}/>
                <div className="details flex justify-between items-center">
                    <span className="detail font-bold!">
                        <p>
                            {loadingSkills? "..." : skills?.filter(skill=>skill.status === true).length}/{skills?.length} skills . {progress} %
                        </p>
                        <p className="pt-2">{loadingProjects? "..." : projects?.length} projects</p>
                    </span>
                    <span className="detail study-hours">total study time {secondsToTime(totalSeconds)}</span>
                </div>
            </div>
            <div className="rounded flex flex-col bg-card-background shadow p-section">
                <h3 className="text-2xl font-bold mb-4 text-text">skills</h3>
                <form className="bg-background rounded my-2 p-3 shadow flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input 
                    type="text" 
                    name="skillName" 
                    placeholder="enter skill name" 
                    className="outline-none w-full sm:flex-1 md:flex-2"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    />
                    <Button 
                    onClick={addNewSkill}
                    classes="w-full sm:flex-1 ">
                        add new skill
                    </Button>
                </form>
                <div className="skills flex flex-col gap-3 justify-center items-center mt-3">
                    {
                        loadingSkills? <p>Loading skills...</p> 
                        : skillsError ? <ErrorMessage message={skillsError.message} /> 
                        : skills?.length === 0 || !skills ? null
                        : skills?.map(skill=>
                            <DetailedSkillCard 
                            key={skill.id}
                            skill={skill}
                            goalId={goalId}
                            />
                        ) 
                    }                   
                </div>
            </div>
            {/* project: */}
            <div className="rounded flex flex-col bg-card-background shadow p-section">
                <h3 className="text-2xl font-bold mb-4 text-text">Projects</h3>
                <div className="projects grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="project-form bg-background rounded my-2 p-3 shadow w-full">
                        <div className="image-box w-full aspect-square flex flex-col justify-center items-center">
                            <input 
                            type="file" 
                            id="image-upload" 
                            name="imageUpload" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            />
                            {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Project preview"
                                className="w-full h-full object-cover aspect-square"
                            />
                            ) : (
                                <label 
                                htmlFor="image-upload" 
                                className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg 
                                    flex items-center justify-center cursor-pointer 
                                    hover:border-pink-400 transition">
                                    <span 
                                    className="text-4xl text-gray-400">+</span>
                                </label>
                            )}
                            
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <input type="text" name="projectName" id="project-name" 
                            className="text-lg font-bold text-text outline-none"
                            placeholder="Enter Project Name"
                            value={projectName}
                            onChange={(e)=> setProjectName(e.target.value)} />

                            <input 
                            type="text" 
                            name="description" 
                            id="description" 
                            placeholder="Write a short desciption"
                            className="text-sm text-detail outline-none "
                            value={projectDesc}
                            onChange={(e)=> setProjectDesc(e.target.value)} />

                            <Button onClick={addNewProject} primary={false} classes="ml-auto p-1!">
                                <Check/>
                            </Button>
                        </div>
                    </div>
                    {
                        loadingProjects? <p>Loading projects...</p> 
                        : projectsError ? <ErrorMessage message={projectsError.message} /> 
                        : projects?.length === 0 || !projects ? null
                        : projects?.map(project =>{
                            return <ProjectCard 
                            key={project.id} 
                            project={project}
                            goalId={goalId}/>
                        })
                    }
                </div>
            </div>
        </section>
    )
}