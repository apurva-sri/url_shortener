function Heading({
  title,

  subtitle,

  center = false,
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {subtitle && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
          {subtitle}
        </p>
      )}

      <h2 className="font-heading text-5xl font-bold leading-tight">{title}</h2>
    </div>
  );
}

export default Heading;
