// Add a second document with a generated ID.
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc,getDoc} from "firebase/firestore"; 
import { db, auth} from "../firebase-config";
import { signOut } from "firebase/auth"



// create the user's colledtion
export async function createUserData(id,data) {
    try {
        await setDoc(doc(db, "users", id), data);

        console.log("Document created!");
        } catch (err) {
            console.error(err);
        }
}

export async function createGoal(userId,data,docId) {
    const docRef = doc(db, "users", userId, "goals",docId);

    try{
        await setDoc(docRef, data);

        console.log("goal created!!!!!!!");
        
    } catch(err){
        console.log(err);
        
    }
}

export async function createSkill(userId,data,goalId,skillId) {
    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId);

    try{
        await setDoc(docRef, data);

        console.log("skill created!!!!!!!");
        
    } catch(err){
        console.log(err);
        
    }
}

// read user data
export async function getUserGoals(id) {
    try{
    const querySnapshot = await getDocs(collection(db,"users", id, "goals"));

    return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
}));

    }catch(err){
        console.log(err);
    }
}

//read user goal

export async function getUserGoal(id,goalId) {

    const docRef = doc(db,"users", id, "goals",goalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}

// read user skills
export async function getUserskills(id,goalId) {
    try{
    const querySnapshot = await getDocs(collection(db,"users", id, "goals",goalId,"skills"));

    return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
}));

    }catch(err){
        console.log(err);
    }
}

export async function updateSkill(userId, goalId, skillId, dataToUpdate){

const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId);
try{
    await updateDoc(docRef, dataToUpdate);
    console.log("updated!");
    
}catch(err){
    console.log(err);
}
}

export async function updateGoal(userId, goalId, dataToUpdate){

const docRef = doc(db, "users", userId, "goals",goalId);
try{
    await updateDoc(docRef, dataToUpdate);
    console.log("updated!");
    
}catch(err){
    console.log(err);
}
}

export async function deleteSkill(userId, goalId, skillId){
    try{
        await deleteDoc(doc(db, "users", userId, "goals",goalId,"skills",skillId));
    }catch(err){
        console.log(err);
    }
}


export function logout(){
    signOut(auth)
    .catch((error) => {
        console.log(error);
    });
}