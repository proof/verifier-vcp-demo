type IconProps = {
  className?: string;
};

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 13H4V11H12V4L20 12L12 20V13Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M16 16V12L21 17L16 22V18H4V16H16ZM8 2V5.999L20 6V8H8V12L3 7L8 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RobotFillIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M13 4.055C17.5 4.552 21 8.367 21 13V22H3V13C3 8.367 6.5 4.552 11 4.055V1H13V4.055ZM12 18C13.3261 18 14.5979 17.4732 15.5355 16.5355C16.4732 15.5979 17 14.3261 17 13C17 11.6739 16.4732 10.4021 15.5355 9.46447C14.5979 8.52678 13.3261 8 12 8C10.6739 8 9.40215 8.52678 8.46447 9.46447C7.52678 10.4021 7 11.6739 7 13C7 14.3261 7.52678 15.5979 8.46447 16.5355C9.40215 17.4732 10.6739 18 12 18ZM12 16C11.2044 16 10.4413 15.6839 9.87868 15.1213C9.31607 14.5587 9 13.7956 9 13C9 12.2044 9.31607 11.4413 9.87868 10.8787C10.4413 10.3161 11.2044 10 12 10C12.7956 10 13.5587 10.3161 14.1213 10.8787C14.6839 11.4413 15 12.2044 15 13C15 13.7956 14.6839 14.5587 14.1213 15.1213C13.5587 15.6839 12.7956 16 12 16ZM12 14C12.2652 14 12.5196 13.8946 12.7071 13.7071C12.8946 13.5196 13 13.2652 13 13C13 12.7348 12.8946 12.4804 12.7071 12.2929C12.5196 12.1054 12.2652 12 12 12C11.7348 12 11.4804 12.1054 11.2929 12.2929C11.1054 12.4804 11 12.7348 11 13C11 13.2652 11.1054 13.5196 11.2929 13.7071C11.4804 13.8946 11.7348 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CardIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M22 10.1111V19.1111C22 19.3469 21.8946 19.573 21.7071 19.7397C21.5196 19.9064 21.2652 20 21 20H3C2.73478 20 2.48043 19.9064 2.29289 19.7397C2.10536 19.573 2 19.3469 2 19.1111V10.1111H22ZM22 7.55556H2V4.88889C2 4.65314 2.10536 4.42705 2.29289 4.26035C2.48043 4.09365 2.73478 4 3 4H21C21.2652 4 21.5196 4.09365 21.7071 4.26035C21.8946 4.42705 22 4.65314 22 4.88889V7.55556Z"
        fill="currentColor"
      />
    </svg>
  );
}
