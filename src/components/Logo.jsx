import icon from "../assets/forgeIconPrimary.png"
export default function Logo(){

    return(
        <div className="flex items-center gap-2">
            <img src={icon} 
            alt="icon" 
            className="w-10 max-sm:w-8" />
            <p className="text-light text-2xl max-sm:text-xl font-bold mt-1">SkillForge</p>
        </div>
    )
}