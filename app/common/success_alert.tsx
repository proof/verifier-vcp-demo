"use client";
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Receipt } from "./receipt";
import { Button } from "./button";

const CONFETTI_COLORS = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#a78bfa",
  "#ffffff",
];

function makeConfettiPieces() {
  return Array.from({ length: 75 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    width: Math.random() * 6 + 4,
    height: Math.random() * 9 + 5,
    delay: `${Math.random() * 0.8}s`,
    duration: `${Math.random() * 1.2 + 1}s`,
    initialRotation: Math.random() * 360,
    skewX: (Math.random() - 0.5) * 40,
    skewY: (Math.random() - 0.5) * 20,
  }));
}

export function SuccessAlert({
  showSuccess,
  message = "You've authorized your purchase",
  lineItems,
  totals,
  children,
  onDismiss,
}: {
  // Typically derived from vp_token presence in the URL hash, passed down from the parent
  showSuccess?: boolean;
  message?: string;
  lineItems?: ComponentProps<typeof Receipt>["lineItems"];
  totals?: ComponentProps<typeof Receipt>["totals"];
  children?: ReactNode;
  onDismiss?: () => void;
}) {
  // The three popup states allow us to display a closing animation to the popup before it unmounts
  const [popupState, setPopupState] = useState<"open" | "closing" | "closed">(
    showSuccess ? "open" : "closed",
  );
  const [confettiPieces] = useState<ReturnType<typeof makeConfettiPieces>>(
    () => (typeof window === "undefined" ? [] : makeConfettiPieces()),
  );

  useEffect(() => {
    if (showSuccess) {
      // Syncing showSuccess prop to animation state machine.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPopupState("open");
    }
  }, [showSuccess]);

  const handleClose = () => {
    onDismiss?.();
    setPopupState("closing");
    setTimeout(() => setPopupState("closed"), 300);
  };

  return (
    <>
      {popupState !== "closed" && (
        <div
          key={popupState}
          className={`absolute top-0 right-0 bottom-0 left-0 overflow-hidden bg-gray-950/60 backdrop-blur-[2px] ${popupState === "closing" ? "animate-fade-out" : "animate-fade-in"}`}
        >
          <div
            key={popupState}
            className={`bg-primary flex-column relative mx-auto max-w-md items-center justify-center rounded-3xl px-6 py-10 text-2xl font-bold text-white ${popupState === "closing" ? "animate-pop-out" : "animate-pop-in"}`}
          >
            {popupState === "open" &&
              confettiPieces.map((piece) => (
                <div
                  key={piece.id}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0"
                  style={{
                    left: piece.left,
                    animationName: "confetti-fall",
                    animationDuration: piece.duration,
                    animationDelay: piece.delay,
                    animationFillMode: "both",
                  }}
                >
                  <div
                    style={{
                      width: piece.width,
                      height: piece.height,
                      backgroundColor: piece.color,
                      borderRadius: "2px",
                      transform: `rotate(${piece.initialRotation}deg) skewX(${piece.skewX}deg) skewY(${piece.skewY}deg)`,
                    }}
                  />
                </div>
              ))}
            <div className="absolute top-0 right-0">
              <Button
                onClick={handleClose}
                label="Close"
                className="rounded-full p-0"
                variant="light"
              >
                <div className="rotate-45 text-5xl">+</div>
              </Button>
            </div>
            <h2 className="mb-4">
              Success!{" "}
              <span className="animate-wiggle inline-block origin-bottom-left">
                🎉
              </span>
            </h2>
            <p className={lineItems || children ? "mb-8" : ""}>{message}</p>
            {children}
            {lineItems && totals && (
              <div className="relative max-w-sm rounded-t-3xl border-t border-r border-l border-white px-6 py-12">
                <Receipt
                  variant="light"
                  lineItems={lineItems}
                  totals={totals}
                />
                <div className="absolute -right-[1px] -bottom-[1px] -left-[1px]">
                  <svg
                    aria-hidden="true"
                    className="-mt-1 block w-full"
                    height="18"
                    viewBox="0 -1 533 42"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 37.91C21.5 37.91 17.5 0.909973 38.5 0.909973S55.5 37.91 76.5 37.91S93.5 0.909973 114.5 0.909973S131.5 37.91 152.5 37.91S169.5 0.909973 190.5 0.909973S207.5 37.91 228.5 37.91S245.5 0.909973 266.5 0.909973S283.5 37.91 304.5 37.91S321.5 0.909973 342.5 0.909973S359.5 37.91 380.5 37.91S397.5 0.909973 418.5 0.909973S435.5 37.91 456.5 37.91S473.5 0.909973 494.5 0.909973S511.5 37.91 532.5 37.91"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            )}
            <div className="mt-8 w-full md:hidden">
              <Button
                className="w-full max-w-sm border border-white"
                onClick={() => {
                  document
                    .querySelector("#protocol-block")
                    ?.scrollIntoView({ behavior: "smooth" });
                  handleClose();
                }}
              >
                <div className="text-lg">View credential presentation</div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
