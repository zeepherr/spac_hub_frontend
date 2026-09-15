import {
  formatPrice,
  getCoverImage,
  getPersonName,
  getProductName,
} from "@/components/admin/support/admin-order/adminOrderContext.utils";
import { ADMIN_SUPPORT_ISSUES } from "@/components/support/support.constants";
import { useAdminCreateSupportCase } from "@/hook/support/useAdminCreateSupportCase";

import {
  Headphones,
  LoaderCircle,
  MessageSquareText,
  Package,
  ShieldCheck,
  Store,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const RECIPIENT_OPTIONS = [
  {
    value: "BUYER",
    label: "Buyer",
    shortLabel: "Buyer",
    description: "Open a private conversation with the buyer.",
    icon: UserRound,
  },
  {
    value: "SELLER",
    label: "Seller",
    shortLabel: "Seller",
    description: "Open a private conversation with the seller.",
    icon: Store,
  },
  {
    value: "BOTH",
    label: "Both separately",
    shortLabel: "Both",
    description: "Create two private conversations under this order.",
    icon: UsersRound,
  },
];

function AdminStartSupportDialog({ isOpen, order, onClose }) {
  const navigate = useNavigate();
  const createSupport = useAdminCreateSupportCase();

  const [recipient, setRecipient] = useState("BUYER");
  const [issueType, setIssueType] = useState("OTHER");
  const [message, setMessage] = useState("");

  /*
   * Reset the form when another order is opened.
   */
  useEffect(() => {
    if (!isOpen) return;

    setRecipient("BUYER");
    setIssueType("OTHER");
    setMessage("");
  }, [isOpen, order?.id]);

  /*
   * Lock page scrolling and support Escape.
   */
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !createSupport.isPending) {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, createSupport.isPending]);

  if (!order) {
    return null;
  }

  const productName = getProductName(order);
  const coverImage = getCoverImage(order);
  const buyerName = getPersonName(order.buyer, "Order buyer");
  const sellerName = getPersonName(order.seller, "Order seller");
  const trimmedMessage = message.trim();
  const isSubmitDisabled =
    createSupport.isPending || trimmedMessage.length === 0;

  function getRecipientDetail(option) {
    if (option.value === "BUYER") {
      return buyerName;
    }

    if (option.value === "SELLER") {
      return sellerName;
    }

    return "Buyer and seller remain in separate chats";
  }

  function handleClose() {
    if (createSupport.isPending) {
      return;
    }

    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!trimmedMessage || createSupport.isPending) {
      return;
    }

    const targetRoles =
      recipient === "BOTH" ? ["BUYER", "SELLER"] : [recipient];

    try {
      const response = await createSupport.mutateAsync({
        orderId: order.id,
        targetRoles,
        issueType,
        message: trimmedMessage,
      });

      const firstCase = response?.data?.cases?.[0]?.supportCase;

      setMessage("");
      setIssueType("OTHER");
      setRecipient("BUYER");

      onClose();

      if (firstCase?.id) {
        navigate(`/admin/chats?case=${firstCase.id}`);
      } else {
        navigate("/admin/chats");
      }
    } catch {
      // Error toast is handled by useAdminCreateSupportCase.
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-[120]
            flex items-end justify-center
            bg-neutral-950/45
            p-0 backdrop-blur-md
            sm:items-center sm:p-5
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !createSupport.isPending
            ) {
              handleClose();
            }
          }}
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-start-support-title"
            onSubmit={handleSubmit}
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 30,
              mass: 0.8,
            }}
            className="
              relative flex max-h-[96dvh] w-full
              max-w-2xl flex-col overflow-hidden
              rounded-t-3xl border border-white/70
              bg-white/80
              shadow-[0_32px_90px_rgba(0,0,0,0.22)]
              backdrop-blur-2xl
              sm:max-h-[90dvh] sm:rounded-3xl
            "
          >
            {/* Decorative glass lighting */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute -right-20 -top-24
                size-64 rounded-full bg-orange-300/20 blur-3xl
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute -bottom-24 -left-24
                size-64 rounded-full bg-neutral-300/30 blur-3xl
              "
            />

            {/* Header */}
            <header
              className="
                relative z-10 flex shrink-0 items-start
                justify-between gap-4
                border-b border-white/70
                bg-white/35 px-4 py-4
                sm:px-6 sm:py-5
              "
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="
                    flex size-11 shrink-0 items-center justify-center
                    rounded-2xl border border-orange-200/70
                    bg-orange-500 text-white
                    shadow-[0_8px_22px_rgba(249,115,22,0.24)]
                  "
                >
                  <Headphones size={21} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className="
                        text-[11px] font-bold uppercase
                        tracking-[0.14em] text-orange-600
                      "
                    >
                      Order support
                    </p>

                    <span
                      className="
                        inline-flex items-center gap-1
                        rounded-full border border-emerald-200/70
                        bg-emerald-50/80 px-2 py-0.5
                        text-[10px] font-bold text-emerald-700
                      "
                    >
                      <ShieldCheck size={11} />
                      Private
                    </span>
                  </div>

                  <h2
                    id="admin-start-support-title"
                    className="
                      mt-1 text-xl font-bold tracking-tight
                      text-neutral-950 sm:text-2xl
                    "
                  >
                    Start support conversation
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-neutral-500">
                    Contact an order participant and begin resolving the issue.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close support dialog"
                onClick={handleClose}
                disabled={createSupport.isPending}
                className="
                  inline-flex size-10 shrink-0 cursor-pointer
                  items-center justify-center rounded-xl
                  border border-white/80 bg-white/55
                  text-neutral-500 shadow-sm
                  backdrop-blur-xl transition
                  hover:bg-white hover:text-neutral-950
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-300
                  disabled:cursor-not-allowed disabled:opacity-40
                "
              >
                <X size={19} />
              </button>
            </header>

            {/* Scrollable body */}
            <div
              className="
                chat-scrollbar relative z-10 min-h-0
                flex-1 overflow-y-auto px-4 py-4
                sm:px-6 sm:py-5
              "
            >
              {/* Order context */}
              <section
                className="
                  grid grid-cols-[64px_minmax(0,1fr)]
                  items-center gap-3 rounded-2xl
                  border border-white/80
                  bg-white/55 p-3 shadow-sm
                  backdrop-blur-xl sm:grid-cols-[72px_minmax(0,1fr)_auto]
                "
              >
                <div
                  className="
                    flex size-16 items-center justify-center
                    overflow-hidden rounded-xl
                    border border-neutral-200/80
                    bg-white/70 sm:size-[72px]
                  "
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={productName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package size={25} className="text-neutral-300" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-950">
                    {productName}
                  </p>

                  <p className="mt-1 truncate text-xs text-neutral-500">
                    {order.orderNumber || `Order #${order.id}`}
                  </p>

                  <p className="mt-2 text-sm font-bold text-orange-600">
                    {formatPrice(order.agreedPrice)}
                  </p>
                </div>

                <div
                  className="
                    col-span-2 mt-1 flex items-center justify-between
                    rounded-xl border border-neutral-200/70
                    bg-white/50 px-3 py-2
                    text-xs sm:col-span-1 sm:mt-0 sm:block
                    sm:border-0 sm:bg-transparent sm:p-0 sm:text-right
                  "
                >
                  <span className="text-neutral-400 sm:block">
                    Participants
                  </span>

                  <span className="font-semibold text-neutral-700 sm:mt-1 sm:block">
                    Buyer · Seller
                  </span>
                </div>
              </section>

              {/* Recipient */}
              <fieldset className="mt-5">
                <legend className="text-sm font-bold text-neutral-900">
                  Who do you want to contact?
                </legend>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Buyer and Seller conversations remain private from each other.
                </p>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {RECIPIENT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = recipient === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setRecipient(option.value)}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative cursor-pointer overflow-hidden
                          rounded-2xl border p-3 text-left
                          transition-colors duration-200
                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-orange-300
                          ${
                            isSelected
                              ? `
                                border-orange-300
                                bg-orange-50/80
                                shadow-[0_8px_24px_rgba(249,115,22,0.12)]
                              `
                              : `
                                border-white/80 bg-white/45
                                hover:border-neutral-300
                                hover:bg-white/75
                              `
                          }
                        `}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="support-recipient-indicator"
                            className="
                              absolute inset-x-3 top-0 h-0.5
                              rounded-full bg-orange-500
                            "
                          />
                        )}

                        <div className="flex items-start gap-2.5">
                          <span
                            className={`
                              flex size-9 shrink-0 items-center
                              justify-center rounded-xl transition-colors
                              ${
                                isSelected
                                  ? "bg-orange-500 text-white"
                                  : "bg-neutral-100/80 text-neutral-500"
                              }
                            `}
                          >
                            <Icon size={17} />
                          </span>

                          <div className="min-w-0">
                            <p
                              className={`
                                text-sm font-bold
                                ${
                                  isSelected
                                    ? "text-orange-700"
                                    : "text-neutral-900"
                                }
                              `}
                            >
                              {option.shortLabel}
                            </p>

                            <p
                              className="
                                mt-0.5 line-clamp-2 text-[11px]
                                leading-4 text-neutral-500
                              "
                            >
                              {getRecipientDetail(option)}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Issue */}
              <div className="mt-5">
                <label
                  htmlFor="admin-support-issue"
                  className="text-sm font-bold text-neutral-900"
                >
                  Issue type
                </label>

                <div className="relative mt-2">
                  <MessageSquareText
                    size={17}
                    className="
                      pointer-events-none absolute left-3.5 top-1/2
                      -translate-y-1/2 text-neutral-400
                    "
                  />

                  <select
                    id="admin-support-issue"
                    value={issueType}
                    onChange={(event) => setIssueType(event.target.value)}
                    disabled={createSupport.isPending}
                    className="
                      h-12 w-full cursor-pointer appearance-none
                      rounded-xl border border-white/80
                      bg-white/65 py-0 pl-11 pr-10
                      text-sm font-semibold text-neutral-800
                      shadow-sm backdrop-blur-xl
                      outline-none transition
                      hover:border-neutral-300
                      focus:border-orange-400
                      focus:ring-4 focus:ring-orange-500/10
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    {ADMIN_SUPPORT_ISSUES.map((issue) => (
                      <option key={issue.value} value={issue.value}>
                        {issue.label}
                      </option>
                    ))}
                  </select>

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute right-4 top-1/2
                      -translate-y-1/2 text-xs text-neutral-400
                    "
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="admin-support-message"
                    className="text-sm font-bold text-neutral-900"
                  >
                    Initial message
                  </label>

                  <span
                    className={`
                      text-[11px] tabular-nums
                      ${
                        message.length >= 1900
                          ? "font-bold text-orange-600"
                          : "text-neutral-400"
                      }
                    `}
                  >
                    {message.length}/2000
                  </span>
                </div>

                <textarea
                  id="admin-support-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={2000}
                  rows={4}
                  disabled={createSupport.isPending}
                  placeholder="Explain the issue or information you need from this participant..."
                  className="
                    mt-2 min-h-28 w-full resize-none
                    rounded-2xl border border-white/80
                    bg-white/65 px-4 py-3
                    text-sm leading-6 text-neutral-900
                    shadow-sm backdrop-blur-xl
                    outline-none transition
                    placeholder:text-neutral-400
                    hover:border-neutral-300
                    focus:border-orange-400
                    focus:ring-4 focus:ring-orange-500/10
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                />

                <div
                  className="
                    mt-2 flex items-start gap-2
                    rounded-xl border border-orange-100/80
                    bg-orange-50/55 px-3 py-2.5
                    text-xs leading-5 text-neutral-600
                  "
                >
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  {recipient === "BOTH"
                    ? "Two separate support cases will be prepared. Buyer and Seller will not see each other’s messages."
                    : `This message will start a private Admin and ${recipient.toLowerCase()} conversation.`}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer
              className="
                relative z-10 flex shrink-0 flex-col-reverse
                gap-2 border-t border-white/70
                bg-white/45 px-4 py-4
                backdrop-blur-xl
                sm:flex-row sm:items-center sm:justify-end
                sm:px-6
              "
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={createSupport.isPending}
                className="
                  inline-flex h-11 cursor-pointer items-center
                  justify-center rounded-xl
                  border border-neutral-200/80
                  bg-white/65 px-5 text-sm font-bold
                  text-neutral-700 shadow-sm
                  transition hover:bg-white hover:text-neutral-950
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-neutral-300
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="
                  inline-flex h-11 cursor-pointer items-center
                  justify-center gap-2 rounded-xl
                  bg-neutral-950 px-5
                  text-sm font-bold text-white
                  shadow-[0_8px_22px_rgba(0,0,0,0.18)]
                  transition
                  hover:-translate-y-0.5 hover:bg-orange-500
                  hover:shadow-[0_10px_26px_rgba(249,115,22,0.25)]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-300
                  disabled:cursor-not-allowed
                  disabled:translate-y-0 disabled:opacity-45
                "
              >
                {createSupport.isPending ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Starting support...
                  </>
                ) : (
                  <>
                    <MessageSquareText size={17} />
                    Start support
                  </>
                )}
              </button>
            </footer>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AdminStartSupportDialog;
