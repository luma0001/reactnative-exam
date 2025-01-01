import React from "react";
import MapView from "react-native-maps";
import { Button, View } from "react-native";

export default function MapViewComponent({ onSignOut }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>SEE THIS!!!!!</Text>
      <MapView style={{ width: "100%", height: "90%" }} />
      <Button title="Sign Out" onPress={onSignOut} />
    </View>
  );
}
