import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const FogMap = () => {
  const mapContainer = useRef(null);
  const canvasRef = useRef(null);

  // Center on Hampi
  const START_LOCATION = [76.4600, 15.3350]; 

  useEffect(() => {
    // 1. Initialize Map
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
      zoom: 13,
    });

    // 2. Draw Static Fog Overlay on Load
    map.on('load', () => {
      drawStaticFog();
    });

    // 3. Keep Canvas Sized Correctly
    map.on('resize', drawStaticFog);

    return () => map.remove();
  }, []);

  const drawStaticFog = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // A. Resize Canvas to Full Screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // B. Fill with Semi-Transparent Black Fog
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'; // 85% Dark Fog
    ctx.fillRect(0, 0, width, height);

    // C. Punch ONE Test Hole in the center (to prove map is under there)
    ctx.globalCompositeOperation = 'destination-out';
    
    // Hole in center of screen
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');  // Clear Center
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');  // Foggy Edges

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset for next draw
    ctx.globalCompositeOperation = 'source-over';
  };

  return (
    <>
      {/* LAYER 1: The Map (Bottom) */}
      <div 
        ref={mapContainer} 
        className="fixed inset-0 w-screen h-screen z-0"
        style={{ backgroundColor: 'black' }} // Fallback color
      />

      {/* LAYER 2: The Fog Canvas (Middle) */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-screen h-screen z-10 pointer-events-none"
      />

      {/* LAYER 3: UI Overlay (Top) */}
      <div className="fixed top-32 left-8 z-20 bg-white p-4 rounded-lg shadow-xl">
        <h2 className="font-bold text-lg">Fog System Check</h2>
        <p className="text-sm text-gray-500">You should see the map below.</p>
      </div>
    </>
  );
};

export default FogMap;