import { useEffect } from "react";
import {
  useBlocker,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import CheckoutStep4 from "@/components/cart/CheckoutStep4";
import { getPendingCheckoutSession } from "@/utils/auth/pendingCheckoutSession";

function CheckoutStep3Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId =
    location.state?.sessionId ??
    searchParams.get("session_id") ??
    getPendingCheckoutSession()?.sessionId ??
    null;

  useEffect(() => {
    if (!sessionId) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blocker = useBlocker(
    ({ historyAction }) => Boolean(sessionId) && historyAction === "POP",
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      navigate("/", { replace: true });
    }
  }, [blocker, navigate]);

  if (!sessionId) return null;

  return <CheckoutStep4 sessionId={sessionId} />;
}

export default CheckoutStep3Page;
