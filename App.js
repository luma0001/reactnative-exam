import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapView from "react-native-maps";

// --- Import FIrebase Config -----
import { database } from "./firebaseConfig.js";
// --- Import Firebase Functions ----
import { addDoc, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

// --- FIRE STORE DATABASE VAR:
// const [chosenCollection, setChosenCollection] = useState("User");

//#region Default Screen
/*
  ==================================================================================
                                Default Screen
  ==================================================================================
*/

function DefaultScreen({ navigation }) {
  const [date, setDate] = useState("");

  // useEffect(() => {
  //   console.log("DefaultScreen rendered");
  //   alert("Default Screen here");
  // }, []); // Alert only when the component is mounted

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
//#endregion

//#region Date Picker
/*
  ==================================================================================
                                Date Picker
  ==================================================================================
*/

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
//#endregion

//#region List
/*
  ==================================================================================
                                  List
  ==================================================================================
*/

function ListScreen({ navigation }) {
  // const [date, setDate] = useState("");
  const [taskList, setTaskList] = useState([]);
  // --- fra useCollecion, fra firestore
  // ------------------------------------------------------------- note: db-collection
  const [values, loading, error] = useCollection(collection(database, "User"));

  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const renderEvent = ({ item }) => (
    <View style={styles.listEvent}>
      <Text>{item.title}</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate("Event", { itemObject: item })}
      />
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Text>HERE IS A LIST OF TASKS</Text>
      <FlatList
        data={data}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}
//#endregion

//#region Tasks
/*
  ==================================================================================
                                  Event Detail View
  ==================================================================================
*/

function EventScreen({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const event = route.params.itemObject;
  alert(JSON.stringify(event));

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>HERE IS MY EVENT</Text>
      <Text>{event.title}</Text>
      <Text>{event.date}</Text>
      <Text>{event.time}</Text>
      <Text>{event.description}</Text>
      <Text>{event.latitude}</Text>
      <Text>{event.longitude}</Text>
      {/* <Text>Task: {taskId}</Text>
      <TextInput placeholder="Task" onChange={setTitle} value={title} />
      <Text>Details</Text>
      <TextInput placeholder="Details" onChange={setDetails} value={details} /> */}
    </View>
  );
}

//endregion

//#region Map
/*
  ==================================================================================
                                  Map
  ==================================================================================
*/

function MapScreen({ navigation }) {
  const [date, setDate] = useState("");

  return (
    <View style={styles.screenContainer}>
      <Text>HERE IS A MAP</Text>
      <MapView style={styles.map}></MapView>
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}
//#endregion

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
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Event" component={EventScreen} />

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
  map: {
    height: "80%",
    width: "100%",
  },
  listEvent: {
    flex: 1 / 2,
    flexDirection: "row",
    alignContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
