import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Navigation, MapPin, Search, X, Crosshair, ArrowUp, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const FogMap = () => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Default start: Hampi
  const START_LOCATION = [76.4600, 15.3350];

  useEffect(() => {
    if (mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          }
        ]
      },
      center: START_LOCATION,
      zoom: 14,
      pitch: 0, // start 2D, switch to 3D on nav
    });

    mapInstance.current = map;

    // 1. Controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');

    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocate, 'bottom-right');

    geolocate.on('geolocate', (e) => {
      const newUserLocation = [e.coords.longitude, e.coords.latitude];
      setUserLocation(newUserLocation);

      // If navigating and following, smooth pan to user
      if (isNavigating && isFollowingUser && mapInstance.current) {
        mapInstance.current.easeTo({
          center: newUserLocation,
          zoom: 17,
          pitch: 60, // 3D driving view
          bearing: e.coords.heading || 0
        });
      }
    });

    map.on('load', () => {
      geolocate.trigger();

      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 8, 'line-opacity': 0.8 }
      });
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [isNavigating, isFollowingUser]);


  // --- CUSTOM SEARCH FUNCTION ---
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Explicit fetch to Nominatim
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&polygon_geojson=1&addressdetails=1`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPlace = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const coords = [lon, lat];

    setDestination({
      name: place.display_name.split(',')[0],
      fullAddress: place.display_name,
      coords: coords
    });
    setSearchQuery(place.display_name.split(',')[0]);
    setShowResults(false);
    setIsNavigating(false);

    if (mapInstance.current) {
      mapInstance.current.flyTo({ center: coords, zoom: 16 });
    }
  };


  // --- ROUTING FUNCTION ---
  const fetchRoute = async (start, end) => {
    try {
      const query = `${start[0]},${start[1]};${end[0]},${end[1]}`;
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson&steps=true`);
      const json = await response.json();

      if (json.routes && json.routes.length > 0) {
        const route = json.routes[0];
        setRouteInfo({
          duration: Math.round(route.duration / 60),
          distance: (route.distance / 1000).toFixed(1)
        });
        setSteps(route.legs[0].steps);
        setCurrentStepIndex(0);

        if (mapInstance.current) {
          const source = mapInstance.current.getSource('route');
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            });
          }

          // Fit bounds if not already navigating/following
          if (!isNavigating) {
            const bounds = new maplibregl.LngLatBounds();
            route.geometry.coordinates.forEach(coord => bounds.extend(coord));
            mapInstance.current.fitBounds(bounds, { padding: 80 });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setIsFollowingUser(true);
    // Tilt map for driving mode
    if (mapInstance.current && userLocation) {
      mapInstance.current.flyTo({
        center: userLocation,
        zoom: 18,
        pitch: 60,
        bearing: 0 // Default north up, geolocate updates actual heading
      });
    }
    if (userLocation && destination) {
      fetchRoute(userLocation, destination.coords);
      // Poll route every 10s (simulated logic)
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setIsFollowingUser(false);
    setRouteInfo(null);
    setSteps([]);
    setDestination(null); // Clear destination on exit
    setSearchQuery(''); // Clear search
    if (mapInstance.current) {
      mapInstance.current.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      mapInstance.current.easeTo({ pitch: 0, zoom: 14 }); // Reset view
    }
  };

  const getTurnIcon = (maneuver) => {
    if (!maneuver) return <ArrowUp size={30} />;
    const type = maneuver.type;
    const modifier = maneuver.modifier;
    if (modifier?.includes('left')) return <ArrowLeft size={30} />;
    if (modifier?.includes('right')) return <ArrowRight size={30} />;
    return <ArrowUp size={30} />;
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-100 font-sans">
      <div ref={mapContainer} className="w-full h-full" />

      {/* --- CUSTOM SEARCH BAR --- */}
      {!isNavigating && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-20">
          <div className="relative shadow-xl rounded-full overflow-hidden border border-gray-200 bg-white/90 backdrop-blur-md flex items-center px-4 py-3">
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search destination..."
              className="bg-transparent outline-none flex-1 text-gray-800 placeholder-gray-500 font-medium"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            {isSearching ? (
              <Loader2 size={20} className="text-blue-500 animate-spin" />
            ) : searchQuery ? (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }}><X size={20} className="text-gray-400" /></button>
            ) : null}
          </div>

          {/* READ SEARCH RESULTS */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  onClick={() => selectPlace(place)}
                  className="px-4 py-3 border-b hover:bg-blue-50 cursor-pointer flex items-start gap-3 transition"
                >
                  <MapPin size={16} className="mt-1 text-red-500 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{place.display_name.split(',')[0]}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{place.display_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOP NAVIGATION PANEL: Turn Directions */}
      {isNavigating && steps.length > 0 && (
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-green-600 text-white p-4 rounded-xl shadow-2xl z-20 flex items-center gap-4 animate-slide-down">
          <div className="bg-white/20 p-3 rounded-full">
            {getTurnIcon(steps[currentStepIndex + 1]?.maneuver)}
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">
              {steps[currentStepIndex + 1]?.distance < 1000
                ? `${Math.round(steps[currentStepIndex + 1]?.distance)} m`
                : `${(steps[currentStepIndex + 1]?.distance / 1000).toFixed(1)} km`}
            </p>
            <p className="text-sm font-medium opacity-90 line-clamp-2">
              {steps[currentStepIndex + 1]?.maneuver.instruction}
            </p>
          </div>
        </div>
      )}

      {/* BOTTOM PANEL: Trip Info */}
      {destination && (
        <div className="absolute bottom-10 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white rounded-2xl shadow-xl p-5 z-20 border border-gray-100 flex flex-col gap-4">

          {/* Destination Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{destination.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{destination.fullAddress}</p>
            </div>
            <button onClick={() => setDestination(null)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <X size={16} />
            </button>
          </div>

          {/* Route Stats */}
          {routeInfo && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
              <div className="text-center w-1/2 border-r border-blue-200">
                <span className="block text-2xl font-black text-blue-600">{routeInfo.duration}</span>
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">Minutes</span>
              </div>
              <div className="text-center w-1/2">
                <span className="block text-2xl font-black text-gray-700">{routeInfo.distance}</span>
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Kilometers</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isNavigating ? (
              <button
                onClick={startNavigation}
                disabled={!userLocation}
                className="flex-1 bg-brand-accent text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 active:scale-95 transition disabled:opacity-50 disabled:grayscale"
              >
                Start Navigation
              </button>
            ) : (
              <button
                onClick={stopNavigation}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 active:scale-95 transition"
              >
                Exit Navigation
              </button>
            )}

            {/* Recenter Button (Only when navigating) */}
            {isNavigating && (
              <button
                onClick={() => setIsFollowingUser(true)}
                className={`p-3 rounded-xl border-2 ${isFollowingUser ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-200 text-gray-400'}`}
              >
                <Crosshair size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FogMap;