export default function FormGroup({ label, type, name, id, value, onChange }) {
    return (
        <div className="font-figtree flex flex-col items-left gap-2 w-full">
            <label 
            className="font-semibold text-detail"
            htmlFor={id}
            >{label}</label>
            <input 
            type={type} 
            name={name} 
            id={id}
            placeholder={label}
            className="bg-white border border-detail rounded-md p-2"
            value={value}
            onChange={onChange}
            />
        </div>
    )
}