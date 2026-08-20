function Leaf({ x, y, angle, size = 1 }: { x: number; y: number; angle: number; size?: number }) {
  return (
    <path
      d={`M0 0 C ${4 * size} ${-2 * size}, ${8 * size} ${-1 * size}, ${11 * size} 0 C ${8 * size} ${1 * size}, ${4 * size} ${2 * size}, 0 0Z`}
      transform={`translate(${x} ${y}) rotate(${angle})`}
      fill="currentColor"
      opacity="0.9"
    />
  );
}

export default function LeafSprig({ className = "h-24 w-24 text-dorado" }: { className?: string }) {
  const leaves = [
    { x: 18, y: 78, angle: -55, size: 1 },
    { x: 26, y: 62, angle: -35 },
    { x: 34, y: 46, angle: -20, size: 0.9 },
    { x: 40, y: 30, angle: -10, size: 0.85 },
    { x: 44, y: 15, angle: 5, size: 0.75 },
  ];
  const leavesRight = leaves.map((l) => ({ ...l, x: l.x + 14, angle: 180 - l.angle }));

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <path
        d="M22 90C24 65 30 40 48 12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      {leaves.map((l, i) => (
        <Leaf key={`l-${i}`} {...l} />
      ))}
      {leavesRight.map((l, i) => (
        <Leaf key={`r-${i}`} {...l} />
      ))}
      <circle cx="48" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}
