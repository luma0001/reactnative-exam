import React from "react";
import { Button, View } from "react-native";

export default function MapViewComponent({ onSignOut }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>HERE IS A MAP VIEW</Text>
      <Button title="Sign Out" onPress={onSignOut} />
    </View>
  );
}
