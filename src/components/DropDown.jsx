import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DropDown({options, value , onChange, className}){
    const [open, setOpen] = useState(false)

    function toggleMenu(){
        setOpen(prev=> !prev)
    }

    function selectOption(option) {
        onChange(option);
        setOpen(false);
    }
    return(
        <div className={className}>
            <button 
            className="cursor-pointer flex justify-between gap-2 w-full p-2 items-center border-b border-accent bg-background" 
            onClick={toggleMenu}>
                <p className="">{value}</p>
                <ChevronDown className="self-end"/>
            </button>
            <ul className={open ? "block" : "hidden"}>
                {options.map(option=>
                    <li 
                    className="cursor-pointer  p-2 border-b border-transparent hover:border-accent bg-background transition duration-300"
                    onClick={()=>selectOption(option)}>{option}</li>
                )}
            </ul>
        </div>
    )
}