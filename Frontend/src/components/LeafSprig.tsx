export default function LeafSprig({ className = "h-24 w-24 text-dorado" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <path
        d="M50 95C50 70 55 40 80 15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[
        [78, 20, 62, 14],
        [70, 32, 54, 27],
        [63, 45, 46, 41],
        [57, 58, 40, 55],
        [53, 71, 36, 69],
      ].map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 4} ${x2} ${y2}`}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
