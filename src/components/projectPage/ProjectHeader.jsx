import { Link } from "react-router-dom";
import { ArrowLeft, Check, Pen, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { uploadImage, emptyInput } from "../../services/function";

export default function ProjectHeader({ 
    goalId,
    updateTime,
    updateProject,
    name,
    briefDescription,
    imageUrl,
    techStack,
    createdAt
}) {

    const [changeImageMode, setChangeImageMode] = useState(false)
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePath, setImagePath] = useState(null);

    const [editTitleMode, setEditTitleMode] = useState(false)
    const [projectTitle, setProjectTitle] = useState("")
    const [editBriefDesMode, setEditBriefDesMode] = useState(false)
    const [briefDescriptionState ,setBriefDescriptionState] = useState("")


    useEffect(()=>{
            if(name !== undefined){
                setProjectTitle(name)
            }
            if(briefDescription !== undefined){
                setBriefDescriptionState(briefDescription)
            }
        },[name, briefDescription])
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            setImagePath(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function changeImage(){
        const newImageUrl =  await uploadImage(imagePath)
        await updateProject({imageUrl:newImageUrl})
        setChangeImageMode(false)
        setImagePreview(null)
    }

    function cancelImageChange(){
        setChangeImageMode(false)
        setImagePreview(null)
        setImagePath(null)
    }
    async function editTitle(){
        const trimmedTitle = projectTitle.trim();
        if(trimmedTitle === ""){
            await emptyInput('Project title cannot be empty');
            return;
        }
        await updateProject({name:trimmedTitle})
        setEditTitleMode(false)
    }

    async function editBriefDes(){
        const trimmedBriefDescription = briefDescriptionState.trim();
        if(trimmedBriefDescription === ""){
            await emptyInput('Brief description cannot be empty');
            return;
        }
        await updateProject({briefDescription:trimmedBriefDescription})
        setEditBriefDesMode(false)
    }

    return (
        <div className="project-card">
            <div className="image-cont relative">
                {
                    changeImageMode ?
                    <div className="flex flex-col">
                        <input 
                            type="file" 
                            id="image-upload" 
                            name="imageUpload" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <label 
                        htmlFor="image-upload" 
                        className="absolute bg-gray-950/40 w-full h-10/12 rounded-xl flex items-center justify-center">
                            <Plus className="text-background opacity-100"/>
                        </label>
                        {
                        imagePreview ? 
                            <img
                                src={imagePreview}
                                alt="Project preview"
                                className="h-64 w-full rounded-xl object-cover mb-2"
                            />
                        : 
                        <img
                            src={imageUrl}
                            alt="Project preview"
                            className="h-64 w-full rounded-xl object-cover mb-2"
                        />
                        }
                        <div className="self-end mt-2">
                            <Button
                            classes="cursor-pointer p-1! mr-2"
                            onClick={changeImage}>
                                <Check/>
                            </Button>
                            <Button
                            classes="cursor-pointer p-1!"
                            onClick={cancelImageChange}>
                                <X/>
                            </Button>
                        </div>
                    </div>
                    :
                    <div>
                        <img
                        src={imageUrl}
                        alt="project"
                        className="h-64 w-full rounded-xl object-cover mb-2"
                        />
                        <Button 
                        primary={false} 
                        classes="p-1! text-sm! absolute bottom-3 left-3"
                        onClick={()=>setChangeImageMode(true)}
                        >Change image</Button>
                    </div>
                }
                
            </div>
            <Link to={`/user/goals/${goalId}`}  
            className="text-blue-500 flex items-center gap-2 mb-4">
                <ArrowLeft width={17} />
                <p>go back to goals</p>
            </Link>
            <div className="flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {
                            techStack ?
                            techStack.map(skill=>{
                                return <span key={skill} className="tag bg-sage">{skill}</span>
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
                                {name}
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
                <div className="detail flex gap-4 items-center justify-between text-sm">
                    {
                        editBriefDesMode ?
                        <div className="flex w-1/2">
                            <input 
                            className="border-b border-accent outline-none pb-1 w-full "
                            type="text" name="brief-desc"
                            value={briefDescriptionState}
                            onChange={(e)=>setBriefDescriptionState(e.target.value)}
                            />
                            <button 
                            onClick={editBriefDes}
                            className="cursor-pointer">
                                <Check/>
                            </button>
                        </div>
                        :
                        <p 
                        onClick={()=>setEditBriefDesMode(true)}
                        >{briefDescription}</p>
                    }
        
                    <div className="details flex flex-col gap-2">
                        <span>Created at: {createdAt}</span>
                        <span>Last updated {updateTime} ago</span>
                    </div>
                </div>
            </div>
        </div>
    )
}