import { Trash, ArrowRight, Pen } from "lucide-react";
import { deleteWarning } from "../services/function";

export default function Resource({ resource, setUpdateMode, onDelete }){
        
    function updateResource(){
        setUpdateMode({name:resource.name, link:resource.link, category:resource.category, resourceId:resource.id})
    }
    async function deleteResource(){
        const result = await deleteWarning("resource");
        if(!result) return;
        try{
            await onDelete(resource.id);
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div
        className="bg-background shadow p-section m-3 rounded flex items-center gap-3">
            <button type="button" className="cursor-pointer " onClick={deleteResource}>
                <Trash width={17} height={17} className="text-red!"/>
            </button>
            <span className="bg-peach text-sm text-carcoal! px-2 py-1 rounded-full"> {resource.category} </span>
            <p>{resource.name}</p>
            <div className="flex items-center ml-auto gap-2">
                <button type="button" className="cursor-pointer" onClick={updateResource}>
                    <Pen width={17} height={17} className="text-sage!"/>
                </button>
                <a 
                href={resource.link} 
                target="_blank"
                className="text-primary">
                    <ArrowRight/>
                </a>
            </div>
        </div>
    )
}