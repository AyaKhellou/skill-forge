import { useParams } from "react-router-dom"

export default function Goal(){
    const { goal } = useParams();

    return(
        <section>
            <h2>this is goal {goal}</h2>
        </section>
    )
}