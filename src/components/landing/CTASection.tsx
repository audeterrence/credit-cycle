import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="bg-card py-20">
    <div className="container text-center">
      <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
        Start Recycling. Start Earning.
      </h2>
      <p className="mx-auto mb-8 max-w-md text-muted-foreground">
        Join Credi-Can today and turn your waste into real value for you and your community.
      </p>
      <Button size="lg" className="px-10 text-base">
        Join Now
      </Button>
    </div>
  </section>
);

export default CTASection;
