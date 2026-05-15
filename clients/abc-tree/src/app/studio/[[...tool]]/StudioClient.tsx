"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(() => import("./Studio").then((mod) => mod.Studio), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-white text-base text-slate">
      Loading Sanity Studio…
    </div>
  ),
});

export default function StudioClient() {
  return <Studio />;
}
