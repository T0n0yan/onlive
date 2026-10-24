import { memo } from "react";
import type { ArtSpec } from "../shop-core/types.ts";
import { CakeArt } from "./CakeArt.tsx";
import { FashionArt } from "./FashionArt.tsx";
import { FlowerArt } from "./FlowerArt.tsx";
import { GroceryArt } from "./GroceryArt.tsx";
import { PerfumeArt } from "./PerfumeArt.tsx";

/** Illustrations stand in for product photos; a real shop swaps this for <img>. */
export const ProductArt = memo(function ProductArt({ art }: { art: ArtSpec }) {
  switch (art.kind) {
    case "perfume":
      return <PerfumeArt spec={art} />;
    case "cake":
      return <CakeArt spec={art} />;
    case "flowers":
      return <FlowerArt spec={art} />;
    case "fashion":
      return <FashionArt spec={art} />;
    case "grocery":
      return <GroceryArt spec={art} />;
  }
});
