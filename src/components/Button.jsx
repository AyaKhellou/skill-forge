export default function Button({ children, onClick , primary , classes, disabled }) {
    const primaryButtonStyle = "disabled:opacity-50 disabled:cursor-no-drop disabled:bg-detail disabled:border-detail disabled:text-background bg-primary text-background px-4 py-2 rounded-md font-bold cursor-pointer border-2 border-primary hover:bg-background hover:text-primary hover:border-primary transition-all duration-300 shadow " + classes;
    const secondaryButtonStyle = "disabled:opacity-50 disabled:cursor-no-drop disabled:border-detail disabled:text-detail disabled:bg-background  bg-background text-primary px-4 py-2 rounded-md font-bold cursor-pointer border-2 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 shadow " + classes;
    
    return (
        <button 
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={primary ? primaryButtonStyle : secondaryButtonStyle}>
            {children}
        </button>
    );
}