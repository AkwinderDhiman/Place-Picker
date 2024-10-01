import { useEffect } from "react";
import Places from "../Places/Places.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  useEffect(() => {
    fetch("http://localhost:3002/user-places")
      .then((res) => res.json())
      .then(console.log);
  }, []);

  return (
    <Places
      title="Available Places"
      places={[]}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
