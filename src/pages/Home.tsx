
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
            Best Deals Every Day
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-400">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/deals">View Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose ShopEveryday?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Best Prices",
                description: "Guaranteed lowest prices with price match guarantee",
                icon: "💰",
              },
              {
                title: "Fast Delivery",
                description: "Free shipping on orders over $50 with next-day delivery",
                icon: "🚚",
              },
              {
                title: "Quality Products",
                description: "Only the highest quality products from trusted brands",
                icon: "⭐",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
