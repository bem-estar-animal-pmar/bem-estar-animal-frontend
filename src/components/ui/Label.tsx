import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export const Label = ({ className = "", children, required, ...props }: LabelProps) => {
    return (
        <label
            className={`text-sm font-medium leading-none text-default-fg ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-btn-danger">{" "} *</span>}
        </label>
    );
};