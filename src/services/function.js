export function secondsToTime(seconds){
    

    const totalMinutes = Math.floor(seconds / 60);
    
    const totalHours = Math.floor(totalMinutes / 60);

    const remainingSeconds = seconds % 60;

    const remainingMinutes = totalMinutes % 60;

    
    return`${totalHours <= 9 ? "0"+totalHours : totalHours}:${remainingMinutes <= 9 ? "0"+remainingMinutes : remainingMinutes}:${remainingSeconds <= 9 ? "0"+remainingSeconds : remainingSeconds}`;
}
//-----------------------------
export async function uploadImage(file){
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
//-----------------------------------------------------
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);


export async function deleteWarning(name){
    const result = await MySwal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `You will not be able to recover this ${name}!`,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        customClass: {
            popup: "alert",
            title: "alert-title",
            confirmButton: "confirm-button",
            cancelButton: "cancel-button",
        },
    });
    return result.isConfirmed;
}


export async function emptyInput(text){
    const result = await MySwal.fire({
        icon: "warning",
        title:"Oops!",
        text: text,
        confirmButtonText: "Okay",
        customClass: {
            popup: "alert",
            title: "alert-title",
            confirmButton: "alert-button",
        },
    });
    return result;
}

//-----------------------------
export function getUpdateTime(date) {
        
    const seconds = Math.abs(new Date() - new Date(date)) / 1000;

    if (seconds < 60) {
        const value = Math.round(seconds);
        return `${value} second${value === 1 ? "" : "s"}`;
    }

    if (seconds < 3600) {
        const value = Math.round(seconds / 60);
        return `${value} minute${value === 1 ? "" : "s"}`;
    }

    if (seconds < 86400) {
        const value = Math.round(seconds / 3600);
        return `${value} hour${value === 1 ? "" : "s"}`;
    }

    if (seconds < 604800) {
        const value = Math.round(seconds / 86400);
        return `${value} day${value === 1 ? "" : "s"}`;
    }

    if (seconds < 2592000) {
        const value = Math.round(seconds / 604800);
        return `${value} week${value === 1 ? "" : "s"}`;
    }

    if (seconds < 31536000) {
        const value = Math.round(seconds / 2592000);
        return `${value} month${value === 1 ? "" : "s"}`;
    }

    const value = Math.round(seconds / 31536000);
    return `${value} year${value === 1 ? "" : "s"}`;
}
