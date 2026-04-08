"use client";
import { useId, useRef, useState } from "react";
import { clsx } from "clsx";

import { Button } from "./button";

// Collects the user's email and initiates the OID4VP authorization flow
export function AuthForm({
  email,
  setEmail,
  requestParams,
  endpoint,
}: {
  email: string;
  setEmail: (email: string) => void;
  requestParams: Record<string, string>;
  endpoint: string;
}) {
  const emailErrorId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  // Redirects to <endpoint> with <requestParams> as query parameters
  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setShowEmailError(true);
      emailRef.current?.focus();
      return;
    }
    setIsLoading(true);
    const params = new URLSearchParams(requestParams);
    window.location.href = `${endpoint}?${params}`;
  };

  return (
    <form onSubmit={handleAuthorize}>
      <label htmlFor="email" className="mb-4 flex flex-col gap-1">
        <span className="mb-2 text-base font-bold">
          Email <span className="text-red-400">*</span>
        </span>
        <input
          ref={emailRef}
          aria-required="true"
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          aria-invalid={showEmailError}
          value={email}
          aria-describedby={showEmailError ? emailErrorId : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (showEmailError) {
              setShowEmailError(false);
            }
          }}
          onBlur={() => {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!isValidEmail) {
              setShowEmailError(true);
            }
          }}
          placeholder="you@email.com"
          className={clsx(
            "w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-base text-white placeholder-gray-400 transition-colors",
            showEmailError && "border-red-400",
          )}
        />
        <div role="alert" aria-live="polite">
          {showEmailError && (
            <span id={emailErrorId} className="text-xs text-red-400">
              Enter a valid email address
            </span>
          )}
        </div>
      </label>
      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="w-full"
      >
        {isLoading ? "Authorizing..." : "Authorize"}
      </Button>
      <div className="mt-2">
        <p className="text-xs/5 font-light text-gray-400">
          By clicking &quot;Authorize,&quot; you are agreeing to{" "}
          <a
            href="https://www.proof.com/legal/general-terms"
            className="underline hover:text-gray-200"
          >
            General Terms
          </a>
          . For information on our privacy and data use practices please see{" "}
          <a
            href="https://www.proof.com/legal/privacy-policy"
            className="underline hover:text-gray-200"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
