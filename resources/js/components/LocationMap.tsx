import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface LocationMapProps {
  location: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  readOnly?: boolean;
  onLocationChange?: (location: string) => void;
  onCoordinatesChange?: (lat: number | string, lng: number | string) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  location, 
  latitude, 
  longitude, 
  readOnly = false,
  onLocationChange = () => {},
  onCoordinatesChange = () => {} 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapObject, setMapObject] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>(location || '');
  const [error, setError] = useState<string>('');
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return;
    
    // Make sure Leaflet is available
    if (!window.L) {
      // If Leaflet isn't loaded, dynamically load it
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      // If Leaflet is already loaded, initialize the map
      initializeMap();
    }
    
    return () => {
      // Cleanup map when component unmounts
      if (mapObject) {
        mapObject.remove();
      }
    };
  }, []);
  
  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;
    
    // Create map only once
    if (!mapObject) {
      // Default coordinates (if none provided)
      const defaultLat = latitude || -6.2088;  // Default to Jakarta, Indonesia
      const defaultLng = longitude || 106.8456;
      
      // Load the map - using OpenStreetMap
      const map = window.L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      
      // Add the OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create marker if we have coordinates
      let mapMarker = null;
      if (latitude && longitude) {
        mapMarker = window.L.marker([latitude, longitude], {
          draggable: !readOnly
        }).addTo(map);
        
        // If marker is draggable, update coordinates on dragend
        if (!readOnly) {
          mapMarker.on('dragend', function(e: any) {
            const position = mapMarker.getLatLng();
            onCoordinatesChange(position.lat, position.lng);
          });
        }
      }
      
      // If not readonly, allow clicking on map to set/move marker
      if (!readOnly) {
        map.on('click', function(e: any) {
          if (mapMarker) {
            mapMarker.setLatLng(e.latlng);
          } else {
            mapMarker = window.L.marker(e.latlng, {
              draggable: true
            }).addTo(map);
            
            mapMarker.on('dragend', function(e: any) {
              const position = mapMarker.getLatLng();
              onCoordinatesChange(position.lat, position.lng);
            });
            
            setMarker(mapMarker);
          }
          
          onCoordinatesChange(e.latlng.lat, e.latlng.lng);
        });
      }
      
      setMapObject(map);
      setMarker(mapMarker);
    }
  };
  
  // Update marker if lat/lng props change
  useEffect(() => {
    if (mapObject && latitude && longitude) {
      if (marker) {
        marker.setLatLng([latitude, longitude]);
      } else {
        const newMarker = window.L.marker([latitude, longitude], {
          draggable: !readOnly
        }).addTo(mapObject);
        
        if (!readOnly) {
          newMarker.on('dragend', function(e: any) {
            const position = newMarker.getLatLng();
            onCoordinatesChange(position.lat, position.lng);
          });
        }
        
        setMarker(newMarker);
      }
      
      mapObject.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude, mapObject]);
  
  // Handle search for location
  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Please enter a location to search');
      return;
    }
    
    try {
      setError('');
      // Using Nominatim service for geocoding (free)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, {
        headers: {
          'User-Agent': 'Event Management App'
        }
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        
        // Update marker and map view
        if (mapObject) {
          mapObject.setView([lat, lon], 13);
          
          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            const newMarker = window.L.marker([lat, lon], {
              draggable: !readOnly
            }).addTo(mapObject);
            
            if (!readOnly) {
              newMarker.on('dragend', function(e: any) {
                const position = newMarker.getLatLng();
                onCoordinatesChange(position.lat, position.lng);
              });
            }
            
            setMarker(newMarker);
          }
        }
        
        // Update form values
        onLocationChange(display_name);
        onCoordinatesChange(lat, lon);
      } else {
        setError('Location not found. Please try a different search term.');
      }
    } catch (error) {
      setError('Error searching for location. Please try again.');
      console.error('Error searching location:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for a location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button type="button" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={latitude || ''}
                  onChange={(e) => onCoordinatesChange(e.target.value, longitude)}
                  placeholder="Latitude"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={longitude || ''}
                  onChange={(e) => onCoordinatesChange(latitude, e.target.value)}
                  placeholder="Longitude"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Map container */}
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-md border"
          style={{ minHeight: "300px" }}
        ></div>
        
        {readOnly && location && (
          <div className="mt-4">
            <Label>Address</Label>
            <p className="text-sm mt-1">{location}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add global type definition for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

export default LocationMap;