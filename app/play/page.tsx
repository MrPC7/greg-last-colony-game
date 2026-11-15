import { preload } from "react-dom";
import { asset } from "@/lib/asset";
import PlayScreen from "./PlayScreen";

// Must match the media query in components/map/map.module.css.
const MAP_SM_MEDIA = "(max-width: 640px) and (max-resolution: 2dppx)";

/** Map stage. The map image is the LCP element but is only painted after hydration
 *  (CSS background), so preload the variant the CSS will pick (and Orbi's sprite, which
 *  is always on the map; the hero's depends on the saved character) from the static HTML. */
export default function PlayPage() {
  preload(asset("/img/map-sm.webp"), { as: "image", fetchPriority: "high", media: MAP_SM_MEDIA });
  preload(asset("/img/map.webp"), { as: "image", fetchPriority: "high", media: `not all and ${MAP_SM_MEDIA}` });
  preload(asset("/img/sprites/orbi.webp"), { as: "image", type: "image/webp" });
  return <PlayScreen />;
}
