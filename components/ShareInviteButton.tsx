"use client";

import { useId, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { hostLink, inviteLink } from "@/lib/host-session";

interface Props {
  roomName: string;
  hostKey?: string;
}

export default function ShareInviteButton({ roomName, hostKey }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [link, setLink] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const title = hostKey ? "Host access" : "Guest invite";

  function open() {
    setLink(hostKey ? hostLink(roomName, hostKey) : inviteLink(roomName));
    setCopyStatus("");
    dialog.current?.showModal();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus("Link copied.");
    } catch {
      setCopyStatus("Select the link and copy it manually.");
    }
  }

  return (
    <>
      <button
        type="button"
        ref={trigger}
        aria-haspopup="dialog"
        className={hostKey ? "rounded-md bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20" : "lk-button"}
        onClick={open}
      >
        {hostKey ? "Show host QR" : "Invite"}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="m-auto max-h-[90dvh] w-[min(90vw,22rem)] overflow-auto rounded-xl border border-white/15 bg-neutral-900 p-0 text-white shadow-xl backdrop:bg-black/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onClose={() => {
          setLink("");
          trigger.current?.focus();
        }}
      >
        <div className="space-y-4 p-5">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          {hostKey && <p className="text-sm">Anyone who scans this code or opens this link can host this meeting.</p>}
          {link && (
            <QRCodeSVG
              value={link}
              size={256}
              marginSize={4}
              title={title + " QR code"}
              role="img"
              className="mx-auto block h-auto max-w-full"
            />
          )}
          <input
            aria-label={hostKey ? "Host link" : "Invite link"}
            readOnly
            value={link}
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded border border-white/20 bg-black/40 px-2 py-1 text-sm"
          />
          <div className="flex justify-between gap-2">
            <button type="button" className="lk-button" onClick={copyLink}>
              {hostKey ? "Copy host link" : "Copy link"}
            </button>
            <button type="button" className="lk-button" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          <p role="status" className="text-sm empty:hidden">{copyStatus}</p>
        </div>
      </dialog>
    </>
  );
}
