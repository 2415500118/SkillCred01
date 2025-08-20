import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Car, Utensils, Loader2 } from "lucide-react";
import { HotelApiService, Hotel } from '@/services/hotelApi';

interface AccommodationSectionProps {
  city: string;
  priceRange: [number, number];
  ratingFilter: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const AccommodationSection: React.FC<AccommodationSectionProps> = ({ 
  city, 
  priceRange, 
  ratingFilter,
  checkIn = new Date().toISOString().split('T')[0],
  checkOut = new Date(Date.now() + 86400000).toISOString().split('T')[0],
  guests = 2
}) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      // Check if city is valid and not empty
      if (!city || city.trim() === '') {
        setLoading(false);
        setHotels([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await HotelApiService.getHotels(city, checkIn, checkOut, guests);
        
        if (result.success) {
          setHotels(result.hotels);
        } else {
          setError(result.error || 'Failed to fetch hotels');
          setHotels(result.hotels); // Use fallback data
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
        
        // Set fallback data on error
        setHotels([
          {
            id: 'fallback-1',
            name: 'Grand City Hotel',
            rating: 4.5,
            price: 8500,
            currency: 'INR',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            location: 'City Center',
            amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
            description: 'Luxurious hotel in the heart of the city',
            availability: true
          },
          {
            id: 'fallback-2',
            name: 'Comfort Inn & Suites',
            rating: 4.0,
            price: 6000,
            currency: 'INR',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
            location: 'Downtown',
            amenities: ['WiFi', 'Breakfast', 'Parking'],
            description: 'Comfortable and affordable accommodation',
            availability: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city, checkIn, checkOut, guests]);

  const filteredHotels = hotels.filter(
    hotel => hotel.price >= priceRange[0] && hotel.price <= priceRange[1] && hotel.rating >= ratingFilter
  );

  // Filtering hotels based on price range and rating

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    switch (lowerAmenity) {
      case 'wifi': case 'wi-fi': return <Wifi className="h-3 w-3" />;
      case 'parking': case 'car': return <Car className="h-3 w-3" />;
      case 'restaurant': case 'breakfast': case 'kitchen': case 'dining': return <Utensils className="h-3 w-3" />;
      default: return null;
    }
  };

  if (!city || city.trim() === '') {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Accommodation</h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">Select a destination city to see available hotels</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Accommodation in {city}</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Finding the best hotels...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold mb-4">Hotels in {city}</h3>
        {error && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Live prices unavailable
          </Badge>
        )}
      </div>
      
      {filteredHotels.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hotels found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="bg-gradient-card border-0 shadow-travel hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
              <div className="relative h-32 overflow-hidden rounded-t-lg">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                {hotel.availability && (
                  <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                    Available
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h4 className="font-semibold text-lg mb-2">{hotel.name}</h4>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {hotel.location}
                </div>
                
                {hotel.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {hotel.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    {hotel.currency === 'USD' ? '$' : hotel.currency}{hotel.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/night</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccommodationSection;