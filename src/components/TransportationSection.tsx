import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Car, Clock, Users, Loader2, MapPin } from "lucide-react";
import { ApiService, Transportation } from "@/services/api";

interface TransportationSectionProps {
  city: string;
  priceRange: [number, number];
  ratingFilter: number;
}

const TransportationSection: React.FC<TransportationSectionProps> = ({ city, priceRange, ratingFilter }) => {
  const [transportOptions, setTransportOptions] = useState<Transportation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportation = async () => {
      if (!city || city === 'Your Destination' || city === 'Select a city above' || city.trim() === '') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await ApiService.getTransportation(city);
        
        if (result.success && result.data) {
          setTransportOptions(result.data);
        } else {
          setError(result.error || 'Failed to fetch transportation options');
        }
      } catch (err) {
        console.error('Error fetching transportation:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transportation options');
      } finally {
        setLoading(false);
      }
    };

    fetchTransportation();
  }, [city]);

  const filteredTransport = transportOptions.filter(
    transport => transport.basePrice >= priceRange[0] && transport.basePrice <= priceRange[1] && transport.rating >= ratingFilter
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'taxi': return 'bg-yellow-500';
      case 'uber': return 'bg-black';
      case 'local': return 'bg-green-500';
      case 'rental': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!city || city === 'Your Destination' || city === 'Select a city above' || city.trim() === '') {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Transportation</h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">Select a destination city to see transportation options</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Transportation in {city}</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Finding transportation options...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Transportation in {city}</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">Unable to load transportation options</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold mb-4">Transportation in {city}</h3>
      
      {filteredTransport.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No transportation options found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTransport.map((transport) => (
            <Card key={transport.id} className="bg-gradient-card border-0 shadow-travel hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{transport.name}</h4>
                    <Badge className={`${getTypeColor(transport.type)} text-white mt-1`}>
                      {transport.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ${transport.basePrice}
                      {transport.type !== 'rental' && <span className="text-sm">/base</span>}
                      {transport.type === 'rental' && <span className="text-sm">/day</span>}
                    </div>
                    {transport.perKmPrice > 0 && (
                      <div className="text-sm text-muted-foreground">
                        +${transport.perKmPrice}/km
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{transport.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({transport.reviews} reviews)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{transport.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{transport.estimatedWaitTime}</span>
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

export default TransportationSection;