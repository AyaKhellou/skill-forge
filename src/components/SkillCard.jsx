import CheckBox from "./CheckBox"
import { useState } from "react"
import { Trash,Pen } from "lucide-react"

export default function SkillCard({status,name,toggleCheck}){

    return(
        <div className="skill flex items-center justify-between bg-background p-4 my-4 rounded">
            <div className="info flex items-center gap-5">
                <CheckBox checked={status} toggleCheck={toggleCheck} />
                <div>
                    <h4 className="text-lg font-figtree text-text">{name}</h4>
                </div>
            </div>
            <div className="buttons">
                <button type="button" className="cursor-pointer">
                    <Trash width={17} />
                </button>
                <button type="button" className="cursor-pointer pl-3">
                    <Pen width={17}/>
                </button>
            </div>
        </div>
    )
}