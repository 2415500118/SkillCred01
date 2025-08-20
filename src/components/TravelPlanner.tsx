import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, DollarSign, Users, Heart, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { config } from "@/config/env";
import { ApiService } from "@/services/api";
import heroImage from "@/assets/travel-hero.jpg";
import parisImage from "@/assets/paris.jpg";
import tokyoImage from "@/assets/tokyo.jpg";
import newyorkImage from "@/assets/newyork.jpg";
import romeImage from "@/assets/rome.jpg";
import barcelonaImage from "@/assets/barcelona.jpg";
import baliImage from "@/assets/bali.jpg";
import AccommodationSection from "./AccommodationSection";
import TransportationSection from "./TransportationSection";
import RestaurantSection from "./RestaurantSection";
import FilterSection from "./FilterSection";

interface TravelFormData {
  city: string;
  budget: string;
  days: string;
  travelerType: string;
  preferences: string;
}

const TravelPlanner = () => {
  const [formData, setFormData] = useState<TravelFormData>({
    city: '',
    budget: '',
    days: '',
    travelerType: '',
    preferences: ''
  });
  const [itinerary, setItinerary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Helper function to get valid city name
  const getValidCityName = (city: string) => {
    if (!city || city.trim() === '') return '';
    const trimmedCity = city.trim();
    // Remove common placeholder text
    if (trimmedCity === 'Your Destination' || trimmedCity === 'Select a city above') {
      return '';
    }
    return trimmedCity;
  };

  const handleInputChange = (field: keyof TravelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateItinerary = async () => {
    if (!formData.city || !formData.budget || !formData.days) {
      toast({
        title: "Missing Information",
        description: "Please fill in city, budget, and number of days.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `You are an expert travel planner and local guide. Generate a detailed, day-by-day travel itinerary based on these inputs:

City: ${formData.city}
Budget: ${formData.budget} (per day or total, mention accordingly)
Number of Days: ${formData.days}
Traveler Type: ${formData.travelerType || 'General'}
Preferences: ${formData.preferences || 'General tourism'}

Create a structured daily itinerary for ${formData.days} days in ${formData.city}, optimized for the given budget ${formData.budget}.

Each day must include:
- Morning activity (with estimated cost & time)
- Afternoon activity (with estimated cost & time) 
- Evening activity (with estimated cost & time)
- Dining recommendations (breakfast, lunch, dinner, and 1 unique local snack or café)
- Suggested transportation options
- Daily budget breakdown

Add maps or landmark references for clarity. Provide daily summaries (2-3 sentences) that capture the overall experience. Ensure budget tracking per day. Highlight at least one hidden gem or local-only recommendation per day.

End with an overall summary of the trip, estimated total cost, and any tips (safety, best local apps, cultural etiquette).

Format with clear headings and structure. Be friendly, engaging, and travel-magazine style.`;

      const result = await ApiService.generateItinerary(prompt);
      
      if (result.success && result.data) {
        setItinerary(result.data);
        toast({
          title: "Itinerary Generated!",
          description: `Your ${formData.days}-day trip to ${formData.city} is ready!`,
        });
      } else {
        throw new Error(result.error || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/70" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Plan Your Perfect
            <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            AI-powered travel planning that creates personalized itineraries for your dream destinations
          </p>
          <Button 
            size="lg" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-glow text-lg px-8 py-6"
            onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Planning
          </Button>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Need inspiration? Explore these trending destinations loved by travelers worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { city: "Paris, France", description: "City of Light and romance", highlights: "Eiffel Tower, Louvre, Champs-Élysées", image: parisImage },
              { city: "Tokyo, Japan", description: "Modern metropolis meets tradition", highlights: "Shibuya, Temples, Cherry Blossoms", image: tokyoImage },
              { city: "New York, USA", description: "The city that never sleeps", highlights: "Times Square, Central Park, Broadway", image: newyorkImage },
              { city: "Rome, Italy", description: "Eternal city of history", highlights: "Colosseum, Vatican, Trevi Fountain", image: romeImage },
              { city: "Barcelona, Spain", description: "Art, architecture, and beaches", highlights: "Sagrada Familia, Park Güell, Gothic Quarter", image: barcelonaImage },
              { city: "Bali, Indonesia", description: "Tropical paradise", highlights: "Temples, Beaches, Rice Terraces", image: baliImage }
            ].map((destination, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card border-0 shadow-travel hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer group overflow-hidden"
                onClick={() => handleInputChange('city', destination.city)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={`${destination.city} landmark`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">
                      {destination.city}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-3">{destination.description}</p>
                  <p className="text-sm text-primary font-medium">{destination.highlights}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/20 hover:bg-primary/10 transition-all duration-300"
              onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Planning Your Trip
            </Button>
          </div>
        </div>
      </section>

      {/* Planning Form */}
      <section id="planner" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Create Your Itinerary</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us about your travel plans and we'll create a detailed, personalized itinerary just for you
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="bg-gradient-card border-0 shadow-travel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Trip Details
                </CardTitle>
                <CardDescription>
                  Fill in your travel preferences to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Destination City
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g., Paris, Tokyo, New York"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="transition-all duration-300 focus:shadow-glow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget" className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </Label>
                    <Input
                      id="budget"
                      placeholder="e.g., $100/day, $2000 total"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div>
                    <Label htmlFor="days" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      Days
                    </Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="30"
                      placeholder="e.g., 7"
                      value={formData.days}
                      onChange={(e) => handleInputChange('days', e.target.value)}
                      className="transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    Traveler Type
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('travelerType', value)}>
                    <SelectTrigger className="transition-all duration-300 focus:shadow-glow">
                      <SelectValue placeholder="Select traveler type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Traveler</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="adventure">Adventure Seeker</SelectItem>
                      <SelectItem value="cultural">Cultural Explorer</SelectItem>
                      <SelectItem value="foodie">Food Lover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferences" className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4" />
                    Preferences (Optional)
                  </Label>
                  <Textarea
                    id="preferences"
                    placeholder="e.g., history, nightlife, nature, shopping, local experiences, hidden gems..."
                    value={formData.preferences}
                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                    className="resize-none transition-all duration-300 focus:shadow-glow"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={generateItinerary}
                  disabled={isLoading}
                  className="w-full bg-gradient-hero hover:opacity-90 text-white font-semibold py-6 text-lg transition-all duration-300 hover:scale-[1.02] shadow-travel"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Itinerary...
                    </>
                  ) : (
                    'Generate Itinerary'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-gradient-card border-0 shadow-travel">
              <CardHeader>
                <CardTitle>Your Personalized Itinerary</CardTitle>
                <CardDescription>
                  {itinerary ? 'Your custom travel plan is ready!' : 'Fill out the form to generate your itinerary'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Creating your perfect itinerary...</p>
                    </div>
                  </div>
                ) : itinerary ? (
                  <div className="bg-muted/30 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                      {itinerary}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12 text-center">
                    <div>
                      <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-muted-foreground">Your itinerary will appear here once generated</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Local Services & Amenities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover accommodation, transportation, and dining options with prices and ratings
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <FilterSection
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </div>

            {/* Services Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="accommodation" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                  <TabsTrigger value="transportation">Transportation</TabsTrigger>
                  <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="accommodation" className="mt-6">
                  {(categoryFilter === 'all' || categoryFilter === 'accommodation') && (
                    <AccommodationSection
                      city={getValidCityName(formData.city) || ''}
                      priceRange={priceRange}
                      ratingFilter={ratingFilter}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="transportation" className="mt-6">
                  {(categoryFilter === 'all' || categoryFilter === 'transportation') && (
                    <TransportationSection
                      city={getValidCityName(formData.city) || ''}
                      priceRange={priceRange}
                      ratingFilter={ratingFilter}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="restaurants" className="mt-6">
                  {(categoryFilter === 'all' || categoryFilter === 'restaurants') && (
                    <RestaurantSection
                      city={getValidCityName(formData.city) || ''}
                      priceRange={priceRange}
                      ratingFilter={ratingFilter}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelPlanner;