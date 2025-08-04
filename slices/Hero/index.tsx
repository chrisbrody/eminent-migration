import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const isTextCentered = slice.variation === "textCentered";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: slice.primary.background_image?.url
          ? `url(${slice.primary.background_image.url})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        isTextCentered ? "text-center" : "text-left"
      }`}>
        <div className={`max-w-3xl ${isTextCentered ? "mx-auto" : ""}`}>
          {/* Title */}
          <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <PrismicRichText field={slice.primary.title} />
          </div>
          
          {/* Subtitle */}
          <div className="text-white text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed opacity-90">
            <PrismicRichText field={slice.primary.subtitle} />
          </div>
          
          {/* CTA Button */}
          {slice.primary.cta_button_label && slice.primary.cta_button_link && (
            <div className={isTextCentered ? "flex justify-center" : ""}>
              <a
                href={slice.primary.cta_button_link.url || "#"}
                target={slice.primary.cta_button_link.target || "_self"}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {slice.primary.cta_button_label}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;