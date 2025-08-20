import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, DollarSign, Star } from "lucide-react";

interface FilterSectionProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
  categoryFilter,
  setCategoryFilter
}) => {
  return (
    <Card className="bg-gradient-card border-0 shadow-travel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4" />
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4" />
            Minimum Rating: {ratingFilter}+
          </Label>
          <Slider
            value={[ratingFilter]}
            onValueChange={(value) => setRatingFilter(value[0])}
            max={5}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="mb-2 block">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="accommodation">Accommodation</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="restaurants">Restaurants</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;