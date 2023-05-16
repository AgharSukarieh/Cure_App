import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

export default function MapMH({lat, long, style}) {
    const currentRegion = {
        latitude: lat, 
        longitude: long,
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