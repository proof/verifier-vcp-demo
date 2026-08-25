"use client";
import { useRef, useState } from "react";
import { Dialog } from "../common/dialog";
import { Visualizer } from "../common/visualizer";

export function JwkModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [jwk, setJwk] = useState<Record<string, unknown> | null | undefined>(
    undefined,
  );

  const open = async () => {
    dialogRef.current?.showModal();
    setJwk(undefined);
    try {
      const response = await fetch("/api/jwk");
      setJwk(response.ok ? await response.json() : null);
    } catch {
      setJwk(null);
    }
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="cursor-pointer text-gray-600 transition-colors hover:text-gray-200"
      >
        JWK
      </button>
      <Dialog
        title="Request signing key (JWK)"
        onClose={close}
        dialogRef={dialogRef}
        maxWidthClassName="max-w-xl"
        buttons={[{ key: "close", label: "Close", onClick: close }]}
      >
        <p className="mb-3 text-sm text-gray-300">
          Public key the server uses to sign authorization request objects.
        </p>
        <Visualizer data={jwk} />
      </Dialog>
    </>
  );
}
