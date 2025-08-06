"use client";

import { SliceSimulator } from "@slicemachine/slice-simulator-react";
import { SliceZone } from "@prismicio/react";
import { components } from "../../../slices";

export default function SliceSimulatorPage() {
  return (
    <SliceSimulator
      sliceZone={({ slices }) => (
        <SliceZone slices={slices} components={components} />
      )}
    />
  );
}