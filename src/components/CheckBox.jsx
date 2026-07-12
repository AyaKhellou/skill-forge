import { Check } from "lucide-react"
import { useState } from "react"

export default function CheckBox({checked,toggleCheck}){
    return(
        <div onClick={toggleCheck}
        className="flex items-center justify-center border-2 border-accent cursor-pointer w-8 h-8 rounded-full">
            {checked ? <Check /> : null}
        </div>
    )
}