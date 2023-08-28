import { createContext, useCallback, useContext, useReducer } from "react";
import { useState, useEffect } from "react";

const URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: true,
        error: action.payload,
      };
    default:
      throw new Error("error occured here at reducer function.");
  }
}

export function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchlist() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const data = await fetch(`${URL}/cities`);
        const res = await data.json();
        dispatch({ type: "cities/loaded", payload: res });
        // setCities(res);
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error occur while loading the data.",
        });
      }
    }
    fetchlist();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });

      try {
        // setIsLoading(true);
        const data = await fetch(`${URL}/cities/${id}`);
        const res = await data.json();
        dispatch({ type: "city/loaded", payload: res });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error occur while loading the city....",
        });
      }
    },
    [currentCity]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      // setIsLoading(true);
      const data = await fetch(`${URL}/cities`, {
        method: "post",
        body: JSON.stringify(newCity),
        headers: {
          "content-Type": "application/json",
        },
      });
      const res = await data.json();
      // console.log(res);
      dispatch({ type: "city/created", payload: res });
      // setCities((cities) => [...cities, res]);
      // setCurrentCity(res);
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error occur while creating the city....",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      // setIsLoading(true);
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      // alert("Error deleting city.");
      dispatch({
        type: "rejected",
        payload: "There was an error occur while deletig the city....",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        error,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context was used outside the context provider.");
  return context;
}
