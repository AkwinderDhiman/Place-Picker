export async function fetchAvailablePlaces() {
  const baseUrl = "http://localhost:3002/";

  const response = await fetch(`${baseUrl}places`);
  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }

  const data = await response.json();
  return data.places;
}

export async function updateUserPlaces(places) {
  const baseUrl = "http://localhost:3002/";
  const response = await fetch(`${baseUrl}user-places`, {
    method: "PUT",
    body: JSON.stringify({ places: places }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update User places");
  }

  const data = await response.json();
  
  if (!data.places) {
    throw new Error("Invalid response format: 'places' field not found");
  }
  return data.places;
}
