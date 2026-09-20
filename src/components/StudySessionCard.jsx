import { CalendarDays, Clock3 } from "lucide-react";
import {secondsToTime} from "../services/function";

export default function StudySessionCard({session}){
    return(
        <article className="flex flex-col gap-3 rounded bg-background p-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h3 className="mb-0!">{session.focus}</h3>
                <p className="detail mt-1">{session.note}</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-detail sm:flex-col sm:items-end sm:gap-1">
                <span className="inline-flex items-center gap-1"><CalendarDays size={15} /> {session.date}</span>
                <span className="inline-flex items-center gap-1"><Clock3 size={15} /> {secondsToTime(session.duration)}</span>
            </div>
        </article>
    )
}