"use client"

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
    children: React.ReactNode;
}

export const ButtonTab = ({ isActive = false, children, className = "", ...props }: TabProps) => {
    const baseStyles = "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:shadow-ring-primary cursor-pointer";
    const stateStyles = isActive 
        ? "border-primary-border border-b-3 text-primary-fg" 
        : "border-default-border text-muted-fg hover:text-default-fg";

    return (
        <button 
            role="tab"
            aria-selected={isActive}
            className={`${baseStyles} ${stateStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};