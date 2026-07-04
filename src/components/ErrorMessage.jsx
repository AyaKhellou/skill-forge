import { ShieldAlert } from 'lucide-react';

export default function ErrorMessage({ message }) {
    return(
        <p className="text-error">
            <ShieldAlert className="inline mr-2" />
            {message}
        </p>
    )
}