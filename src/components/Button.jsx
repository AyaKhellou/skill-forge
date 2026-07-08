export default function Button({ children, onClick , primary , classes }) {
    const primaryButtonStyle = "bg-primary text-background px-4 py-2 rounded-md font-bold cursor-pointer border-2 border-primary hover:bg-background hover:text-primary hover:border-primary transition-all duration-300  " + classes;
    const secondaryButtonStyle = "bg-background text-primary px-4 py-2 rounded-md font-bold cursor-pointer border-2 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 " + classes;
    
    return (
        <button 
        onClick={onClick}
        className={primary ? primaryButtonStyle : secondaryButtonStyle}>
            {children}
        </button>
    );
}