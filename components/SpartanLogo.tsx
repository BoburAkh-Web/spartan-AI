type Props = {
  size?: number;
  className?: string;
};

/** Spartan dubulg'a logotipi — doira badge ichida, orqaga oqib turgan yol bilan. */
export function SpartanLogo({ size = 28, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="54"
        r="33"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <g transform="translate(4,6) scale(0.92)">
        <path d="M32,26 C36,10 52,0 68,4 C80,7 90,16 90,28 C86,20 76,12 62,11 C68,16 76,20 82,24 C76,22 66,17 58,16 C63,20 70,24 74,29 C66,26 56,20 48,19 C42,19 36,21 32,26 Z" />
        <path
          fillRule="evenodd"
          d="M56,20 C44,20 34,26 28,36 L20,50 L16,58 L23,56 L25,62
             C24,68 24,74 28,80 L44,82
             C48,80 50,72 48,64 C52,62 60,60 68,54
             C72,46 70,30 62,21 C60,19 58,19 56,20 Z
             M21.5,49 A4.5,2 0 1 1 30.5,49 A4.5,2 0 1 1 21.5,49 Z"
        />
      </g>
      <path
        fillRule="evenodd"
        d="M44,85 C36,90 26,92 28,98 L72,98 C74,92 64,90 56,85 Z
           M48,89.5 L52,89.5 L51.5,88 L48.5,88 Z
           M46.5,95 L53.5,95 L52.5,92.5 L47.5,92.5 Z"
      />
    </svg>
  );
}
