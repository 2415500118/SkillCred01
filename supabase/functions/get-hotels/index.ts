import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HotelRequest {
  city: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  currency: string;
  image: string;
  location: string;
  amenities: string[];
  description: string;
  availability: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, checkIn, checkOut, guests = 2 }: HotelRequest = await req.json();
    
    if (!city) {
      throw new Error('City is required');
    }
    
    console.log(`Fetching hotels for ${city} from ${checkIn} to ${checkOut} for ${guests} guests`);

    const apiKey = Deno.env.get('MAKCORPS_API_KEY') || "68a35ceeee2f869ff1da0384";
    if (!apiKey) {
      console.warn('MAKCORPS_API_KEY not found, using fallback data');
      throw new Error('MAKCORPS_API_KEY not configured');
    }

    // Call Makcorps API
    const makcorpsResponse = await fetch(`https://api.makcorps.com/hotels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: city,
        checkIn,
        checkOut,
        guests,
        limit: 10
      })
    });

    if (!makcorpsResponse.ok) {
      const errorText = await makcorpsResponse.text();
      console.error('Makcorps API error:', makcorpsResponse.status, errorText);
      throw new Error(`Makcorps API error: ${makcorpsResponse.status} - ${errorText}`);
    }

    const hotelData = await makcorpsResponse.json();
    console.log('Successfully fetched hotel data:', hotelData);

    // Transform the data to match our frontend expectations
    const transformedHotels: Hotel[] = hotelData.hotels?.map((hotel: any) => ({
      id: hotel.id || hotel.hotelId || `hotel-${Math.random().toString(36).substr(2, 9)}`,
      name: hotel.name || hotel.hotelName || 'Hotel Name Not Available',
      rating: parseFloat(hotel.rating) || parseFloat(hotel.starRating) || 4.0,
      price: parseFloat(hotel.price?.amount) || parseFloat(hotel.totalPrice) || parseFloat(hotel.pricePerNight) || 0,
      currency: hotel.price?.currency || hotel.currency || 'USD',
      image: hotel.image || hotel.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      location: hotel.address || hotel.location || city,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities : ['WiFi', 'Pool', 'Gym'],
      description: hotel.description || `Comfortable accommodation in ${city}`,
      availability: hotel.availability !== false
    })) || [];

    return new Response(
      JSON.stringify({
        success: true,
        hotels: transformedHotels,
        city,
        totalResults: transformedHotels.length
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Error fetching hotels:', error);
    
    // Return fallback data if API fails
    const fallbackHotels: Hotel[] = [
      {
        id: 'fallback-1',
        name: 'Grand City Hotel',
        rating: 4.5,
        price: 120,
        currency: 'USD',
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
        price: 85,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        location: 'Downtown',
        amenities: ['WiFi', 'Breakfast', 'Parking'],
        description: 'Comfortable and affordable accommodation',
        availability: true
      }
    ];

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        hotels: fallbackHotels,
        fallback: true
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    );
  }
})