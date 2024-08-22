// src/CustomerMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const CustomerMap = () => {
  const [positions, setPositions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://shopifydataviz-backend.onrender.com/data/customer'); // Adjust this endpoint as needed
        const data = await response.json();
        setTotalCount(data.length); // Set the total count of customers
        console.log(data)
        
        for (const customer of data) {
          if (customer.default_address?.city) {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(customer.default_address.city)}&format=json&limit=1`);
            const geoData = await geoResponse.json();
            if (geoData.length > 0) {
              setPositions((prevPositions) => [
                ...prevPositions,
                {
                  lat: geoData[0].lat,
                  lon: geoData[0].lon,
                  address: customer.default_address.city,
                },
              ]);
              setFoundCount((prevCount) => prevCount + 1); // Increment the found count
            }
          }
        }
      } catch (error) {
        console.error('Error fetching customers or geolocation data:', error);
      }
    };

    fetchCustomers();
  }, []);

  const percentageFound = totalCount > 0 ? (foundCount / totalCount) * 100 : 0;

  return (
     <>
        <div id="Maps" className="flex flex-col items-center w-[95%] h-[600px] border-1 border-[black] rounded-[5px] mx-auto my-[70px] shadow-2xl ">
         
         <h1 className='text-[40px]'>Geographical Distribution of Customers</h1>
         <h2 className='text-[20px]'>Percentage of Customers with Coordinates Found: {percentageFound.toFixed(2)}%</h2>

          <div className='w-full h-full  mt-[40px]'>

            <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {positions.map((pos, idx) => (
                <Marker key={idx} position={[pos.lat, pos.lon]}>
                  <Popup>
                    {pos.address}
                    <h1 className='text-[black] text-[30px]'>{pos.address}</h1>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
     </>
  );
};

export default CustomerMap;
