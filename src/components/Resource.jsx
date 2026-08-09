import { Trash, ArrowRight } from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Resource({ resource, userId, goalId, skillId, setUpdateMode }){
    
    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId,"resources",resource.id);
    
    function updateResource(){
        setUpdateMode({name:resource.name, link:resource.link, category:resource.category, resourceId:resource.id})
    }
    function deleteResource(){
        async function deleteData(){
            try{
                await deleteDoc(docRef);
            }catch(err){
                console.log(err);
            }
        }
        deleteData()
    }
    return(
        <div
        className="bg-background shadow p-section m-3 rounded flex items-center gap-3">
            <button onClick={deleteResource}>
                <Trash width={17} height={17} className="text-red"/>
            </button>
            <span className="bg-peach text-sm text-text px-2 py-1 rounded-full"> {resource.category} </span>
            <p onClick={updateResource}>{resource.name}</p>
            <a 
            href={resource.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary ml-auto">
                <ArrowRight/>
            </a>
        </div>
    )
}