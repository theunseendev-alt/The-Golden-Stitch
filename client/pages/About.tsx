import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Award,
  Target,
  Star,
  Palette,
  Scissors,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "Former fashion designer with 15+ years in the industry",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Marcus Johnson",
      role: "Head of Operations",
      bio: "Supply chain expert with passion for artisan craftsmanship",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Elena Rodriguez",
      role: "Lead Designer",
      bio: "Award-winning fashion designer and pattern maker",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Fashion",
      description:
        "We believe every garment tells a story and deserves to be crafted with love and attention to detail.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building bridges between talented designers, skilled seamstresses, and fashion-forward customers.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "We maintain the highest standards in design, craftsmanship, and customer service.",
    },
    {
      icon: Target,
      title: "Sustainable Future",
      description:
        "Promoting slow fashion and supporting local artisans in creating timeless, durable pieces.",
    },
  ];

  const stats = [
    { number: "500+", label: "Designers" },
    { number: "1,200+", label: "Crafters" },
    { number: "10,000+", label: "Items Made" },
    { number: "25,000+", label: "Happy Customers" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">About The Golden Stitch</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize fashion by connecting talented
              designers with skilled seamstresses and passionate customers,
              creating a marketplace where creativity meets craftsmanship.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Founded in 2023, The Golden Stitch was born from a simple
                  observation: the fashion industry was disconnected. Designers
                  with brilliant ideas struggled to bring them to life, while
                  skilled seamstresses lacked opportunities to showcase their
                  artistry.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We created this platform to bridge that gap, fostering a
                  community where creativity flourishes, craftsmanship is
                  celebrated, and customers can access truly unique, handcrafted
                  garments.
                </p>
                <p className="text-lg text-gray-600">
                  Every item tells a story – from the designer's vision to the
                  crafter's skilled hands, to the moment it becomes part of
                  your collection. We're honored to be part of that journey.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop"
                  alt="Fashion workshop"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl opacity-90">
                Numbers that reflect our growing community
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The passionate people behind The Golden Stitch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How We Connect
              </h2>
              <p className="text-xl text-gray-600">
                Our three-sided marketplace in action
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  For Designers
                </h3>
                <p className="text-gray-600 mb-4">
                  Share your designs with the world. Upload your creations, set
                  your prices, and connect with skilled seamstresses who bring
                  your vision to life.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/become-designer")}
                >
                  Become a Designer
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  For Seamstresses
                </h3>
                <p className="text-gray-600 mb-4">
                  Showcase your skills and earn by bringing designers' visions
                  to reality. Browse available designs and choose projects that
                  match your expertise.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/become-seamstress")}
                >
                  Become a Seamstress
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  For Customers
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover unique, handcrafted clothing, purses, and hats made by talented
                  artisans. Support independent designers and own truly
                  one-of-a-kind pieces.
                </p>
                <Button variant="outline" onClick={() => navigate("/browse")}>
                  Browse Designs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-accent to-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Whether you're a designer, seamstress, or fashion lover, there's a
              place for you at The Golden Stitch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate("/become-designer")}
              >
                Start Designing
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate("/become-seamstress")}
              >
                Start Sewing
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate("/browse")}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
