"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), { ssr: false });

export default function ClientToaster() {
  return (
    <Toaster
      position="top-center"
      visibleToasts={1}
      theme="dark"
      toastOptions={{
        className: "hooke-toast",
        style: {
          background: '#0a0a0a',
          color: '#fff',
          borderRadius: '0px',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'var(--font-inter)',
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          padding: '12px 20px',
        }
      }}
    />
  );
}
