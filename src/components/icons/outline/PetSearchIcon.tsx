export const PetSearchIcon = ({ size = 20 }: { size?: number }) => (
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
        <mask id="cat-mask">
            <rect width="24" height="24" fill="white"/>
            <circle cx="19" cy="17" r="4.5" fill="black"/>
            <path d="m23 21-2.1-2.1" stroke="black" strokeWidth="5" strokeLinecap="round"/>
        </mask>
    </defs>

    <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" mask="url(#cat-mask)"/>

    <path d="M8 14v.5"/><path d="M16 14v.5"/>
    <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>

    {/* 3. Magnifying Glass */}
    <circle cx="19" cy="17" r="3"/>
    <path d="m23 21-1.9-1.9"/>
</svg>
);

