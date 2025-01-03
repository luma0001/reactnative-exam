import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Default Screen
function DefaultScreen({ navigation }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    console.log("DefaultScreen rendered");
    alert("Default Screen here");
  }, []); // Alert only when the component is mounted

  return (
    <View style={styles.screenContainer}>
      <Button
        title="Go to Date"
        onPress={() => {
          console.log("Navigating to Date");
          navigation.navigate("Date");
        }}
      />
      <Button
        title="Go to List"
        onPress={() => {
          console.log("Navigating to List");
          navigation.navigate("List");
        }}
      />
      <Button
        title="Go to Map"
        onPress={() => {
          console.log("Navigating to Map");
          navigation.navigate("Map");
        }}
      />
      <Button
        title="Go to Event"
        onPress={() => {
          console.log("Navigating to Event");
          navigation.navigate("Event");
        }}
      />
    </View>
  );
}

// Date Picker Screen
function DatePickerScreen({ navigation }) {
  return (
    <View style={styles.screenContainer}>
      <Text>Task</Text>
      <TextInput placeholder="Task" onChangeText={() => {}} />
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}

// Stack Navigation Setup
const Stack = createNativeStackNavigator();

// App component
export default function App() {
  const [enteredText, setEnteredText] = useState("type here");

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Default">
        <Stack.Screen name="Default" component={DefaultScreen} />
        <Stack.Screen name="Date" component={DatePickerScreen} />
        {/* You can add more screens like List, Map, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
});
