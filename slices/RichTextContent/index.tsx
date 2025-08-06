import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";

/**
 * Props for `RichTextContent`.
 */
export type RichTextContentProps = SliceComponentProps<Content.RichTextContentSlice>;

/**
 * Custom serializer for rich text elements to match storybook/eminent styles
 */
const richTextSerializer: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight heading-dynamic-default">
      {children}
    </h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight heading-dynamic-default">
      {children}
    </h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight heading-dynamic-default">
      {children}
    </h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight heading-dynamic-default">
      {children}
    </h4>
  ),
  heading5: ({ children }) => (
    <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight heading-dynamic-default">
      {children}
    </h5>
  ),
  heading6: ({ children }) => (
    <h6 className="text-base sm:text-lg lg:text-xl font-medium tracking-tight leading-tight heading-dynamic-default">
      {children}
    </h6>
  ),
  paragraph: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed">
      {children}
    </p>
  ),
  list: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2">
      {children}
    </ul>
  ),
  oList: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2">
      {children}
    </ol>
  ),
  listItem: ({ children }) => (
    <li className="text-base leading-relaxed">
      {children}
    </li>
  ),
};

/**
 * Component for "RichTextContent" Slices.
 */
const RichTextContent = ({ slice }: RichTextContentProps) => {
  // Build dynamic styles object from the spacing inputs
  const dynamicStyles: React.CSSProperties = {};
  
  // Cast to any to handle newly added fields until types are fully updated
  const primary = slice.primary as any;
  
  if (primary.padding) {
    dynamicStyles.padding = primary.padding;
  }
  if (primary.margin) {
    dynamicStyles.margin = primary.margin;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`text-${slice.primary.text_alignment} text-${slice.primary.text_size} ${
        slice.primary.background_color !== 'none' ? `bg-${slice.primary.background_color}` : ''
      }`}
      style={dynamicStyles}
    >
      <div className="prose-custom max-w-none">
        <PrismicRichText field={slice.primary.content} components={richTextSerializer} />
      </div>
    </section>
  );
};

export default RichTextContent;