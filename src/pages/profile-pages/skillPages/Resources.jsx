import { useState, useEffect,useRef } from "react";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import useResources from "../../../hooks/useResources";
import Loader from "../../../components/Loader";
import Resource from "../../../components/Resource";
import DropDown from "../../../components/DropDown";
import useSkill from "../../../hooks/useSkill";
import ErrorMessage from "../../../components/ErrorMessage";
import { emptyInput } from "../../../services/function";

export default function Resources(){

    const [updateMode, setUpdateMode] = useState(null)
    const [resourceCategory, setResourceCategory] = useState("video")
    const [resourceLink, setResourceLink] = useState("")
    const [resourceName, setResourceName] = useState("")
    const inputRef = useRef(null);
    
    const { skillId, goalId } = useOutletContext();

    const { resources, loadingResources, error, createNewResource, editResource, deleteCurrentResource } = useResources(goalId, skillId);
    const { updateSkillData } = useSkill(goalId, skillId);

    async function addResource(){
        const trimmedResourceName = resourceName.trim();
        const trimmedResourceLink = resourceLink.trim();
        if(!trimmedResourceName || !trimmedResourceLink) {
            await emptyInput("Please fill in all fields");
            return;
        }
        try{
            await createNewResource(trimmedResourceName, trimmedResourceLink, resourceCategory)
            setResourceCategory("video")
            setResourceLink("")
            setResourceName("")
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        if(updateMode){
            setResourceCategory(updateMode.category)
            setResourceLink(updateMode.link)
            setResourceName(updateMode.name)
            inputRef.current?.focus();
        }
    }, [updateMode])

    async function updateResource(){
        const trimmedResourceName = resourceName.trim();
        const trimmedResourceLink = resourceLink.trim();
        if(!trimmedResourceName || !trimmedResourceLink) {
            await emptyInput("Please fill in all fields");
            return;
        }
        try{
            await editResource(updateMode.resourceId, {
                name: trimmedResourceName,
                link: trimmedResourceLink,
                category: resourceCategory
            });
            cancelUpdate();
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        async function updateSkill(){
            try{
                await updateSkillData({resourcesCount:resources.length});
            }catch(err){
                console.log(err);
            }
        }
        updateSkill();
    },[resources])

    function cancelUpdate(){
        setUpdateMode(null);
        setResourceName("");
        setResourceLink("");
        setResourceCategory("video");
    }

    function handleSubmit(e){
        e.preventDefault();
        if(updateMode){
            updateResource();
        }else{
            addResource();
        }
    }

    if(loadingResources){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <Loader/>
            </div>
        )
    }
    return(
        <div className="bg-card-background shadow rounded p-section flex flex-col">
            <div className="mb-4">
                {
                error?
                <ErrorMessage message={error.message} />
                :
                resources?.length === 0 ?
                <p>no resources!</p> :
                resources.map((resource)=>{
                    return <Resource 
                    key={resource.id} 
                    resource={resource}
                    setUpdateMode={setUpdateMode}
                    onDelete={deleteCurrentResource}
                    />
                })
                
                }
                <form 
                className="bg-background shadow p-section m-3 rounded flex flex-col  gap-3"
                onSubmit={handleSubmit}>
                    <DropDown
                    options={[
                        { id: "video", name: "video" },
                        { id: "article", name: "article" },
                        { id: "tutorial", name: "tutorial" },
                        { id: "document", name: "document" },
                        { id: "book", name: "book" },
                        { id: "website", name: "website" },
                        { id: "other", name: "other" }
                    ]}
                    value={resourceCategory}
                    onChange={(option) => setResourceCategory(option.id)}
                    />
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
                    <div className="flex gap-2 self-end">
                        <Button 
                        onClick={updateResource}
                        >update resource</Button>
                        <Button 
                        onClick={cancelUpdate}
                        >cancel</Button>
                    </div>
                    :
                    <Button 
                    onClick={addResource}
                    classes="self-end">add resource</Button>}
                </form>
            </div>
        </div>
    )
}