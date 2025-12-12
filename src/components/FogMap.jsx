import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const FogMap = ({ quests }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const canvasRef = useRef(null);
  
  // 📍 CENTER ON HAMPI (Matches your new sites.json)
  const START_LOCATION = [76.4600, 15.3350]; 

  const [visitedPath, setVisitedPath] = useState([START_LOCATION]);
  const [visibleQuests, setVisibleQuests] = useState([]);

  useEffect(() => {
    // 1. Prevent double-mounting in Strict Mode
    if (mapInstance.current) return;

    // 2. Initialize Map
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
      attributionControl: false // Cleaner UI
    });

    mapInstance.current = map;

    // 3. On Load: Add User Marker & Start Fog
    map.on('load', () => {
      // User Marker (Orange Dot)
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse';
      new maplibregl.Marker({ element: el })
        .setLngLat(START_LOCATION)
        .addTo(map);

      // Initial Fog Draw
      drawFog();
    });

    // 4. Bind Events for Redrawing Fog
    map.on('move', drawFog);
    map.on('zoom', drawFog);
    map.on('resize', () => {
      resizeCanvas();
      drawFog();
    });
    
    // Initial Sizing
    resizeCanvas();

    // 5. CLEANUP (Crucial for avoiding white screen on reload)
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // --- GAME LOOP: Simulate Walking ---
  useEffect(() => {
    const interval = setInterval(() => {
        if (!mapInstance.current) return;

        // Walk slightly in a random direction
        const lastLoc = visitedPath[visitedPath.length - 1];
        const newLat = lastLoc[1] + (Math.random() - 0.5) * 0.002; // Small steps
        const newLng = lastLoc[0] + (Math.random() - 0.5) * 0.002;
        const newPoint = [newLng, newLat];

        setVisitedPath(prev => [...prev, newPoint]);
        checkQuestProximity(newPoint);
        
        // Update user marker position if you want (Optional)
        // ...

        drawFog();
    }, 1000); 

    return () => clearInterval(interval);
  }, [visitedPath]); // Re-run when path changes to keep loop alive properly

  // --- HELPER: Resize Canvas ---
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
  };

  // --- HELPER: Draw The Fog Layer ---
  const drawFog = () => {
    const map = mapInstance.current;
    const canvas = canvasRef.current;
    if (!map || !canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // A. Fill screen with Dark Fog
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(20, 20, 20, 0.9)'; // 90% opacity dark grey
    ctx.fillRect(0, 0, width, height);

    // B. Erase "Holes" where user has been
    ctx.globalCompositeOperation = 'destination-out';

    visitedPath.forEach(coord => {
        const screenPoint = map.project(coord);
        
        // Draw soft circle
        const radius = 100; 
        const gradient = ctx.createRadialGradient(
            screenPoint.x, screenPoint.y, 20,
            screenPoint.x, screenPoint.y, radius
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)'); // Clear center
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Foggy edge

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenPoint.x, screenPoint.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
  };

  // --- HELPER: Check Quests ---
  const checkQuestProximity = (userLoc) => {
    if(!quests) return;
    const detectionRange = 0.005; 

    const found = quests.filter(q => {
        if (!q.lat || !q.lng) return false;
        const distLat = Math.abs(q.lat - userLoc[1]);
        const distLng = Math.abs(q.lng - userLoc[0]);
        return (distLat < detectionRange && distLng < detectionRange);
    });

    setVisibleQuests(prev => {
        const ids = new Set(prev.map(p => p.id));
        const newFinds = found.filter(f => !ids.has(f.id));
        
        if (newFinds.length > 0 && mapInstance.current) {
             newFinds.forEach(q => {
                new maplibregl.Marker({ color: '#10B981' }) // Green marker for found quest
                    .setLngLat([q.lng, q.lat])
                    .setPopup(new maplibregl.Popup().setText(`🎉 Found: ${q.name}!`))
                    .addTo(mapInstance.current);
             });
        }
        return [...prev, ...newFinds];
    });
  };

  return (
    <>
      {/* CRITICAL FIX: 
         position: fixed, inset: 0, z-index: 0 
         This breaks the map out of the parent padding/containers 
      */}
      <div 
        ref={mapContainer} 
        className="fixed inset-0 w-full h-full z-0 bg-black" 
      />
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-10 pointer-events-none" 
      />
      
      {/* UI Overlay */}
      <div className="fixed top-28 left-6 z-20 bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-white/50 w-64">
         <h2 className="font-bold text-gray-800 text-lg">Quests Unlocked</h2>
         <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-orange-500">{visibleQuests.length}</span>
            <span className="text-gray-400 mb-1 font-bold">/ {quests?.length || 0}</span>
         </div>
         <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Walk to clear the fog. <br/> Hidden sites will appear on the map!
         </p>
      </div>
    </>
  );
};

export default FogMap;