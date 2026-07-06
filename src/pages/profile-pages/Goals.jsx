import Button from "../../components/Button"
import ProgressBar from "../../components/ProgressBar"
import SkillCard from "../../components/SkillCard"


export default function Goals(){
    return(
        <section className="page p-section relative bg-background w-[80%]">
            <h2>Current Goals</h2>
            <div className="goal-card bg-card-background border border-accent rounded p-section">
                <h3 className="card-title font-figtree text-xl font-semibold text-text">Learn the guitar</h3>
                <ProgressBar width="50%"/>
                <div className="skills">
                    <SkillCard status={true} name="Chords"/>
                    <SkillCard status={false} name="Notes"/>
                    <SkillCard status={true} name="Rythm"/>
                </div>
            </div>
            <Button primary={true} classes="fixed bottom-section right-section ">Add new Goal</Button>
        </section>
    )
}