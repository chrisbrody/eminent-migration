import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `RichTextContent`.
 */
export type RichTextContentProps = SliceComponentProps<Content.RichTextContentSlice>;

/**
 * Component for "RichTextContent" Slices.
 */
const RichTextContent = ({ slice }: RichTextContentProps) => {
  // Safe access to slice fields with null checks
  if (!slice?.primary) {
    return <div>No content available</div>;
  }

  // Get styling options with safe access and proper typing
  const alignment = slice.primary.text_alignment || 'left';
  const textSize = slice.primary.text_size || 'medium';
  const backgroundColor = slice.primary.background_color || 'none';

  // Build CSS classes based on options
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };
  const alignmentClass = alignmentClasses[alignment as keyof typeof alignmentClasses] || alignmentClasses.left;

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  const sizeClass = sizeClasses[textSize as keyof typeof sizeClasses] || sizeClasses.medium;

  const backgroundClasses = {
    none: '',
    'light-gray': 'bg-gray-100',
    'dark-gray': 'bg-gray-800 text-white',
    blue: 'bg-blue-50',
    white: 'bg-white'
  };
  const backgroundClass = backgroundClasses[backgroundColor as keyof typeof backgroundClasses] || backgroundClasses.none;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`py-12 px-4 sm:px-6 lg:px-8 ${backgroundClass}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={`${sizeClass} ${alignmentClass} space-y-4`}>
          {slice.primary.content ? (
            <PrismicRichText field={slice.primary.content} />
          ) : (
            <p>Add content to this Rich Text slice...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RichTextContent;