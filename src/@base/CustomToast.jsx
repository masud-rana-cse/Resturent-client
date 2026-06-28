export default function CustomToast({ msg, type }) {
  if (!msg) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl"
      style={{ animation: "slideUp 0.3s ease" }}
    >
      <div
        className={`absolute inset-0 rounded-xl ${type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
      />
      <span className="relative">{msg}</span>
    </div>
  );
}
