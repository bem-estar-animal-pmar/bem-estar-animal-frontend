"use client";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Tabs = ({ children, className = "", ...props }: TabsProps) => {
    return (
        <div 
            role="tablist"
            className={`flex mb-4 overflow-x-auto ${className}`}
            {...props}
        >
            {children}
            <div className="flex-1 border-b-2 border-default-border"></div>
        </div>
    );
};