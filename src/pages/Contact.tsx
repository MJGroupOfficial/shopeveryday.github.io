
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-500">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in-0 slide-in-from-top-4 duration-500 delay-200">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-300">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <MapPin className="h-5 w-5" />,
                    title: "Our Address",
                    content: "123 Shopping Street\nCommerce City, CC 12345",
                  },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    title: "Phone Number",
                    content: "(555) 123-4567",
                  },
                  {
                    icon: <Mail className="h-5 w-5" />,
                    title: "Email Address",
                    content: "info@shopeveryday.com",
                  },
                  {
                    icon: <Clock className="h-5 w-5" />,
                    title: "Business Hours",
                    content: "Mon - Fri: 9:00 AM - 8:00 PM\nSat - Sun: 10:00 AM - 6:00 PM",
                  },
                ].map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="text-primary mt-1">{item.icon}</div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-400">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Subject"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={5}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200 hover:scale-105"
                    size="lg"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
