export const Loading = () => (
  <div className="h-8 w-8 text-sky-500" role="alert" aria-busy="true">
    <svg height="100%" viewBox="0 0 32 32" width="100%" className="animate-spin">
      <circle
        cx="16"
        cy="16"
        fill="none"
        r="14"
        strokeWidth="4"
        stroke="currentColor"
        opacity="0.2"
      />
      <circle
        cx="16"
        cy="16"
        fill="none"
        r="14"
        strokeWidth="4"
        stroke="currentColor"
        strokeDashoffset={60}
        strokeDasharray={80}
      />
    </svg>
  </div>
);
