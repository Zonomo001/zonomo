import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function LocationDisplay() {
  const [location, setLocation] = useState<string>("Fetching location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "Zonomo-App", // Important for Nominatim API
              },
            }
          );

          const data = await res.json();

          if (data && data.address) {
            const {
              suburb,
              neighbourhood,
              road,
              village,
              town,
              city,
              county,
              state,
            } = data.address;

            const area =
              suburb ||
              neighbourhood ||
              road ||
              village ||
              town ||
              city ||
              county ||
              state ||
              "Your Location";

            setLocation(area);
          } else {
            setLocation("Unable to fetch location");
          }
        } catch (error) {
          console.error(error);
          setLocation("Failed to fetch location");
        }
      },
      (error) => {
        console.error(error);
        setLocation("Location access denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="flex items-center text-[10px] opacity-80 mt-0.5">
      <MapPin className="w-3 h-3 mr-1" />
      <span>{location}</span>
    </div>
  );
}
