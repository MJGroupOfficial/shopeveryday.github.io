
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Gift } from "lucide-react";
import { useState, useEffect } from "react";

const deals = [
  {
    id: 1,
    title: "Electronics Sale",
    description: "Up to 50% off on all electronic items",
    badge: "LIMITED TIME",
    icon: <Zap className="h-6 w-6" />,
    endTimeHours: 24,
    bgClass: "bg-gradient-to-br from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Fashion Week",
    description: "Buy 2 Get 1 Free on all fashion items",
    badge: "FLASH SALE",
    icon: <Gift className="h-6 w-6" />,
    endTimeHours: 12,
    bgClass: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: 3,
    title: "Home Essentials",
    description: "Free shipping on orders over ₹2000",
    badge: "SPECIAL OFFER",
    icon: <Clock className="h-6 w-6" />,
    endTimeHours: 48,
    bgClass: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
];

const Deals = () => {
  const [countdowns, setCountdowns] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const endTimes: { [key: number]: number } = {};
    const now = Date.now();
    
    // Initialize end times
    deals.forEach(deal => {
      endTimes[deal.id] = now + (deal.endTimeHours * 60 * 60 * 1000);
    });

    const updateCountdowns = () => {
      const currentTime = Date.now();
      const newCountdowns: { [key: number]: string } = {};
      
      deals.forEach(deal => {
        let timeLeft = endTimes[deal.id] - currentTime;
        
        // Reset timer if expired
        if (timeLeft <= 0) {
          endTimes[deal.id] = currentTime + (deal.endTimeHours * 60 * 60 * 1000);
          timeLeft = endTimes[deal.id] - currentTime;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        newCountdowns[deal.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      });
      
      setCountdowns(newCountdowns);
    };

    // Initial update
    updateCountdowns();
    
    // Update every second
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Today's Best Deals
          </h1>
          <p className="text-xl text-muted-foreground">
            Don't miss out on these incredible offers
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className={`text-white overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${deal.bgClass}`}
            >
              <CardHeader className="relative">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white">
                  {deal.badge}
                </Badge>
                <div className="flex items-center justify-center mb-4 mt-4">
                  {deal.icon}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="text-2xl font-bold mb-3">{deal.title}</h3>
                <p className="text-lg opacity-90 mb-6">{deal.description}</p>
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold">Ends in:</p>
                  <p className="text-xl font-bold font-mono">
                    {countdowns[deal.id] || "00:00:00"}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full text-gray-900 hover:bg-white transition-all duration-200 hover:scale-105"
                >
                  Shop Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Special Offers Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Sign up for our newsletter to get exclusive deals and early access to sales
          </p>
          <Button size="lg" className="px-8">
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Deals;
