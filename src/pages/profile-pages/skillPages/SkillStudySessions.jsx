import { ArrowRight, CalendarDays, Clock3, Play } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import Button from "../../../components/Button";

const fakeSessions = [
    {
        id: 1,
        date: "Today",
        duration: 45,
        focus: "Working with async functions",
        note: "Practiced handling promises and error states.",
    },
    {
        id: 2,
        date: "Yesterday",
        duration: 30,
        focus: "Understanding closures",
        note: "Reviewed examples and completed two exercises.",
    },
    {
        id: 3,
        date: "May 18, 2026",
        duration: 60,
        focus: "Building reusable components",
        note: "Applied component composition to a small project.",
    },
];

export default function SkillStudySessions() {
    const { skill } = useOutletContext();
    const totalMinutes = fakeSessions.reduce((total, session) => total + session.duration, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return (
        <div className="bg-card-background shadow rounded p-section flex flex-col gap-6">
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded bg-background p-4">
                    <p className="detail">Sessions completed</p>
                    <p className="mt-1 text-2xl font-semibold text-text">11</p>
                </div>
                <div className="rounded bg-background p-4">
                    <p className="detail">Time studied</p>
                    <p className="mt-1 text-2xl font-semibold text-text">
                        6h 45m
                    </p>
                </div>
                <div className="rounded bg-background p-4">
                    <p className="detail">Last studied</p>
                    <p className="mt-1 text-2xl font-semibold text-text">
                        Jul 18
                    </p>
                </div>
            </div>
            <Button primary={true} classes="self-end">
                <Link to="/user/studysessions" className="flex items-center gap-2 ">
                    <Play size={17} fill="currentColor" />
                    Start study session
                </Link>
            </Button>

            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">Recent activity</h3>

                {fakeSessions.map((session) => (
                    <article key={session.id} className="flex flex-col gap-3 rounded bg-background p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3>{session.focus}</h3>
                            <p className="detail mt-1">{session.note}</p>
                        </div>
                        <div className="flex shrink-0 gap-4 text-sm font-semibold text-detail sm:flex-col sm:items-end sm:gap-1">
                            <span className="inline-flex items-center gap-1"><CalendarDays size={15} /> {session.date}</span>
                            <span className="inline-flex items-center gap-1"><Clock3 size={15} /> {session.duration} min</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}