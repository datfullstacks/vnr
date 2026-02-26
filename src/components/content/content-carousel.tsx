"use client";

import { useState } from "react";
import { CarouselItem } from "@/lib/content-types";

type ContentCarouselProps = {
  heading: string;
  items: CarouselItem[];
};

export function ContentCarousel({ heading, items }: ContentCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <section className="content-section">
      <h2 className="section-title">{heading}</h2>
      <div className="carousel">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() =>
            setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
          }
          aria-label="Muc truoc"
        >
          {"<"}
        </button>

        <article className="carousel-card" aria-live="polite">
          <h3>{activeItem.title}</h3>
          <p>{activeItem.detail}</p>
        </article>

        <button
          type="button"
          className="carousel-arrow"
          onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
          aria-label="Muc tiep theo"
        >
          {">"}
        </button>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Dieu huong slide">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Chuyen toi ${item.title}`}
            className={index === activeIndex ? "carousel-dot carousel-dot-active" : "carousel-dot"}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
