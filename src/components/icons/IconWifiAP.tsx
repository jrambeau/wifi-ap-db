interface IconWifiAPProps {
  size?: number;
  className?: string;
}

export default function IconWifiAP({ size = 24, className = '' }: IconWifiAPProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* WiFi Logo officiel - structure en arcs */}
      <g transform="translate(2, 2)">
        {/* Arc extérieur */}
        <path d="M 0 12 Q 0 6, 5 3 Q 10 0, 14 0 Q 18 0, 23 3 Q 28 6, 28 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arc intermédiaire 1 */}
        <path d="M 4 12 Q 4 8, 7.5 6 Q 11 4, 14 4 Q 17 4, 20.5 6 Q 24 8, 24 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arc intermédiaire 2 */}
        <path d="M 8 12 Q 8 10, 10.5 9 Q 12.5 8, 14 8 Q 15.5 8, 17.5 9 Q 20 10, 20 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Point central */}
        <circle cx="14" cy="14" r="2" fill="currentColor" />
      </g>
      
      {/* Database - multiple disks */}
      <g transform="translate(20, 10)">
        <ellipse cx="6" cy="12" rx="4" ry="1.5" fill="white" />
        <ellipse cx="6" cy="12" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        
        <path d="M 2 12 L 2 10.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M 10 12 L 10 10.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <ellipse cx="6" cy="10.5" rx="4" ry="1.5" fill="white" />
        <ellipse cx="6" cy="10.5" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        
        <path d="M 2 10.5 L 2 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M 10 10.5 L 10 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <ellipse cx="6" cy="9" rx="4" ry="1.5" fill="white" />
        <ellipse cx="6" cy="9" rx="4" ry="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </g>
    </svg>
  );
}
