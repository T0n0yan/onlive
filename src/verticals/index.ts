import type { FeatureId, VerticalConfig, VerticalId } from "../shop-core/types.ts";
import { cake } from "./cake.ts";
import { fashion } from "./fashion.ts";
import { flowers } from "./flowers.ts";
import { grocery } from "./grocery.ts";
import { perfume } from "./perfume.ts";

/** Adding a new business type = one data file + one line here. */
export const VERTICALS: Record<VerticalId, VerticalConfig> = { perfume, cake, flowers, fashion, grocery };

export const VERTICAL_IDS = Object.keys(VERTICALS) as VerticalId[];

export const defaultFeaturesFor = (id: VerticalId): FeatureId[] => VERTICALS[id].defaultFeatures;
