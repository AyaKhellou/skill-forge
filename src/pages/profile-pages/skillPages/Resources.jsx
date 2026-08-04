import { useState, useEffect } from "react";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection,doc,onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Loader from "../../../components/Loader";
import { ArrowRight } from "lucide-react";


export default function Resources(){
    // const [updateMode, setUpdateMode] = useState(false)
    const [resources, setResources] = useState(null)
    // const [newMilestone, setNewMilestone] = useState("")
    const [loading, setLoading] = useState(false)
    const [resourceCategory, setResourceCategory] = useState("")
    const [resourceLink, setResourceLink] = useState("")
    const [resourceName, setResourceName] = useState("")

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
            // setLoading(false);
        },
        (error) => {
            console.error("Error fetching resources: ", error);
            setLoading(false);
        }
        );
        // setResources([
        //     {id:1, name:"resource 1", link:"https://example.com/resource1", category:"video"},
        //     {id:2, name:"resource 2", link:"https://example.com/resource2", category:"article"},
        //     {id:3, name:"resource 3", link:"https://example.com/resource3", category:"tutorial"},
        // ])
    }, [userId, goal, skill]);


    // function addMilestone(){
    //     setUpdateMode(true)
    // }

    
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
        console.log(resourceCategory);
        console.log(resourceLink);
        console.log(resourceName);
    }

    // console.log(resources);
    
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
                    return <div 
                    key={resource.id}
                    className="bg-background shadow p-section m-3 rounded flex items-center gap-3">
                        <span className="bg-peach text-sm text-text px-2 py-1 rounded-full"> {resource.category} </span>
                        <p>{resource.name}</p>
                        <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary ml-auto">
                            <ArrowRight/>
                        </a>
                    </div>
                })
                :
                <p>new resources!</p>
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
                    <Button 
                    onClick={addResource}
                    classes="self-end">add resource</Button>
                </div>
            </div>
            {/* {updateMode &&
                <input 
                className="bg-background border-b border-accent flex items-center gap-3 p-5"
                onChange={(e)=> setNewMilestone(e.target.value)}
                value={newMilestone}
                />
            }
            {updateMode ?
                <Button 
                classes="self-end"
                onClick={saveMilestone}>save milestone</Button>
                :
                <Button 
                classes="self-end"
                onClick={addMilestone}>add milestone</Button>
            } */}
        </div>
    )
}