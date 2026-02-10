import { FeatureItems } from "../../../data";
import FeatureCard from "../home/FeatureCard";
import type { FeatureItemType } from "../../../types";

const Feature = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FeatureItems.map((item: FeatureItemType) => (
          <FeatureCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Feature;
