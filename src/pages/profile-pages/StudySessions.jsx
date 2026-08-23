import { useEffect, useRef, useState } from "react";
import DropDown from "../../components/DropDown";

export default function StudySkills(){
    const options = ["css", 'js', 'ts', 'tailwind']
    const [selectedOption, setSelectedOption] = useState(options[0])
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)


    console.log(selectedOption);
    
    

    useEffect(()=>{
        if(seconds > 59){
            setMinutes(prev=> prev + 1)
            setSeconds(0)
        }
        if(minutes > 59){
            setHours(prev=> prev + 1)
            setMinutes(0)
        }
    },[seconds,minutes])

    const time = `${hours <= 9 ? "0" + hours : hours}:${minutes <= 9 ? "0" + minutes : minutes}:${seconds <= 9 ? "0" + seconds : seconds}`
    

    const intervalRef = useRef(null);

    function startTimer() {
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 10);
    }
    
    function pauseSession(){
        console.log(time);
        clearInterval(intervalRef.current);
    }
    
    function finishSession() {
        console.log(time);
        clearInterval(intervalRef.current);
        setSeconds(0)
        setMinutes(0)
        setHours(0)
    }

    return(
        <section className="page flex flex-col gap-3">
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <h2>Let's build something today</h2>
                <div className="info flex gap-3 w-full">
                    <div className="flex flex-col gap-2 w-1/3">
                        <label htmlFor="session-title" className="detail">Session title</label>
                        <input type="text" id="session-title" className="p-2 border-b border-accent bg-background outline-none" />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                        <label className="detail" htmlFor="skill">Skill</label>
                        <DropDown 
                        className="w-full"
                        id="skill"
                        options={options}
                        value={selectedOption}
                        onChange={setSelectedOption}  />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                        <label htmlFor="session-goal" className="detail">Today's goal</label>
                        <input type="text" id="session-title" className="p-2 border-b border-accent bg-background outline-none" />
                    </div>
                </div>
            </div>
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <h2>{time}</h2>
                <button onClick={startTimer}>start</button>
                <button onClick={pauseSession}>pause</button>
                <button onClick={finishSession}>end</button>
            </div>
        </section>
    )
}