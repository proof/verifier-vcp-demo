"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MeshGradient } from "./common/mesh-gradient/mesh-gradient";
import { LinkItem, SimpleLink } from "./_components/link-item";
import { Footer } from "./_components/footer";
import {
  ArrowLeftArrowRightIcon,
  CardIcon,
  RobotFillIcon,
} from "./common/icons";

const USE_CASE_ROUTES: Record<string, string> = {
  merchant: "/payment",
  wire: "/wire",
  ap2: "/agent-authorization",
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const state = new URLSearchParams(hash).get("state");
    if (state && USE_CASE_ROUTES[state]) {
      router.replace(`${USE_CASE_ROUTES[state]}#${hash}`);
    }
  }, [router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <MeshGradient />
      <main className="flex w-full max-w-6xl flex-1 flex-col px-2 pt-6 pb-6 sm:px-6 sm:pt-16">
        <div className="mb-4 px-2 sm:px-0">
          <h1 className="sr-only">Proof</h1>
          <img
            className="mt-0 mb-6 h-8 w-auto self-start sm:mt-4 sm:mb-4 sm:h-12"
            src="/proof-logo-full-white.svg"
            alt=""
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm">
              Demo Proof&apos;s verifiable credential presentation.
            </p>
            <SimpleLink href="https://dev.proof.com/">
              Developer Docs
            </SimpleLink>
          </div>
        </div>
        <div className="mt-4 grid w-full grid-cols-1 items-start gap-8 px-2 md:grid-cols-[5fr_5fr]">
          <div>
            <div>
              <h2 className="mb-8 text-5xl leading-13 font-medium tracking-tight">
                Every business interaction with people on the internet has to
                answer the same{" "}
                <em className="text-primary-30 not-italic">3 questions.</em>
              </h2>
            </div>
            <div className="mb-8">
              <ul className="flex flex-col gap-3 text-lg">
                <li className="flex items-center">
                  <div className="ring-primary/25 mr-3 h-[8px] w-[8px] rounded-full bg-[var(--primary-50)] ring-4" />
                  Who is this?
                </li>
                <li className="flex items-center">
                  <div className="ring-primary/25 mr-3 h-[8px] w-[8px] rounded-full bg-[var(--primary-50)] ring-4" />
                  Says who?
                </li>
                <li className="flex items-center">
                  <div className="ring-primary/25 mr-3 h-[8px] w-[8px] rounded-full bg-[var(--primary-50)] ring-4" />
                  Did they authorize this?
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm leading-6 font-light">
                <strong className="font-medium">
                  Today, every business answers them on its own.
                </strong>
              </p>
              <p className="mb-4 text-sm leading-6 font-light">
                A customer fills out forms, uploads ID photos, waits for review,
                answers knowledge questions, and ends up with their personal
                information sitting in yet another database. Then they sign up
                for the next service and the whole thing starts over.
              </p>
              <p className="mb-4 text-sm leading-6 font-light">
                Same proofs, repeated, copied across dozens of databases the
                customer will never know about. Each one a target. Each one a
                gift to fraudsters and hackers.{" "}
                <strong className="font-medium">
                  AI is here to steal it all.
                </strong>
              </p>
              <p className="mb-4 text-sm leading-6 font-light">
                <strong className="font-medium">
                  Proof&apos;s Digital Credentials replace that with a digital
                  passport.
                </strong>{" "}
                Verified once by Proof, the credential lives in the
                person&apos;s wallet. Any business can confirm it on its own,
                against Proof&apos;s public Certificate Authority, without
                calling Proof. The CA is operated under WebTrust audit, the same
                trust framework as the certificate authorities behind every
                HTTPS website.
              </p>
              <p className="mb-4 text-sm font-light">
                <strong className="font-medium">
                  Verify once. Use everywhere.
                </strong>{" "}
                A credential issued once can be relied on many times. The same
                construction that took card fraud from rampant to rare in the
                1990s, applied to identity.
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-primary-30 mb-6 text-xs font-bold tracking-widest uppercase">
              Try a demo
            </h3>
            <div className="flex flex-col">
              <h4 className="mb-4 text-xs font-bold tracking-widest text-white/72 uppercase">
                For customers
              </h4>
              <div className="mb-3">
                <LinkItem
                  href="/payment"
                  title="Payment"
                  subtitle="Verify your identity to complete a concert ticket purchase."
                  icon={
                    <CardIcon className="text-primary-30 h-[24px] w-[24px]" />
                  }
                />
              </div>
              <div className="mb-3">
                <LinkItem
                  href="/wire"
                  title="Wire Transfer"
                  subtitle="Verify your identity to authorize a wire transfer."
                  icon={
                    <ArrowLeftArrowRightIcon className="text-primary-30 h-[24px] w-[24px]" />
                  }
                />
              </div>
              <div className="mb-3">
                <LinkItem
                  href="/agent-authorization"
                  title="Agent Authorization"
                  subtitle="Verify your identity to delegate scoped intent to an AI agent to shop on your behalf."
                  icon={
                    <RobotFillIcon className="text-primary-30 h-[24px] w-[24px]" />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
