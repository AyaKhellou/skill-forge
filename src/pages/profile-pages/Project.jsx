import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Button from "../../components/Button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc,onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useAuthContext } from "../../authContext";

export default function Project() {
    const [projectData, setProjectData] = useState(null)
    const { user } = useAuthContext()
    const { goal , project } = useParams();

    console.log("goal Id: " , goal);
    console.log("project name: " , project);

    
    useEffect(()=>{
        const docRef = doc(db, "users", user.uid , "goals",goal,"projects",project)
        onSnapshot(docRef, (doc)=>{
            setProjectData(doc.data())
        }),(error) => {
            console.error("Error fetching goal data: ", error);
        }
    },[user,project,goal])
    
    console.log(projectData);
    
    return (
        <section className="page flex flex-col gap-3">
            <div className="project-card">
                <Link to={`/user/goals/${goal}`}  
                className="text-blue-500 flex items-center gap-2 mb-4">
                    <ArrowLeft width={17} />
                    <p>go back to goals</p>
                </Link>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="tag bg-sage">In progress</span>
                            <span className="tag bg-peach">UI/UX</span>
                            <span className="tag bg-blush">React</span>
                        </div>
                        <h2 className="mb-2">{project.split("-").join(" ")}</h2>
                    </div>
                    <div className="detail flex flex-col gap-1 text-sm">
                        <span>Created on Aug 8, 2026</span>
                        <span>Last updated 2 days ago</span>
                    </div>
                </div>
            </div>
            <div className="project-grid">
                <div className="flex flex-col gap-4">
                    <div id="description" className="project-card">
                        <h3 className="text-2xl font-semibold">Description</h3>
                        <p className="mt-3 leading-7 text-detail">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic animi beatae provident quisquam ab,
                            recusandae asperiores accusantium ad eaque culpa, et repellat commodi expedita. Placeat mollitia
                            incidunt rerum officia aliquid.
                        </p>
                    </div>

                    <div id="reflections" className="project-card">
                        <h3 className="text-2xl font-semibold">Reflections</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            <div className="rounded-xl border border-accent bg-background p-4">
                                <h4 className="font-semibold text-text">What worked well</h4>
                                <p className="mt-2 text-sm leading-6 text-detail">
                                    The structure stayed clear and the feedback loop helped keep the experience focused.
                                </p>
                            </div>
                            <div className="rounded-xl border border-accent bg-background p-4">
                                <h4 className="font-semibold text-text">What to improve</h4>
                                <p className="mt-2 text-sm leading-6 text-detail">
                                    More time for testing would make the interactions feel smoother and more intentional.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div id="lessons" className="project-card">
                        <h3 className="text-2xl font-semibold">Lessons learned</h3>
                        <ul className="mt-3 space-y-2">
                            <li className="list-inside list-disc">Break the work into smaller milestones to keep momentum steady.</li>
                            <li className="list-inside list-disc">A simple visual system makes future updates much easier.</li>
                            <li className="list-inside list-disc">Testing early helps catch friction before it becomes overwhelming.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="project-card">
                        <img
                            src="https://i.pinimg.com/1200x/6a/f1/ec/6af1ec6645410a41d5339508a83b86f9.jpg"
                            alt="project"
                            className="project-image"
                        />
                    </div>

                    <div className="project-card">
                        <h3 className="text-xl font-semibold">Tech stack</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="tag bg-accent">React</span>
                            <span className="tag bg-accent">Firebase</span>
                            <span className="tag bg-accent">Tailwind CSS</span>
                        </div>
                    </div>

                    <div id="links" className="project-card">
                        <h3 className="text-xl font-semibold">Links</h3>
                        <div className="mt-3 flex flex-col gap-2">
                            <a href="https://example.com" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border-color bg-background px-4 py-3 text-sm font-semibold transition duration-200 ease-linear hover:-translate-y-0.5 hover:border-accent ">
                                <span>Live preview</span>
                                <span className="text-sm">
                                    <ArrowUpRight width={17} className="text-accent"/>
                                </span>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border-color bg-background px-4 py-3 text-sm font-semibold transition duration-200 ease-linear hover:-translate-y-0.5 hover:border-accent ">
                                <span>GitHub repository</span>
                                <span className="text-sm">
                                    <ArrowUpRight width={17} className="text-accent"/>
                                </span>
                            </a>
                        </div>
                        <Button primary={true} classes="mt-4 self-end">Add new link</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}