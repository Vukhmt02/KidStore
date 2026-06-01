export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-cocoa">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-berry focus:ring-4 focus:ring-berry/10 ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-xs font-medium text-berry">{error}</span>}
    </label>
  );
}
