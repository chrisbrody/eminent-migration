import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `RichTextContent`.
 */
export type RichTextContentProps = SliceComponentProps<Content.RichTextContentSlice>;

/**
 * Component for "RichTextContent" Slices.
 */
const RichTextContent = ({ slice }: RichTextContentProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={{
        padding: "2rem",
        backgroundColor: "#ffffff",
        minHeight: "100px"
      }}
    >
      <h2>Rich Text Content Slice</h2>
      <p>Content: {slice.primary?.content?.[0]?.text || "No content"}</p>
    </section>
  );
};

export default RichTextContent;