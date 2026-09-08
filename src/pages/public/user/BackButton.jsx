import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";


function BackButton({
    label = "Back",
    fallbackPath = "/user",
}) {
    const navigate = useNavigate();
    const handleBack = () => {

        if(window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate(fallbackPath);
    };

    return (
        <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
    >
        <ArrowLeft size={18} />
        {label}
    </button>
    );
}

export default BackButton