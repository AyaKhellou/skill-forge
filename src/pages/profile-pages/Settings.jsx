import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase-config";
import { useAuthContext } from "../../authContext";
import Button from "../../components/Button";
import { Camera, Pen } from "lucide-react";

export default function Settings(){
    
    const { user } = useAuthContext();
    const [profileInfo, setProfileInfo] = useState(null)

    const [editEmailMode, setEditEmailMode] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    
    const [editNameMode, setEditNameMode] = useState(false)
    const [nameInput, setNameInput] = useState('')

    const [changeImageMode, setChangeImageMode] = useState(false)

    const emailInputRef = useRef(null)
    const nameInputRef = useRef(null)

    
    
    useEffect(()=>{
        async function getprofileInfo() {
            onSnapshot(doc(db,"users", user?.uid), (doc)=>{
                setProfileInfo(doc.data())
            }),(error) => {
                console.error("Error fetching goal data: ", error);
            }
        }
        getprofileInfo()
    },[user])
    useEffect(()=>{
        if(!profileInfo) return;
        setEmailInput(profileInfo.email)
        setNameInput(profileInfo.name)
    },[profileInfo])
    console.log(profileInfo);


    useEffect(()=>{
        if(editEmailMode){
            emailInputRef.current.focus()
        } 
    },[editEmailMode])

    useEffect(()=>{
        if(editNameMode){
            nameInputRef.current.focus()
        } 
    },[editNameMode])
    async function updateProfile(dataToUpdate){
        try{
            await updateDoc(doc(db,"users", user.uid), dataToUpdate);
        }catch(err){
            console.log(err);
        }
    }

    function saveChanges (){
        setEditEmailMode(false)
        setEditNameMode(false)

        if(emailInput !== profileInfo.email){
            updateProfile({email:emailInput})
        }
        if(nameInput !== profileInfo.name){
            updateProfile({name:nameInput})
        }

        if(imagePreview){
            async function changeImage(){
                const newImageUrl =  await uploadImage(imagePath)
                updateProfile({pfp:newImageUrl})
                setChangeImageMode(false)
                setImagePreview(null)
            }
            changeImage()
        }
    }
    console.log(user?.photoURL);
    

    const [imagePath, setImagePath] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            setImagePath(file);
            setImagePreview(URL.createObjectURL(file));
        }
        setChangeImageMode(prev=>!prev)
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
    
    
    return(
        <section className="page">
            <div className="bg-card-background shadow rounded p-section flex flex-col gap-4 items-center">
                <div
                className="relative rounded-[50%] mb-3 w-16 h-16 flex items-center justify-center bg-accent cursor-pointer overflow-hidden"
                >
                <div 
                // className="z-10 absolute bg-gray-900/30 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100"
                // onClick={()=>setChangeImageMode(prev=>!prev)}
                >
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
                    className="absolute top-0 left-0 bg-gray-950/40 opacity-0 hover:opacity-100 w-full h-full flex items-center justify-center">
                        <Camera width={30} height={30}  /> 
                    </label>
                </div>
                {
                    imagePreview ?
                    <img src={imagePreview} alt="user pfp" />
                    :
                    <img src={profileInfo?.pfp} alt="user pfp" />
                }
                </div>

                <div className="flex items-center gap-2 justify-center">
                    {
                    editNameMode ?
                    <input 
                    className="text-xl font-bold mb-4 text-text w-fit"
                    ref={nameInputRef}
                    type="text" 
                    value={nameInput} 
                    onChange={e=>setNameInput(e.target.value)} />
                    :
                    <h3>{profileInfo?.name}</h3>
                    }
                    <button className="cursor-pointer self-start" onClick={()=>setEditNameMode(prev=>!prev)}>
                        <Pen width={17}/>
                    </button>
                </div>

                <div className="bg-background shadow rounded w-full">
                    <div className="flex items-center justify-between p-3">
                        <p className="detail">Email</p>
                        <div className="flex gap-4">
                        {
                            editEmailMode ?
                            <input 
                            ref={emailInputRef}
                            type="text" 
                            value={emailInput} 
                            onChange={e=>setEmailInput(e.target.value)} />
                            :
                            <p className="">{profileInfo?.email}</p>
                        }
                        <button className="cursor-pointer" onClick={()=>setEditEmailMode(prev=>!prev)}>
                            <Pen width={17}/>
                        </button>
                        </div>
                    </div>
                </div>
                <Button classes="self-end" onClick={saveChanges} disabled={editEmailMode || editNameMode || changeImageMode ? false : true}>save edits</Button>
            </div>
        </section>
    )
}