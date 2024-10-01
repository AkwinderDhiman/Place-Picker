import { useState, useEffect } from "react";
import Error from "../Error.jsx";
import { sortPlacesByDistance } from "../../location.jsx";
import { fetchAvailablePlaces } from "../Api/http.jsx";

export default function Places({ title, onSelectPlace }) {
  const baseUrl = "http://localhost:3002/";
  const [places, setPlaces] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState(null);

  // useEffect(() => {
  //   fetch(`${baseUrl}places`)
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setPlaces(data.places);
  //     });
  // }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setFetchingData(true);

        const availablePlaces = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            availablePlaces,
            position.coords.latitude,
            position.coords.longitude
          );
          setPlaces(sortedPlaces);
          setFetchingData(false);
        });
      } catch (error) {
        setErrors({
          message: error.message || "Could not found, Please try again later!",
        });
      }
      setFetchingData(false);
    };

    fetchPlaces();
  }, []);

  return (
    <section className="places-category">
      <h2>{title}</h2>
      {places.length === 0 && <p className="fallback-text">Loading...</p>}
      {errors && <Error title={"An error Occured."} message={errors.message} />}
      {places.length > 0 && (
        <ul className="places">
          {places.map((place) => (
            <li key={place?.id} className="place-item">
              <button onClick={() => onSelectPlace(place)}>
                <img
                  src={`${baseUrl}${place?.image?.src}`}
                  alt={place?.image?.alt}
                />
                <h3>{place?.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
