import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function DropDown({options, value , onChange}){
    const [open, setOpen] = useState(false)

    function toggleMenu(e){
        e.preventDefault();
        setOpen(prev=> !prev)
    }

    function selectOption(option) {
        onChange(option);
        setOpen(false);
    }
    const menuClass = open ? "block" : "hidden";
    
    useEffect(() => {
        function handleClickOutside(e) {
            e.preventDefault();
            if (!e.target.closest(".dropdown")) {
                setOpen(false);
            }
        }
        document.documentElement.addEventListener("click", handleClickOutside);
        return () => {
            document.documentElement.removeEventListener("click", handleClickOutside);
        };
    }, []);
    return(
        <div className="w-full relative dropdown">
            <button 
            type="button"
            className="cursor-pointer flex justify-between gap-2 w-full p-2 items-center border-b border-accent bg-background" 
            onClick={toggleMenu}>
                <p className="">{value}</p>
                <ChevronDown className="self-end"/>
            </button>
            <ul className={`${menuClass} absolute w-full z-10`}>
                {options.map(option=>
                    <li
                    key={option.id} 
                    className="cursor-pointer  p-2 border-b border-transparent hover:border-accent bg-background transition duration-300"
                    onClick={()=>selectOption(option)}
                    >{option.name}</li>
                )}
            </ul>
        </div>
    )
}