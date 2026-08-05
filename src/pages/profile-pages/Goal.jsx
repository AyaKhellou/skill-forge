import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../../authContext"
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"
import Loader from "../../components/Loader";
import Button from "../../components/Button"
import { ArrowLeft } from "lucide-react";
import DetailedSkillCard from "../../components/DetailedSkillCard";
import { collection, doc,onSnapshot,setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { nanoid } from "nanoid";

export default function Goal(){
    const { goal } = useParams();
    const { user } = useAuthContext();
    const[goalData,setGoalData] = useState(null)
    const [skills, setSkills] = useState(null)
    const [newSkillName, setNewSkillName] = useState("")
    const id = nanoid();

    console.log(user.uid);
    console.log(goal);
    
    
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
        }, [user, goal]);


    const loading = !goalData || !skills;

    function addSkill(){
        if(!newSkillName) return;
        const newSkill = {
            id:id,
            name: newSkillName,
            status: false,
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
                <div className="details flex justify-between">
                    <span className="detail font-bold!">
                        {skills?.filter(skill=>skill.status === true).length}/{skills?.length} skills . {progress} %
                    </span>
                    <span className="detail study-hours">
                        total study time
                        10 hours
                    </span>
                </div>
            </div>
            <div className="rounded flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-text">skills</h3>
                <div className="skills">
                    {skills?.map(skill=>
                        <DetailedSkillCard 
                        key={skill.id}
                        id={skill.id}
                        name={skill.name}
                        status={skill.status}/>
                    )}
                </div>
                <div className="bg-card-background rounded my-2 p-3 shadow flex items-center justify-between gap-4">
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
        </section>
    )
}