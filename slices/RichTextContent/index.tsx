import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

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
      className={`text-${slice.primary.text_alignment} text-${slice.primary.text_size} ${
        slice.primary.background_color !== 'none' ? `bg-${slice.primary.background_color}` : ''
      }`}
    >
      <div className="prose prose-lg max-w-none">
        <PrismicRichText field={slice.primary.content} />
      </div>
    </section>
  );
};

export default RichTextContent;