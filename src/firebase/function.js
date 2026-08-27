export default function secondsToTime(seconds){
    

    const totalMinutes = Math.floor(seconds / 60);
    
    const totalHours = Math.floor(totalMinutes / 60);

    const remainingSeconds = seconds % 60;

    const remainingMinutes = totalMinutes % 60;

    
    return`${totalHours <= 9 ? "0"+totalHours : totalHours}:${remainingMinutes <= 9 ? "0"+remainingMinutes : remainingMinutes}:${remainingSeconds <= 9 ? "0"+remainingSeconds : remainingSeconds}`;
}