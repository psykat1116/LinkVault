import type { CTAItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";

const CTACard = ({
  href,
  title,
  active,
  btitle,
  icon: Icon,
  description,
}: CTAItemType) => {
  return (
    <div
      className={`relative p-8 border border-border hover:border-primary/50 bg-card transition-all hover:shadow-lg group cursor-pointer shadow-md rounded-xl flex flex-col gap-y-4 ${active && "bg-primary/10 border-primary/5"}`}
    >
      {active && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <a href={href}>
        <Button
          size="sm"
          variant={active ? "default" : "secondary"}
          className="w-full transition duration-300 text-sm"
        >
          {btitle}
        </Button>
      </a>
    </div>
  );
};

export default CTACard;
