import { useParams } from "react-router-dom";
import useProject from "../../hooks/useProject";
import Loader from "../../components/Loader";
import Description from "../../components/projectPage/Description";
import Reflection from "../../components/projectPage/Reflection";
import RefInput from "../../components/projectPage/RefInput";
import Lesson from "../../components/projectPage/Lesson";
import LessonForm from "../../components/projectPage/LessonForm";
import TechStack from "../../components/projectPage/TechStack";
import NewSkillForm from "../../components/projectPage/newSkillForm";
import LinkForm from "../../components/projectPage/LinkForm";
import ProjectHeader from "../../components/projectPage/ProjectHeader";
import Link from "../../components/projectPage/Link"
import { getUpdateTime } from "../../services/function";

export default function Project() {

    const { goalId , projectId } = useParams()

    //from hooks
    const { projectData, loadingProject, error, updateProjectData } = useProject(goalId, projectId)

    const date = new Date(projectData?.latestUpdate ? projectData?.latestUpdate : projectData?.createdAt);


    async function updateProject(dataToUpdate){
        try{
            await updateProjectData(dataToUpdate);
        }catch(err){
            console.log(err);
        }
    }
    
    if(loadingProject){
        return (
            <section className="page">
                <Loader/>
            </section>
        )
    }
    if(error){
        return (
            <section className="page">
                <p>Error loading project data.</p>
            </section>
        )
    }
    if(!projectData){
        return (
            <section className="page">
                <p>Project not found.</p>
            </section>
        )
    }
    return (
        <section className="page flex flex-col gap-3">
            <ProjectHeader
                goalId={goalId}
                updateTime={getUpdateTime(date)}
                updateProject={updateProject}
                name={projectData?.name}
                briefDescription={projectData?.briefDescription}
                imageUrl={projectData?.imageUrl}
                techStack={projectData?.techStack}
                createdAt={projectData?.createdAt}
            />

            <div className="project-grid">
                <div className="flex flex-col gap-4">
                    <Description
                        description={projectData?.description}
                        updateProject={updateProject}
                    />

                    <div id="reflections" className="project-card">
                        <h3 className="text-2xl font-semibold">Reflections</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            {
                                projectData.reflections ?
                                projectData.reflections.map(reflection=>{
                                    return (
                                        <Reflection
                                            key={reflection.id}
                                            reflection={reflection}
                                            updateProject={updateProject}
                                        />
                                    )
                                }) :
                                null
                            }
                            <RefInput updateProject={updateProject} />
                        </div>
                    </div>

                    <div id="lessons" className="project-card">
                        <h3 className="text-2xl font-semibold">Lessons learned</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            {
                                projectData.lessonsLearned && projectData.lessonsLearned.length > 0 ?
                                projectData.lessonsLearned.map(lessonLearned=>{
                                    return (
                                        <Lesson
                                            key={lessonLearned.id}
                                            lessonLearned={lessonLearned}
                                            updateProject={updateProject}
                                        />
                                    )
                                }) :
                                <div className="rounded-xl border border-dashed border-accent bg-background p-4 text-sm text-detail">
                                    No lessons added yet!
                                </div>
                            }
                            <LessonForm updateProject={updateProject}/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    
                    <div className="project-card">
                        <h3 className="text-xl font-semibold">Tech stack</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {
                                projectData.techStack ?
                                projectData.techStack.map(skill=>{
                                    return (
                                        <TechStack
                                            key={skill}
                                            skill={skill}
                                            updateProject={updateProject}
                                        />
                                    )
                                }) :
                                null
                            }
                            <NewSkillForm updateProject={updateProject}/>
                        </div>
                    </div>

                    <div id="links" className="project-card">
                        <h3 className="text-xl font-semibold">Links</h3>
                        <div className="mt-3 flex flex-col gap-2">
                            {   projectData.links ?
                                projectData.links.map(link=>{
                                    return (
                                        <Link
                                            key={link.id}
                                            link={link}
                                            updateProject={updateProject}
                                        />
                                    )
                                }) :
                                null
                            }
                            <LinkForm updateProject={updateProject} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}