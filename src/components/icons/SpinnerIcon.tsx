export const SpinnerIcon = ({ size = 20 }: { size?: number }) => {
    return (
        <svg
            width={size} height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12" cy="12" r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.2"
            />
            <path
                d="M12 2a10 10 0 0 1 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    );
}