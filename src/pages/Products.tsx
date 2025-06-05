
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&w=500",
    originalPrice: 19999,
    currentPrice: 14999,
    discount: 25,
    category: "electronics",
    buyLink: "https://example.com/buy/headphones"
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    description: "Track your health and fitness with this advanced smartwatch featuring GPS and heart rate monitor.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&w=500",
    originalPrice: 29999,
    currentPrice: 24999,
    discount: 17,
    category: "electronics",
    buyLink: "https://example.com/buy/smartwatch"
  },
  {
    id: 3,
    title: "Designer Cotton T-Shirt",
    description: "Premium quality cotton t-shirt with modern design and comfortable fit.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=500",
    originalPrice: 4999,
    currentPrice: 3499,
    discount: 30,
    category: "fashion",
    buyLink: "https://example.com/buy/tshirt"
  },
  {
    id: 4,
    title: "Laptop Stand Adjustable",
    description: "Ergonomic aluminum laptop stand with adjustable height and angle for better posture.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&w=500",
    originalPrice: 7999,
    currentPrice: 5999,
    discount: 25,
    category: "electronics",
    buyLink: "https://example.com/buy/laptop-stand"
  },
  {
    id: 5,
    title: "Leather Handbag",
    description: "Elegant genuine leather handbag with multiple compartments and adjustable strap.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
    originalPrice: 12999,
    currentPrice: 8999,
    discount: 31,
    category: "fashion",
    buyLink: "https://example.com/buy/handbag"
  },
  {
    id: 6,
    title: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with premium sound quality and smart home integration.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
    originalPrice: 9999,
    currentPrice: 6999,
    discount: 30,
    category: "electronics",
    buyLink: "https://example.com/buy/speaker"
  }
];

const categories = ["all", "electronics", "fashion", "home"];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  console.log("Products component rendered");
  console.log("Number of products:", products.length);
  console.log("Search query:", searchQuery);
  console.log("Selected category:", selectedCategory);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    console.log("Filtered products count:", filtered.length);
    return filtered;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-500">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in-0 slide-in-from-top-4 duration-500 delay-200">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-500 delay-300">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Filter className="h-5 w-5 mt-2 mr-2 text-muted-foreground" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize transition-all duration-200 hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-2 bg-muted rounded text-sm">
          Showing {filteredProducts.length} products
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in fade-in-0 slide-in-from-bottom-4 border-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onLoad={() => console.log(`Image loaded for product ${product.id}`)}
                    onError={() => console.log(`Image failed to load for product ${product.id}`)}
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full transition-all duration-200 hover:scale-105"
                  onClick={() => window.open(product.buyLink, '_blank')}
                >
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No products found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
