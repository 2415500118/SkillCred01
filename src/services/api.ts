import { config } from '@/config/env';

// Generic API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Restaurant API interfaces
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  averagePrice: number;
  rating: number;
  reviews: number;
  location: string;
  openHours: string;
  specialties: string[];
  image: string;
}

// Transportation API interfaces
export interface Transportation {
  id: string;
  name: string;
  type: 'taxi' | 'uber' | 'local' | 'rental';
  basePrice: number;
  perKmPrice: number;
  rating: number;
  reviews: number;
  capacity: number;
  estimatedWaitTime: string;
}

// Hotel API interfaces
export interface Hotel {
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

// API Service class
export class ApiService {
  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Restaurant API methods
  static async getRestaurants(city: string): Promise<ApiResponse<Restaurant[]>> {
    // For now, return mock data. In production, integrate with real restaurant API
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'Local Flavors Bistro',
        cuisine: 'Local',
        priceRange: '$$',
        averagePrice: 25,
        rating: 4.5,
        reviews: 234,
        location: 'Downtown',
        openHours: '11:00 AM - 10:00 PM',
        specialties: ['Traditional dishes', 'Fresh seafood', 'Local wine'],
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
      },
      {
        id: '2',
        name: 'Street Food Paradise',
        cuisine: 'Street Food',
        priceRange: '$',
        averagePrice: 8,
        rating: 4.2,
        reviews: 456,
        location: 'Market District',
        openHours: '6:00 AM - 11:00 PM',
        specialties: ['Quick bites', 'Local snacks', 'Fresh juices'],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b'
      },
      {
        id: '3',
        name: 'Fine Dining Experience',
        cuisine: 'International',
        priceRange: '$$$',
        averagePrice: 75,
        rating: 4.7,
        reviews: 128,
        location: 'Uptown',
        openHours: '6:00 PM - 12:00 AM',
        specialties: ['Gourmet cuisine', 'Wine pairing', 'Chef specials'],
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
      },
      {
        id: '4',
        name: 'Family Corner Cafe',
        cuisine: 'Cafe',
        priceRange: '$',
        averagePrice: 12,
        rating: 4.1,
        reviews: 167,
        location: 'Residential Area',
        openHours: '7:00 AM - 6:00 PM',
        specialties: ['Coffee', 'Pastries', 'Light meals'],
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'
      }
    ];

    return { success: true, data: mockRestaurants };
  }

  // Transportation API methods
  static async getTransportation(city: string): Promise<ApiResponse<Transportation[]>> {
    // For now, return mock data. In production, integrate with real transportation API
    const mockTransport: Transportation[] = [
      {
        id: '1',
        name: 'City Taxi',
        type: 'taxi',
        basePrice: 5,
        perKmPrice: 2,
        rating: 4.0,
        reviews: 892,
        capacity: 4,
        estimatedWaitTime: '5-10 min'
      },
      {
        id: '2',
        name: 'Uber',
        type: 'uber',
        basePrice: 4,
        perKmPrice: 1.8,
        rating: 4.3,
        reviews: 1234,
        capacity: 4,
        estimatedWaitTime: '3-7 min'
      },
      {
        id: '3',
        name: 'Local Ride Share',
        type: 'local',
        basePrice: 3,
        perKmPrice: 1.5,
        rating: 3.9,
        reviews: 456,
        capacity: 6,
        estimatedWaitTime: '8-15 min'
      },
      {
        id: '4',
        name: 'Car Rental',
        type: 'rental',
        basePrice: 35,
        perKmPrice: 0,
        rating: 4.2,
        reviews: 324,
        capacity: 5,
        estimatedWaitTime: 'Pick up anytime'
      }
    ];

    return { success: true, data: mockTransport };
  }

  // Hotel API methods
  static async getHotels(city: string, checkIn: string, checkOut: string, guests: number = 2): Promise<ApiResponse<Hotel[]>> {
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city,
          checkIn,
          checkOut,
          guests
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.hotels || [] };
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch hotels' 
      };
    }
  }

  // Itinerary generation method
  static async generateItinerary(prompt: string): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${config.gemini.baseUrl}?key=${config.gemini.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate itinerary. Please try again.';
      
      return { success: true, data: generatedText };
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate itinerary' 
      };
    }
  }
}
