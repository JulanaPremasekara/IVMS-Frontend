export const VerificationInput = ({
  label,
  color,
  value,
  onChange,
  placeholder = "0",
  className = "",
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase text-center">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-16 border rounded-lg p-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-opacity-20 ${
        color === "red"
          ? "border-red-200 focus:ring-red-500"
          : "border-emerald-200 focus:ring-emerald-500"
      } ${className}`}
    />
  </div>
);