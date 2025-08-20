import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Clock, Loader2 } from "lucide-react";
import { ApiService, Restaurant } from "@/services/api";

interface RestaurantSectionProps {
  city: string;
  priceRange: [number, number];
  ratingFilter: number;
}

const RestaurantSection: React.FC<RestaurantSectionProps> = ({ city, priceRange, ratingFilter }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!city || city === 'Your Destination' || city === 'Select a city above' || city.trim() === '') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await ApiService.getRestaurants(city);
        
        if (result.success && result.data) {
          setRestaurants(result.data);
        } else {
          setError(result.error || 'Failed to fetch restaurants');
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [city]);

  const filteredRestaurants = restaurants.filter(
    restaurant => restaurant.averagePrice >= priceRange[0] && restaurant.averagePrice <= priceRange[1] && restaurant.rating >= ratingFilter
  );

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600';
      case '$$': return 'text-yellow-600';
      case '$$$': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!city || city === 'Your Destination' || city === 'Select a city above' || city.trim() === '') {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Restaurants</h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">Select a destination city to see available restaurants</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Restaurants in {city}</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Finding the best restaurants...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Restaurants in {city}</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">Unable to load restaurants</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold mb-4">Restaurants in {city}</h3>
      
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No restaurants found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="bg-gradient-card border-0 shadow-travel hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
              <div className="relative h-32 overflow-hidden rounded-t-lg">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';
                  }}
                />
                <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
                  {restaurant.cuisine}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{restaurant.name}</h4>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPriceColor(restaurant.priceRange)}`}>
                      {restaurant.priceRange}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ~${restaurant.averagePrice}/person
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({restaurant.reviews} reviews)</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {restaurant.openHours}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantSection;