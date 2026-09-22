// Add a second document with a generated ID.
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc,getDoc, onSnapshot } from "firebase/firestore"; 
import { db, auth} from "../firebase-config";
import { signOut } from "firebase/auth"


//profile info
export function getProfileInfo(userId, onData, onError) {

    return onSnapshot(
        doc(db,"users", userId), 
        (snapshot)=>{
            if (snapshot.exists()) {
                onData(snapshot.data());
            }else{
                onData(null)
            }
        },
        onError
    )
}

//update profile info
export async function updateProfileInfo(docId, dataToUpdate){
    await updateDoc(doc(db, "users", docId), dataToUpdate);
}

// read user goals
export function getGoals(userId, onData, onError) {

    return onSnapshot(
        collection(db,"users", userId, "goals"), 
        (snapshot)=>{
            if (snapshot) {
                const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
                onData(data);
            }else{
                onData(null)
            }
        },
        onError
    )
}
// create a new goal
export async function createGoal(userId,data,docId) {

    const docRef = doc(db, "users", userId, "goals",docId);

    await setDoc(docRef, data);
}
//delete a goal
export async function deleteGoal(userId, goalId){
    const docRef = doc(db, "users", userId, "goals",goalId);

    await deleteDoc(docRef);
}

// -------------------------------------------------------------------------------------------------

// read user particular goal / get skills in a goal / get projects in a goal / edit goal

export function getGoal(userId, goalId , onData, onError) {

    return onSnapshot(doc(db,"users", userId, "goals",goalId), (doc)=>{
        onData(doc.data())
    },onError)

}

//update goal
export async function updateGoal(userId, goalId, dataToUpdate){
    await updateDoc(doc(db, "users", userId, "goals", goalId), dataToUpdate);
}

// ------------------- get skills in a goal
export function getGoalSkills(userId, goalId , onData, onError) {
    return onSnapshot(
        collection(db, "users", userId, "goals", goalId, "skills"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        onData(data);
    },onError
    );
}
//create skill:
export async function createSkill(userId, goalId, id, newSkill) {
    await setDoc(doc(db, "users", userId, "goals",goalId,"skills",id), newSkill);
}
// delete skill
export async function deleteSkill(userId, goalId, skillId){
    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId);
    await deleteDoc(docRef);
}
//get skill's data
export function getSkill(userId, goalId, skillId, onData, onError) {
    return onSnapshot(doc(db, "users", userId, "goals", goalId, "skills", skillId), (doc) => {
        onData(doc.data());
    }, onError);
}
// update skill
export async function updateSkill(userId, goalId, skillId, dataToUpdate){
    await updateDoc(doc(db, "users", userId, "goals", goalId, "skills", skillId), dataToUpdate);
}



//------------- get projects in a goal
export function getGoalProjects(userId, goalId , onData, onError) {
    const projectsRef = collection(db, "users", userId, "goals", goalId, "projects");
    return onSnapshot(
        projectsRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        onData(data);
    },onError
    );
}
//create project
export async function createProject(userId, goalId, id, newProject) {
    await setDoc(doc(db, "users", userId, "goals",goalId,"projects",id), newProject);
}
// delete project
export async function deleteProject(userId, goalId, projectId){
    const docRef = doc(db, "users", userId, "goals",goalId,"projects",projectId);
    await deleteDoc(docRef);
}

//milestones in a skill
export function getSkillMilestones(userId, goalId, skillId, onData, onError) {
    return onSnapshot(
        collection(db, "users", userId, "goals", goalId, "skills", skillId, "milestones"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        onData(data);
    },onError
    );
}

export async function createMilestone(userId, goalId, skillId, id, newMilestone) {
    await setDoc(doc(db, "users", userId, "goals",goalId,"skills",skillId,"milestones",id), newMilestone);
}

export async function deleteMilestone(userId, goalId, skillId, milestoneId){
    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId,"milestones",milestoneId);
    await deleteDoc(docRef);
}
export async function updateMilestone(userId, goalId, skillId, milestoneId, dataToUpdate){
    await updateDoc(doc(db, "users", userId, "goals", goalId, "skills", skillId, "milestones", milestoneId), dataToUpdate);
}


//notes

export function getSkillNotes(userId, goalId, skillId, onData, onError) {
    return onSnapshot(
        collection(db, "users", userId, "goals", goalId, "skills", skillId, "notes"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        onData(data);
    },onError
    );
}

export async function createNote(userId, goalId, skillId, id, newNote) {
    await setDoc(doc(db, "users", userId, "goals",goalId,"skills",skillId,"notes",id), newNote);
}

export async function deleteNote(userId, goalId, skillId, noteId){
    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId,"notes",noteId);
    await deleteDoc(docRef);
}

export async function updateNote(userId, goalId, skillId, noteId, dataToUpdate){
    await updateDoc(doc(db, "users", userId, "goals", goalId, "skills", skillId, "notes", noteId), dataToUpdate);
}

//useGoal only: get goal data + update goals + delete goal 
// create useSkills to get goal's skills and add to them  and same  with projects better
// -------------------------------------------------------------------------------------------------



























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

// create the user's collection
export async function createUserData(id,data) {
    try {
        await setDoc(doc(db, "users", id), data);

        console.log("Document created!");
        } catch (err) {
            console.error(err);
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



export function logout(){
    signOut(auth)
    .catch((error) => {
        console.log(error);
    });
}