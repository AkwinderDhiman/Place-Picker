import "./App.css";
import { useEffect, useState } from "react";
import Logo from "../src/assets/logo.png";
import Places from "./Components/Places/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import DeleteConfirmDialog from "./Components/Dialog/DeleteConfirmDialog.jsx";
import { sortPlacesByDistance } from "./location.jsx";
import { updateUserPlaces } from "./Components/Api/http.jsx";
import AvailablePlaces from "./Components/AvailablePlaces/AvailablePlaces.jsx";

function App() {
  const [userPlaces, setUserPlaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [placeToRemove, setPlaceToRemove] = useState(null);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // Load picked places from localStorage on mount
  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    const storedPlaces = storedIds.map((id) =>
      AVAILABLE_PLACES.find((place) => place.id === id)
    );
    setUserPlaces(storedPlaces);
  }, []);

  // Sort available places based on user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const sortedPlaces = sortPlacesByDistance(
          AVAILABLE_PLACES,
          latitude,
          longitude
        );
        setAvailablePlaces(sortedPlaces);
      },
      (error) => {
        console.error("Error fetching location", error);
      }
    );
  }, []);

  const handleSelectPlace = async (selectedPlace) => {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updateUserPlaces(updatedPlaces);
    } catch (error) {
      setUserPlaces(userPlaces);
      console.error("Failed to update user places:", error.message);
    }
  };

  const handleRemovePlace = (placeId) => {
    setVisible(true);
    setPlaceToRemove(placeId);
  };

  const accept = () => {
    const updatedPlaces = userPlaces.filter(
      (place) => place.id !== placeToRemove
    );
    setUserPlaces(updatedPlaces);
    setVisible(false);

    const storedPlaces =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedPlaces.filter((id) => id !== placeToRemove))
    );
  };

  const reject = () => {
    setVisible(false);
  };

  return (
    <>
      <div className={visible ? "blur-background" : "no-blur"}>
        <header>
          <img src={Logo} alt="Place Picker Logo" />
          <h1>PlacePicker</h1>
          <p>Create your personal collection of places you'd like to visit.</p>
        </header>

        <main>
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleRemovePlace}
          />
          <Places
            title="Available Places"
            places={availablePlaces}
            onSelectPlace={handleSelectPlace}
          />

          {/* <AvailablePlaces onSelectPlace={handleSelectPlace} /> */}
          <DeleteConfirmDialog
            visible={visible}
            onHide={() => setVisible(false)}
            accept={accept}
            reject={reject}
          />
        </main>
      </div>
    </>
  );
}

export default App;
