import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

/**
 * Props for `CallToAction`.
 */
export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/**
 * Component for "CallToAction" Slices.
 */
const CallToAction = ({ slice }: CallToActionProps) => {
  // Cast to any to handle spacing fields until types are updated
  const primary = slice.primary as any;
  
  // Build dynamic styles object from the spacing inputs
  const dynamicStyles: React.CSSProperties = {};
  
  if (primary.padding) {
    dynamicStyles.padding = primary.padding;
  }
  if (primary.margin) {
    dynamicStyles.margin = primary.margin;
  }
  
  // Background color mapping
  const backgroundClasses = {
    white: 'bg-white text-foreground',
    'light-gray': 'bg-gray-100 text-foreground',
    'dark-gray': 'bg-gray-800 text-white',
    primary: 'bg-gray-900 text-white',
    secondary: 'bg-secondary text-secondary-foreground'
  };
  
  // Text alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  const bgClass = backgroundClasses[slice.primary.background_color as keyof typeof backgroundClasses] || backgroundClasses.primary;
  const alignClass = alignmentClasses[slice.primary.text_alignment as keyof typeof alignmentClasses] || alignmentClasses.center;
  
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`section-padding-y ${bgClass} ${alignClass}`}
      style={dynamicStyles}
    >
      <div className="container mx-auto container-padding-x max-w-3xl">
        <div className="section-title-gap-lg flex flex-col items-center">
          
          {/* Title */}
          {slice.primary.title && (
            <PrismicRichText 
              field={slice.primary.title}
              components={{
                heading1: ({ children }) => (
                  <h1 className="heading-lg font-bold">
                    {children}
                  </h1>
                ),
                heading2: ({ children }) => (
                  <h2 className="heading-lg font-bold">
                    {children}
                  </h2>
                ),
                heading3: ({ children }) => (
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                    {children}
                  </h3>
                ),
                heading4: ({ children }) => (
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">
                    {children}
                  </h4>
                ),
                heading5: ({ children }) => (
                  <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight">
                    {children}
                  </h5>
                ),
                heading6: ({ children }) => (
                  <h6 className="text-base sm:text-lg lg:text-xl font-medium tracking-tight leading-tight">
                    {children}
                  </h6>
                ),
              }}
            />
          )}
          
          {/* Text Content */}
          {slice.primary.text && (
            <div className="max-w-2xl">
              <PrismicRichText 
                field={slice.primary.text}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-lg leading-relaxed opacity-90 mb-4 last:mb-0">
                      {children}
                    </p>
                  ),
                  list: ({ children }) => (
                    <ul className="text-lg leading-relaxed opacity-90 mb-4 ml-6 list-disc space-y-1">
                      {children}
                    </ul>
                  ),
                  oList: ({ children }) => (
                    <ol className="text-lg leading-relaxed opacity-90 mb-4 ml-6 list-decimal space-y-1">
                      {children}
                    </ol>
                  ),
                  listItem: ({ children }) => (
                    <li>{children}</li>
                  ),
                }}
              />
            </div>
          )}
          
          {/* CTA Button */}
          {slice.primary.button_label && (
            <PrismicLink 
              field={slice.primary.button_link}
              className={`inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                slice.primary.background_color === 'primary' || slice.primary.background_color === 'dark-gray'
                  ? 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary'
              }`}
            >
              {slice.primary.button_label}
            </PrismicLink>
          )}
          
        </div>
      </div>
    </section>
  );
};

export default CallToAction;