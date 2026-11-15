import { preload } from "react-dom";
import { asset } from "@/lib/asset";
import TitleScreen from "./TitleScreen";

/** Title screen. The key art is the LCP element but is only painted after hydration
 *  (CSS background), so preload it from the static HTML. */
export default function TitlePage() {
  preload(asset("/img/keyart.webp"), { as: "image", fetchPriority: "high" });
  return <TitleScreen />;
}
