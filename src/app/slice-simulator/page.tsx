import { SliceZone } from "@prismicio/react";
import { components } from "../../../slices";

export default function SliceSimulatorPage() {
  return <SliceZone slices={[]} components={components} />;
}