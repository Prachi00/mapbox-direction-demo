import { useRef, useEffect, useState } from "react";
import { Inputs } from "../Inputs";
import styles from "./Map.module.scss";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

//mapbox token stored in .env
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_KEY;

//initial setup for map
const mapParams = {
  lng: 5,
  lat: 34,
  zoom: 3,
};

const Map = ({}) => {
  // reference for mapelement
  const mapEl = useRef(null);
  /* using map and directions as a variable, not keeping them in state
     as we don't want to re render the component when they change, so
     useRef handles this too. */
  let map = useRef(null);
  let directions = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapEl.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [mapParams.lng, mapParams.lat],
      zoom: mapParams.zoom,
    });
    directions.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
      interactive: false,
      controls: {
        inputs: false,
      },
    });
    map.current.addControl(directions.current, "bottom-right");
  }, []);

  const addLocationToMap = (locations) => {
    // loop through the locations selected
    locations.forEach(({ location }, index) => {
      // set 0th as origin
      if (index === 0) {
        directions.current.setOrigin([location.lon, location.lat]);
      } else if (index === locations.length - 1) {
        // set last as destination
        directions.current.setDestination([location.lon, location.lat]);
      } else {
        // set others as waypoints and add markers for them as mapbox doesn't give any
        directions.current.addWaypoint(index, [location.lon, location.lat]);
        const marker = new mapboxgl.Marker()
          .setLngLat([location.lon, location.lat])
          .addTo(map.current);
        // keep track of markers so that they can be removed
        setMarkers((prev) => {
          const cloned = [...prev];
          cloned[index] = marker;
          return cloned;
        });
      }
    });
  };

  const removePoint = (index) => {
    // find the marker on the index
    if (markers[index]) {
      // get lat long from the marker
      var { lat, lng } = markers[index]._lngLat;
      // remove the marker
      markers[index].remove();
      // update marker array
      setMarkers((prev) => {
        const cloned = [...prev];
        cloned.splice(index, 1);
        return cloned;
      });
    }
    // get all the current waypoints and find if the currently removed one exists
    const findPoint = directions.current.getWaypoints().findIndex((item) => {
      const [pLng, pLat] = item.geometry.coordinates;
      return pLat === lat && pLng === lng;
    });
    // if the waypoint exists, we remove it from the map directions
    if (findPoint > -1) {
      directions.current.removeWaypoint(findPoint);
    }
  };

  return (
    <div className={styles.container}>
      <Inputs updateMap={addLocationToMap} removePoint={removePoint} />
      <div className={styles.container__map} ref={mapEl}></div>
    </div>
  );
};

export default Map;
