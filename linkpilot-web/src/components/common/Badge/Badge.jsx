function Badge({ children }) {
  return (
    <span className="rounded-full border border-neutral-300 px-4 py-1 text-sm font-medium">
      {children}
    </span>
  );
}

export default Badge;
