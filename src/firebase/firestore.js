// Add a second document with a generated ID.
import { collection, getDocs, doc, setDoc } from "firebase/firestore"; 
import { db, auth} from "../firebase-config";
import { signOut } from "firebase/auth"



export async function createUserData(id){
    await setDoc(doc(db, "users", id), data);
}

export async function getUserData(id) {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}

//https://firebase.google.com/docs/firestore/manage-data/add-data

export function logout(){
    signOut(auth)
    .catch((error) => {
        console.log(error);
    });
}