import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={{
        padding: "2rem",
        backgroundColor: "#f3f4f6",
        minHeight: "200px"
      }}
    >
      <h1>Hero Slice - {slice.variation}</h1>
      <p>Title: {asText(slice.primary.title) || "No title"}</p>
      <p>Subtitle: {asText(slice.primary.subtitle) || "No subtitle"}</p>
    </section>
  );
};

export default Hero;