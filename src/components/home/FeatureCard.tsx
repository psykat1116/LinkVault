import type { FeatureItemType } from "@/lib/types";

const FeatureCard = ({ icon: Icon, title, description }: FeatureItemType) => {
  return (
    <div className="p-6 border border-border hover:border-accent/50 transition-colors rounded-xl shadow-md cursor-pointer bg-card">
      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text- cursor-pointer text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
