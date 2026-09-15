import { motion } from "framer-motion";

export default function SkeletonLoadingText({ text = "AI is typing" }) {
  return (
    <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs py-1">
      <span>{text}</span>
      <span className="flex items-center gap-0.5">
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
          className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"
        />
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
          className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"
        />
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
          className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"
        />
      </span>
    </div>
  );
}
