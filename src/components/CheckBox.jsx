import { Check } from "lucide-react"
import { useState } from "react"

export default function CheckBox({checked}){
    const [checkedValue, setCheckedValue] = useState(checked)

    function toggleCheck(){
        setCheckedValue(prev => !prev)
    }
    return(
        <div onClick={toggleCheck}
        className="flex items-center justify-center border-2 border-accent cursor-pointer w-8 h-8 rounded-full">
            {checkedValue ? <Check /> : null}
        </div>
    )
}