export const ChevronDownIcon = ({ size = 20, className = ""}: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg" className={className}
        width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);