import { HeroSection } from "@/components/HeroSection";
import { SectionDivider } from "@/components/SectionDivider";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { BurgersSection } from "@/components/BurgersSection";
import { EventSection } from "@/components/EventSection";
import { LocalSection } from "@/components/LocalSection";
import { Preview } from "@/components/Preview";
import { Footer } from "@/components/Footer";
import { getPublicProducts } from "@/server/get-public-products";
import { eventService } from "@/server/services/event.service";
import type { Event, Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = [];
  let events: Event[] = [];
  try {
    products = await getPublicProducts();
  } catch {
    // Se o banco estiver indisponível, a vitrine renderiza vazia em vez de quebrar.
    products = [];
  }
  try {
    events = await eventService.listUpcoming();
  } catch {
    events = [];
  }

  return (
    <main>
      <HeroSection />
      <SectionDivider />
      <FeaturedCarousel products={products} />
      <BurgersSection products={products} mode="preview" limit={6} sectionId="cardapio" />
      <SectionDivider />
      <LocalSection />
      <SectionDivider />
      <EventSection events={events} />
      <SectionDivider />
      <Preview />
      <SectionDivider />
      <Footer />
    </main>
  );
}
