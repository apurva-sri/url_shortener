import clsx from "clsx";

function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-neutral-300 bg-white px-5 py-3 outline-none transition-all duration-300 focus:border-black",
        className,
      )}
      {...props}
    />
  );
}

export default Input;
