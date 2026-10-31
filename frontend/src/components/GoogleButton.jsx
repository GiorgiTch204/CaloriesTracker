import { useEffect, useRef, useState } from "react";
import api, { apiErrorMessage } from "../lib/api";
import { useToast } from "../context/ToastContext";

// Renders Google's own "Sign in with Google" button via Google Identity
// Services once the backend reports a GOOGLE_CLIENT_ID is configured.
// Falls back to an explanatory disabled state otherwise, so the UI never
// ships a dead button.
export default function GoogleButton({ onCredential }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("checking"); // checking | ready | disabled

  useEffect(() => {
    let cancelled = false;

    api
      .get("/auth/google/config")
      .then(({ data }) => {
        if (cancelled) return;
        if (!data.enabled) {
          setStatus("disabled");
          return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          if (cancelled || !window.google || !containerRef.current) return;
          window.google.accounts.id.initialize({
            client_id: data.clientId,
            callback: (resp) => onCredential(resp.credential)
          });
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            shape: "pill"
          });
          setStatus("ready");
        };
        script.onerror = () => setStatus("disabled");
        document.body.appendChild(script);
      })
      .catch(() => setStatus("disabled"));

    return () => {
      cancelled = true;
    };
  }, [onCredential]);

  if (status === "disabled") {
    return (
      <button
        type="button"
        disabled
        title="Google sign-in isn't configured on this server yet (set GOOGLE_CLIENT_ID in backend/.env)"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-400 dark:border-ink-700"
      >
        Continue with Google — not configured
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
      {status === "checking" && (
        <button
          type="button"
          disabled
          className="w-full rounded-full border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-400 dark:border-ink-700"
        >
          Continue with Google
        </button>
      )}
    </div>
  );
}

export function useGoogleSignIn(onSuccess) {
  const { notify } = useToast();

  return async function handleCredential(credential) {
    try {
      const { data } = await api.post("/auth/google", { credential });
      onSuccess(data);
    } catch (err) {
      notify(apiErrorMessage(err, "Google sign-in failed"), "error");
    }
  };
}
