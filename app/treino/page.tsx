"use client";
import { Standard } from "@typebot.io/react";

export default function PersonalHookePage() {
  return (
    // 'h-[100dvh]' garante que o chat ocupe a altura real da tela do celular
    <div className="w-full h-[100dvh] bg-hooke-50 flex flex-col overscroll-none">
      <Standard
        typebot="my-typebot-5ingwzy" 
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}