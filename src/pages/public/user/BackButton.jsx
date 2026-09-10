// BackButton.jsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";

function BackButton({ label = "Back", fallbackPath = "/user" }) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`mb-6 inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600 active:scale-95 ${GLASS_IDLE}`}
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}

export default BackButton;
