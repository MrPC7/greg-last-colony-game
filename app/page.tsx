import { asset } from "@/lib/asset";

// Phase 0 placeholder — replaced by the title screen in Phase 1.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-black p-6 text-center text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/img/keyart.jpg")}
        alt="Greg y la Colonia Última"
        className="w-full max-w-3xl rounded-lg"
      />
      <h1 className="text-2xl font-bold">Greg y la Colonia Última</h1>
      <p className="text-sm opacity-70">NASA Space Apps Challenge 2026 · Cajamarca</p>
    </main>
  );
}
