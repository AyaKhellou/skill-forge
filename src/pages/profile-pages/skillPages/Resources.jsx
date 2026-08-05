import { useState, useEffect,useRef } from "react";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection,doc,onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Loader from "../../../components/Loader";
import Resource from "../../../components/Resource";


export default function Resources(){
    const [updateMode, setUpdateMode] = useState(null)
    const [resources, setResources] = useState(null)
    const [loading, setLoading] = useState(false)
    const [resourceCategory, setResourceCategory] = useState("video")
    const [resourceLink, setResourceLink] = useState("")
    const [resourceName, setResourceName] = useState("")
    const inputRef = useRef(null);

    const { skill, goal, userId } = useOutletContext();
    const id = nanoid();

    useEffect(() => {
        const resourcesRef = collection(db, "users", userId, "goals", goal, "skills", skill, "resources");
        onSnapshot(
            resourcesRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setResources(data);
        },
        (error) => {
            console.error("Error fetching resources: ", error);
            setLoading(false);
        }
        );
    }, [userId, goal, skill]);

    
    function addResource(){
        async function createResource() {
            const docRef = doc(db, "users", userId, "goals",goal,"skills",skill,"resources",id);
            try{
                await setDoc(docRef, {
                    id:id,
                    name: resourceName,
                    link: resourceLink,
                    category: resourceCategory,
                });
                console.log("resource created!!!!!!!");
            } catch(err){
                console.log(err);
            }
        }
        createResource()
        setResourceCategory("")
        setResourceLink("")
        setResourceName("")
    }

    useEffect(()=>{
        if(updateMode){
            setResourceCategory(updateMode.category)
            setResourceLink(updateMode.link)
            setResourceName(updateMode.name)
            console.log("update mode is true");
            inputRef.current?.focus();
        }
    }, [updateMode])

    function updateResource(){
        const docRef = doc(db, "users", userId, "goals",goal,"skills",skill,"resources",updateMode.resourceId);

        async function editData(){
            try{
                await updateDoc(docRef, {
                    name: resourceName,
                    link: resourceLink,
                    category: resourceCategory
                });
            }catch(err){
                console.log(err);
            }
        }
        editData()
        setResourceName("")
        setResourceLink("")
        setResourceCategory("")
        setUpdateMode(null)
    }

    if(loading){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col">
                <Loader/>
            </div>
        )
    }
    return(
        <div className="bg-card-background shadow rounded p-section flex flex-col">
            <div className="mb-4">
                {resources?.length !== 0 && resources ?
                resources.map((resource)=>{
                    return <Resource 
                    key={resource.id} 
                    resource={resource}
                    skillId={skill}
                    goalId={goal}
                    userId={userId}
                    setUpdateMode={setUpdateMode}
                    />
                })
                :
                <p>no resources!</p>
                }
                <div className="bg-background shadow p-section m-3 rounded flex flex-col  gap-3">
                    <select 
                    value={resourceCategory}
                    onChange={(e)=> setResourceCategory(e.target.value)}
                    className="bg-peach text-sm text-text font-figtree px-2 py-1 rounded self-start">
                        <option value="video">video</option>
                        <option value="article">article</option>
                        <option value="tutorial">tutorial</option>
                    </select>
                    <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="resource name" 
                    className="bg-background p-2 border-b border-accent outline-none"
                    value={resourceName}
                    onChange={(e)=> setResourceName(e.target.value)}
                    />
                    <input 
                    type="text" 
                    placeholder="resource link" 
                    className="bg-background p-2 border-b border-accent outline-none"
                    value={resourceLink}
                    onChange={(e)=> setResourceLink(e.target.value)}
                    />
                    {updateMode ?
                    <Button 
                    onClick={updateResource}
                    classes="self-end">update resource</Button>
                    :
                    <Button 
                    onClick={addResource}
                    classes="self-end">add resource</Button>}
                </div>
            </div>
        </div>
    )
}