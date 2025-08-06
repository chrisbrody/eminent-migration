"use client";

import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { useState } from "react";
import { Tagline } from "@/components/ui/tagline";

// ChevronDown SVG component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
  </svg>
);

/**
 * Props for `FAQ`.
 */
export type FAQProps = SliceComponentProps<Content.FaqSlice>;

/**
 * Component for "FAQ" Slices.
 */
const FAQ = ({ slice }: FAQProps) => {
  const [openItem, setOpenItem] = useState<number | null>(0); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto max-w-2xl flex flex-col gap-10 md:gap-12 px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-6">
          {/* Tagline */}
          {slice.primary.tagline && (
            <Tagline>{slice.primary.tagline}</Tagline>
          )}
          
          {/* Main Title */}
          {slice.primary.title && (
            <PrismicRichText 
              field={slice.primary.title}
              components={{
                heading1: ({ children }) => (
                  <h1 id="faq-heading" className="text-3xl lg:text-4xl font-bold text-foreground">
                    {children}
                  </h1>
                ),
                heading2: ({ children }) => (
                  <h2 id="faq-heading" className="text-3xl lg:text-4xl font-bold text-foreground">
                    {children}
                  </h2>
                ),
                heading3: ({ children }) => (
                  <h3 id="faq-heading" className="text-2xl lg:text-3xl font-bold text-foreground">
                    {children}
                  </h3>
                ),
              }}
            />
          )}

          {/* Description with Contact Link */}
          {slice.primary.description && (
            <div>
              <PrismicRichText 
                field={slice.primary.description}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-muted-foreground text-base">
                      {children}
                      {slice.primary.contact_link_text && slice.primary.contact_link && (
                        <>
                          {" "}
                          <PrismicLink 
                            field={slice.primary.contact_link}
                            className="text-black underline cursor-pointer"
                          >
                            {slice.primary.contact_link_text}
                          </PrismicLink>
                        </>
                      )}
                    </p>
                  ),
                }}
              />
            </div>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {slice.items.map((item, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left py-4 flex items-center justify-between hover:no-underline bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={openItem === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base font-medium pr-4">
                  {item.question}
                </span>
                <ChevronDownIcon 
                  className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
                    openItem === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openItem === index && (
                <div id={`faq-answer-${index}`} className="pb-4">
                  <div className="text-muted-foreground text-sm prose prose-sm max-w-none">
                    <PrismicRichText field={item.answer} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;