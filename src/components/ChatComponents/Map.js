import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

export default function MapMH({lat, long, style}) {
    const currentRegion = {
        latitude: 35.6762,
        longitude: 139.6503,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  return (
    <MapView
      style={style}
      initialRegion={currentRegion}
    >
      <Marker coordinate={currentRegion} />
    </MapView>
  );
}