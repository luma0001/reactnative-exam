import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { app } from "./firebase";
import MapView from "react-native-maps";


export default function App() {
  // alert(JSON.stringify(app, null, 4));

  return (
    <View style={styles.container}>
      <MapView style={styles.map}></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
