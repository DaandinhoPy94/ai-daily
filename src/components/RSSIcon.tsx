interface RSSIconProps {
  className?: string;
}

export function RSSIcon({ className = "h-5 w-5" }: RSSIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
    >
      <path d="M3.429 2.4v3.086c9.446 0 17.115 7.669 17.115 17.114H24C24 13.257 15.743 5 6.4 5V2.4H3.429zM3.429 8.685v3.086c6.171 0 11.2 5.029 11.2 11.2h3.086c0-7.886-6.4-14.286-14.286-14.286zM6.514 16.457c1.2 0 2.171.971 2.171 2.171s-.971 2.172-2.171 2.172-2.172-.972-2.172-2.172.972-2.171 2.172-2.171z"/>
    </svg>
  );
}