import { CTAItems } from "@/lib/data";
import type { CTAItemType } from "@/lib/types";
import CTACard from "@/components/home/CTACard";

const CTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CTAItems.map((item: CTAItemType) => (
          <CTACard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            href={item.href}
            btitle={item.btitle}
            active={item.active}
          />
        ))}
      </div>
    </section>
  );
};

export default CTA;
