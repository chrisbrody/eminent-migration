import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicImage, PrismicLink } from "@prismicio/react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps) => {
  const isTextLeft = slice.variation === 'default';
  const textAlignment = isTextLeft ? 'text-left' : 'text-center';
  const justifyContent = isTextLeft ? 'justify-start' : 'justify-center';
  
  const overlayClasses = {
    none: '',
    light: 'bg-black/20',
    medium: 'bg-black/50', 
    dark: 'bg-black/70'
  };
  
  const overlayOpacity = slice.primary.overlay_opacity || 'none';
  
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`relative min-h-[400px] flex items-center ${justifyContent}`}
    >
      {slice.primary.background_image && (
        <PrismicImage 
          field={slice.primary.background_image}
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
      )}
      {slice.primary.background_image && overlayClasses[overlayOpacity as keyof typeof overlayClasses] && (
        <div className={`absolute inset-0 ${overlayClasses[overlayOpacity as keyof typeof overlayClasses]} -z-5`} />
      )}
      <div className={`${textAlignment} max-w-4xl px-6 relative z-10`}>
        {slice.primary.title && (
          <PrismicRichText 
            field={slice.primary.title}
            components={{
              heading1: ({ children }) => <h1 className="text-5xl font-bold mb-6 text-white">{children}</h1>
            }}
          />
        )}
        {slice.primary.subtitle && (
          <PrismicRichText 
            field={slice.primary.subtitle}
            components={{
              paragraph: ({ children }) => <p className="text-xl text-white/90 mb-8">{children}</p>
            }}
          />
        )}
        {slice.primary.cta_button_label && (
          <PrismicLink 
            field={slice.primary.cta_button_link}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {slice.primary.cta_button_label}
          </PrismicLink>
        )}
      </div>
    </section>
  );
};

export default Hero;