import CheckBox from "./CheckBox"

export default function SkillCard({status,name}){
    return(
        <div className="skill flex items-center gap-5 bg-background p-4 my-4 rounded">
            <CheckBox checked={status}/>
            <div>
                <h4 className="text-lg font-figtree text-text">{name}</h4>
            </div>
        </div>
    )
}