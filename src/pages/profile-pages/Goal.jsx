import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../../authContext"
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"
import Loader from "../../components/Loader";
import Button from "../../components/Button"
import { ArrowLeft, Check, Plus } from "lucide-react";
import DetailedSkillCard from "../../components/DetailedSkillCard";
import { collection, doc,onSnapshot,setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { nanoid } from "nanoid";
import ProjectCard from "../../components/ProjectCard";

export default function Goal(){
    const { goal } = useParams();
    const { user } = useAuthContext();
    const[goalData,setGoalData] = useState(null)
    const [skills, setSkills] = useState(null)
    const [newSkillName, setNewSkillName] = useState("")
    const id = nanoid();
    // Projects states:
    const [projects, setProjects] = useState(null)
    const [imagePath, setImagePath] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const currentDate = new Date();
    

    const progress  =
        skills?.length === 0 ?
        0:
        Math.round((100 * skills?.filter(skill=> skill.status === true).length) / skills?.length)

    useEffect(() => {
            
        const docRef = doc(db,"users", user.uid, "goals",goal);
        onSnapshot(docRef, (doc)=>{
            setGoalData(doc.data())
        }),(error) => {
            console.error("Error fetching goal data: ", error);
        }
        

        const skillsRef = collection(db, "users", user.uid, "goals", goal, "skills");
        onSnapshot(
            skillsRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSkills(data);
        },
        (error) => {
            console.error("Error fetching skills: ", error);
        }
        );

        const projectsRef = collection(db, "users", user.uid, "goals", goal, "projects");
        onSnapshot(
            projectsRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProjects(data);
        },
        (error) => {
            console.error("Error fetching projects: ", error);
        }
        );



        }, [user, goal]);


    const loading = !goalData || !skills || !projects;

    function addSkill(){
        if(!newSkillName) return;
        const newSkill = {
            id:id,
            name: newSkillName,
            status: false,
            createdAt:currentDate.toLocaleDateString()
        }
        async function createSkill() {
            const docRef = doc(db, "users", user.uid, "goals",goal,"skills",id);
            try{
                await setDoc(docRef, newSkill);
                console.log("skill created!!!!!!!");
                
            } catch(err){
                console.log(err);
                
            }
        }
        createSkill()
        setNewSkillName("")
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            setImagePath(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    
    async function uploadImage(file){

        const formData = new FormData();
        
        formData.append("file", file);
        formData.append(
            "upload_preset",
            "skillforge_images"
        );
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/mi3zklxx/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );
        
        if (!response.ok) {
            throw new Error("Image upload failed");
        }
        
        const data = await response.json();
        
        return data.secure_url;
    };
    //----------------------------------------------------------------------


    function addNewProject(){
        if(!imagePath || !projectName || !projectDesc) return;

        async function createProject() {
            const docRef = doc(db, "users", user.uid, "goals",goal,"projects",id);
            try{
                const imageUrl =  await uploadImage(imagePath)
                const newProject = {
                    id:id,
                    imageUrl:imageUrl,
                    name: projectName,
                    briefDescription:projectDesc,
                    createdAt:currentDate.toLocaleDateString(),
                }

                await setDoc(docRef, newProject);
                console.log("project created!!!!!!!");
                
            } catch(err){
                console.log(err);
            }
        }
        createProject()
        setImagePath(null)
        setImagePreview(null)
        setProjectName("")
        setProjectDesc("")
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
            <div 
            className="bg-card-background shadow rounded p-section">
                <Link to=".." relative="path" className="text-blue-500 flex items-center gap-2 my-3">
                    <ArrowLeft width={17}/>
                    <p>go back to goals</p>
                </Link>
                <h2>{goalData?.goalName}</h2>
                <ProgressBar progress={progress}/>
                <div className="details flex justify-between items-center">
                    <span className="detail font-bold!">
                        <p>{skills?.filter(skill=>skill.status === true).length}/{skills?.length} skills . {progress} %</p>
                        <p className="pt-2">{projects?.length} projects</p>
                    </span>
                    <span className="detail study-hours">
                        total study time
                        10 hours
                    </span>
                </div>
            </div>
            <div className="rounded flex flex-col bg-card-background shadow p-section">
                <h3 className="text-2xl font-bold mb-4 text-text">skills</h3>
                <div className="skills">
                    {skills?.map(skill=>
                        <DetailedSkillCard 
                        key={skill.id}
                        id={skill.id}
                        name={skill.name}
                        status={skill.status}
                        progress={skill.progress}
                        skill={skill}
                        userId={user.uid}
                        goalId={goal}
                        />
                    )}
                </div>
                <div className="bg-background rounded my-2 p-3 shadow flex items-center justify-between gap-4">
                    <input 
                    type="text" 
                    name="skillName" 
                    placeholder="enter skill name" 
                    className="outline-none"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    />
                    <Button 
                    onClick={addSkill}
                    classes="">
                        add new skill
                    </Button>
                </div>
            </div>
            {/* project: */}
            <div className="rounded flex flex-col bg-card-background shadow p-section">
                <h3 className="text-2xl font-bold mb-4 text-text">Projects</h3>
                <div className="projects flex flex-wrap gap-3">
                    {
                        projects?.map(project =>{
                            return <ProjectCard 
                            key={project.id} 
                            project={project}
                            userId={user.uid}
                            goalId={goal}/>
                        })
                    }

                    <div className="project-form bg-background rounded my-2 p-3 shadow w-[30%]">
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
                </div>
            </div>
        </section>
    )
}