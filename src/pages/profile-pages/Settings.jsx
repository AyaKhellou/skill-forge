import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { useAuthContext } from "../../authContext";
import Button from "../../components/Button";

export default function Settings(){
    
    const { user } = useAuthContext();
    const [profileInfo, setProfileInfo] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    
    
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
    },[profileInfo])
    console.log(profileInfo);

    function saveChanges (){
        console.log(emailInput);
        setEditMode(false)
        
    }
    
    return(
        <section className="page">
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <div
                className="rounded-[50%] mb-3 w-16 h-16 flex items-center justify-center bg-accent cursor-pointer overflow-hidden"
                >
                <img src={profileInfo?.pfp} alt="user pfp" />
                </div>
                <h3>{profileInfo?.name}</h3>
                <div className="bg-background shadow rounded w-full">
                    <div className="flex justify-between items-center p-3">
                        <p className="detail">Email</p>
                        {
                            editMode?
                            <input type="text" value={emailInput} onChange={e=>setEmailInput(e.target.value)} />
                            :
                            <p onClick={()=>setEditMode(prev=>!prev)}>{profileInfo?.email}</p>
                        }
                    </div>
                </div>
            </div>
            {
                editMode?
                <Button onClick={saveChanges}>save edits</Button>:null
            }
        </section>
    )
}