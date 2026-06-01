export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const variants = {
    primary: "bg-berry text-white hover:bg-cocoa shadow-soft",
    secondary: "bg-white text-cocoa hover:bg-peach/50 border border-cocoa/10",
    ghost: "bg-transparent text-cocoa hover:bg-white/70",
    outline: "bg-transparent text-cocoa border border-cocoa/15 hover:border-berry hover:text-berry"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base"
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
