export function formatKES(amount) {
  if (amount == null) return "KES 0";
  const num = Number(amount);
  if (num >= 1_000_000_000) return `KES ${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `KES ${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `KES ${(num / 1_000).toFixed(1)}K`;
  return `KES ${num.toLocaleString()}`;
}

export default function KESFormat({ amount, className = "amount" }) {
  return <span className={className}>{formatKES(amount)}</span>;
}
