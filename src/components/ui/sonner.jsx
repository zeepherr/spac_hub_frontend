import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

function Toaster({
  className = "",
  toastOptions = {},
  style,
  icons,
  ...props
}) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      duration={4000}
      visibleToasts={3}
      gap={10}
      closeButton={false}
      offset={24}
      mobileOffset={16}
      {...props}
      className={`spechub-toaster ${className}`}
      icons={{
        success: <CircleCheckIcon size={19} />,
        info: <InfoIcon size={19} />,
        warning: <TriangleAlertIcon size={19} />,
        error: <OctagonXIcon size={19} />,
        loading: <Loader2Icon size={19} className="animate-spin" />,
        ...icons,
      }}
      style={{
        "--normal-bg": "var(--hardware-surface)",
        "--normal-text": "var(--hardware-black)",
        "--normal-border": "var(--hardware-border)",
        "--border-radius": "12px",
        ...style,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions.classNames,
          toast: ["spechub-toast", toastOptions.classNames?.toast]
            .filter(Boolean)
            .join(" "),
        },
      }}
    />
  );
}

export { Toaster };
