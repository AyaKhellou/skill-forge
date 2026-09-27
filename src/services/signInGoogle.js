import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase-config"
import { createUserProfile } from "./firestore"

export async function signInGoogle(e){
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await createUserProfile(user.uid,{
            name : user.displayName,
            email: user.email,
            pfp: user.photoURL,
            createdAt: user.reloadUserInfo.createdAt
        });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    }
}