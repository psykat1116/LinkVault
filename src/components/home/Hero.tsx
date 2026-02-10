import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-balance">
            Share{" "}
            <span className="italic font-serif text-indigo-600 text-6xl md:text-9xl">
              code
            </span>{" "}
            &{" "}
            <span className="italic font-serif text-indigo-600 text-6xl md:text-9xl">
              file
            </span>
            <br />
            <span className="mt-2">instantly</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A fast, minimalist tool to share code snippets, logs, and text with
            syntax highlighting, expiration timers, and privacy controls.
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <a href="/new">
            <Button
              size="sm"
              variant="primary"
              className="gap-1 rounded-md flex items-center justify-center px-3 py-2 cursor-pointer group"
            >
              Create Paste{" "}
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5 duration-300" />
            </Button>
          </a>
          <a href="/explore">
            <Button
              size="sm"
              variant="outline"
              className="px-3 py-2 flex items-center justify-center border cursor-pointer rounded-md hover:bg-primary hover:text-primary-foreground transition duration-300"
            >
              Browse Pastes
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
