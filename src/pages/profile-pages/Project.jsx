import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Pen, Plus } from "lucide-react";
import Button from "../../components/Button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc,onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useAuthContext } from "../../authContext";
import Loader from "../../components/Loader";
import { nanoid } from "nanoid";

export default function Project() {
    const [projectData, setProjectData] = useState(null)
    const { user } = useAuthContext()
    const { goal , project } = useParams()
    const [loading, setLoading] = useState(true)
    const [editTitleMode, setEditTitleMode] = useState(false)

    //input states
    const [description, setDescription] = useState("")
    const [reflectionTitle, setReflectionTitle] = useState("")
    const [reflectionContent, setReflectionContent] = useState("")
    const [lesson, setLesson] = useState("")
    const [skill, setSkill] = useState("")
    const [linkName, setLinkName] = useState("")
    const [linkUrl, setLinkUrl] = useState("")
    //edit states
    const [projectTitle, setProjectTitle] = useState("")

    const id = nanoid()
    const docRef = doc(db, "users", user.uid , "goals",goal,"projects",project)
    
    const currentDate = new Date();
    const dateNow = new Date();

    let date2;
    
    if(projectData?.latestUpdate){
        date2 = new Date(projectData?.latestUpdate);
    }else{
        date2 = new Date(projectData?.createdAt);
    }

    const daysDiff = Math.abs(dateNow - date2) / 1000;
    let updateTime;

    if (daysDiff < 60) {
        const seconds = Math.round(daysDiff);
        updateTime = `${seconds} second${seconds === 1 ? "" : "s"}`;
    } else if (daysDiff < 3600) {
        const minutes = Math.round(daysDiff / 60);
        updateTime = `${minutes} minute${minutes === 1 ? "" : "s"}`;
    } else if (daysDiff < 86400) {
        const hours = Math.round(daysDiff / (60 * 60));
        updateTime = `${hours} hour${hours === 1 ? "" : "s"}`;
    } else if (daysDiff < 604800) {
        const days = Math.round(daysDiff / (60 * 60 * 24));
        updateTime = `${days} day${days === 1 ? "" : "s"}`;
    } else if (daysDiff < 2_592_000) {
        const weeks = Math.round(daysDiff / (60 * 60 * 24 * 7));
        updateTime = `${weeks} week${weeks === 1 ? "" : "s"}`;
    } else if (daysDiff < 31_536_000) {
        const months = Math.round(daysDiff / (60 * 60 * 24 * 30));
        updateTime = `${months} month${months === 1 ? "" : "s"}`;
    } else {
        const years = Math.round(daysDiff / (60 * 60 * 24 * 365));
        updateTime = `${years} year${years === 1 ? "" : "s"}`;
    }
    
    useEffect(()=>{
        onSnapshot(docRef, (doc)=>{
            setProjectData(doc.data())
            setLoading(false)

        }),(error) => {
            console.error("Error fetching goal data: ", error);
        }
    },[user,project,goal])
    
    useEffect(()=>{
        if(projectData?.description !== undefined){
            setDescription(projectData.description)
        }else{
            setDescription("No description yet!")
        }
        if(projectData?.name !== undefined){
            setProjectTitle(projectData.name)
        }
    },[projectData])

    async function updateSkill(dataToUpdate){
    try{
        await updateDoc(docRef, dataToUpdate);
        await updateDoc(docRef, {latestUpdate:currentDate.toLocaleString()});
        
    }catch(err){
        console.log(err);
    }
    }
    
    function addNewReflection(){
        console.log("addNewReflection!");
        updateSkill({reflections: arrayUnion({
            id:id,
            title:reflectionTitle,
            content:reflectionContent
        })})
        setReflectionContent("")
        setReflectionTitle("")
    }

    function addNewLesson(){
        updateSkill({lessonsLearned: arrayUnion({
            id:id,
            content:lesson
        })})
        setLesson("")
    }
    
    function addNewSkill(){
        console.log("addNewSkill!");
        updateSkill({techStack: arrayUnion(skill)})
        setSkill("")
    }
    function addNewLink(){
        console.log("addNewLink!");
        updateSkill({links: arrayUnion({
            id:id,
            title:linkName,
            url:linkUrl
        })})
        setLinkName("")
        setLinkUrl("")
    }

    function saveDescription(){
        updateSkill({description:description})
    }

    function editTitle(){
        updateSkill({name:projectTitle})
        setEditTitleMode(false)
    }

    
    if(loading){
        return (
            <section className="page">
                <Loader/>
            </section>
        )
    }
    return (
        <section className="page flex flex-col gap-3">
            <div className="project-card">
                <div className="image-cont relative">
                    <img
                        src={projectData.imageUrl}
                        alt="project"
                        className="h-64 w-full rounded-xl object-cover mb-2"
                    />
                    <Button primary={false} classes="p-1! text-sm! absolute bottom-3 left-3">Change image</Button>
                </div>

                <Link to={`/user/goals/${goal}`}  
                className="text-blue-500 flex items-center gap-2 mb-4">
                    <ArrowLeft width={17} />
                    <p>go back to goals</p>
                </Link>

                <div className="flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {
                                projectData.techStack ?
                                projectData.techStack.map(skill=>{
                                    return <span className="tag bg-sage">{skill}</span>
                                }) :
                                null
                            }
                        </div>
                        <div className="flex gap-3 ">
                            {
                                editTitleMode?
                                <input 
                                type="text" 
                                className="text-3xl font-bold text-text outline-none w-55"
                                value={projectTitle}
                                onChange={(e)=> setProjectTitle(e.target.value)}
                                />
                                :
                                <h2 className="mb-0!">
                                    {projectData.name}
                                </h2>
                            }
                            {
                            editTitleMode?
                            <button 
                            className="cursor-pointer" 
                            onClick={editTitle}
                            >
                                <Check width={17}/>
                            </button>
                            :
                            <button 
                            className="cursor-pointer" 
                            onClick={()=>setEditTitleMode(true)}>
                                <Pen width={17}/>
                            </button>}
                        </div>

                    <div className="detail flex items-center justify-between text-sm">
                        <p>{projectData.briefDescription}</p>
                        <div className="details flex flex-col gap-2">
                            <span>Created at: {projectData.createdAt}</span>
                            <span>Last updated {updateTime} ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="project-grid">
                <div className="flex flex-col gap-4">
                    <div id="description" className="project-card flex flex-col gap-3">
                        <h3 className="text-2xl font-semibold">Description</h3>
                        <div className="mt-3 leading-7 text-detail">
                        
                        <textarea
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)}
                        className="w-full h-fit resize-none outline-none"/>
                        
                        </div>
                        {/* {
                            editMode ? */}
                            <Button 
                            classes="self-end"
                            disabled={projectData.description !== description ? false : true} 
                            onClick={saveDescription}>save desc</Button>
                        {/* } */}
                    </div>

                    <div id="reflections" className="project-card">
                        <h3 className="text-2xl font-semibold">Reflections</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            {
                                projectData.reflections ?
                                projectData.reflections.map(reflection=>{
                                    return (
                                        <div className="rounded-xl border border-accent bg-background p-4">
                                            <h4 className="font-semibold text-text">{reflection.title}</h4>
                                            <p className="mt-2 text-sm leading-6 text-detail">{reflection.content}</p>
                                        </div>
                                    )
                                })
                                :
                                null
                            }
                            
                            <div className="rounded-xl border border-accent bg-background p-4 flex flex-col">
                                <input 
                                className="font-semibold text-text w-full outline-none"
                                type="text" 
                                name="reflection-title" 
                                id="reflection-title"
                                placeholder="title"
                                value={reflectionTitle}
                                onChange={(e)=> setReflectionTitle(e.target.value)}
                                />
                                <textarea 
                                className="mt-2 text-sm leading-6 text-detail w-full outline-none resize-none h-fit"
                                type="text" 
                                name="reflection-content" 
                                id="reflection-content"
                                placeholder="write reflection..."
                                value={reflectionContent}
                                onChange={(e)=> setReflectionContent(e.target.value)}
                                />
                                <Button 
                                classes="p-0! ml-auto" 
                                primary={true} 
                                onClick={addNewReflection}
                                >
                                    <Check/>
                                </Button>
                            </div>

                        </div>
                    </div>

                    <div id="lessons" className="project-card">
                        <h3 className="text-2xl font-semibold">Lessons learned</h3>
                        <ul className="mt-3 space-y-2">
                            {
                                projectData.lessonsLearned ?
                                projectData.lessonsLearned.map(lessonLearned=>{
                                    return <li className="list-inside list-disc mb-2">{lessonLearned.content}</li>
                                }) :
                                "No lessons added yet!"
                            }
                            <div className="bg-background p-3 flex items-center justify-between">
                                <input 
                                type="text" 
                                className="outline-none" 
                                placeholder="new lesson..."
                                value={lesson}
                                onChange={(e)=> setLesson(e.target.value)}
                                />
                                <button 
                                type="button"
                                onClick={addNewLesson}
                                className="cursor-pointer">
                                    <Check/>
                                </button>
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    
                    <div className="project-card">
                        <h3 className="text-xl font-semibold">Tech stack</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {
                                projectData.techStack ?
                                projectData.techStack.map(skill=>{
                                    return <span className="tag bg-accent">{skill}</span>
                                }) :
                                null
                            }
                            <div className="tag bg-accent">
                                <input
                                className=" w-fit outline-none"
                                placeholder="add new skill.."
                                type="text" 
                                name="skill" 
                                value={skill}
                                onChange={(e)=>setSkill(e.target.value)}
                                />
                                <button 
                                className="cursor-pointer hover:opacity-50"
                                onClick={addNewSkill}>
                                    <Plus width={17}/>
                                </button>
                            </div>
                            
                        </div>
                    </div>

                    <div id="links" className="project-card">
                        <h3 className="text-xl font-semibold">Links</h3>
                        <div className="mt-3 flex flex-col gap-2">
                            {   projectData.links ?
                                projectData.links.map(link=>{
                                    return (
                                        <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border-color bg-background px-4 py-3 text-sm font-semibold transition duration-200 ease-linear hover:-translate-y-0.5 hover:border-accent ">
                                            <span>{link.title}</span>
                                            <span className="text-sm">
                                                <ArrowUpRight width={17} className="text-accent"/>
                                            </span>
                                        </a>
                                    )
                                }) :
                                null
                            }
                            
                            <div
                            className="flex items-center justify-between rounded-lg border border-border-color bg-background px-4 py-3 text-sm font-semibold transition duration-200 ease-linear hover:-translate-y-0.5 hover:border-accent ">
                                <div>
                                    <input 
                                    type="text" 
                                    name="link-name" 
                                    className="w-full outline-none p-1"
                                    placeholder="title" 
                                    value={linkName}
                                    onChange={(e)=>setLinkName(e.target.value)}
                                    />
                                    <input 
                                    type="text" 
                                    name="link-url"
                                    className="w-full outline-none p-1"
                                    placeholder="enter url"
                                    value={linkUrl}
                                    onChange={(e)=>setLinkUrl(e.target.value)}
                                    />
                                </div>
                                <Button 
                                primary={true}
                                onClick={addNewLink}>Add new link</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}