import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
// --- Import Navigation -----
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// --- Import Maps -----
import MapView, { Marker } from "react-native-maps";
// --- Import Firebase Config -----
import { database } from "./firebaseConfig.js";
// --- Import Firebase Functions ----
import {
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  doc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

//#region Default Screen
/*
  ==================================================================================
                                Default Screen
  ==================================================================================
*/

function DefaultScreen({ navigation }) {
  const [date, setDate] = useState("");

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
  const [taskList, setTaskList] = useState([]);
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
      <Text>Your Day:</Text>
      <Button
        title="New Event"
        onPress={() => navigation.navigate("NewEvent")}
      />
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

//#region Event View
/*
  ==================================================================================
                                  Event Detail View
  ==================================================================================
*/

function EventScreen({ navigation, route }) {
  // ---- Eoggle edit ----
  const [viewOnly, setViewOnly] = useState(true);
  // --- Event object ----
  const [event, setEvent] = useState(route.params.itemObject);
  // ---- Event Attribures ----
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (!viewOnly) {
      setTitle(event.title);
      setDate(event.date);
      setTime(event.time);
      setDescription(event.description);
      setLatitude(event.coordinate.latitude);
      setLongitude(event.coordinate.longitude);
    }
  }, [viewOnly, event]);

  function handleSetLocation() {
    alert("Set location pressed");
  }

  function toggleEditMode() {
    setViewOnly(!viewOnly);
  }

  async function handleSaveEvent() {
    try {
      const eventRef = doc(database, "User", event.id);
      await updateDoc(eventRef, {
        title,
        date,
        time,
        description,
        latitude,
        longitude,
      });

      setEvent((prevEvent) => ({
        ...prevEvent,
        title,
        date,
        time,
        description,
        coordinate: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      }));

      toggleEditMode();
    } catch (error) {
      console.log("Error while updating event: ", error);
    }
  }

  async function handleDeleteEvent(id) {
    try {
      await deleteDoc(doc(database, "User", id));
      navigation.goBack();
    } catch (error) {
      console.error("Error when deleting event: ", error);
    }
  }

  return (
    <View style={styles.screenContainer}>
      {viewOnly ? (
        // View mode
        <View>
          <Text style={styles.title}>{event.title}</Text>
          <Text>{event.date}</Text>
          <Text>{event.time}</Text>
          <Text>{event.description}</Text>
          <Text>{event.coordinate.latitude}</Text>
          <Text>{event.coordinate.longitude}</Text>
          <Button title="Edit" onPress={toggleEditMode} />
          <Button title="Delete" onPress={() => handleDeleteEvent(event.id)} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Edit Event</Text>
          <Text>Title</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <Text>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={date}
            onChangeText={setDate}
          />
          <Text>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={time}
            onChangeText={setTime}
          />
          <Text>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Text>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
          />
          <Button title="Set Location" onPress={handleSetLocation} />
          <Button title="Save Changes" onPress={handleSaveEvent} />
        </View>
      )}
    </View>
  );
}

//endregion

//#region Event View
/*
  ==================================================================================
                               NewEvent
  ==================================================================================
*/

function NewEventScreen({ navigation }) {
  // ---- Event Attribures ----
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  async function handleCreateEvent() {
    try {
      await addDoc(collection(database, "User"), {
        title,
        date,
        time,
        description,
        latitude,
        longitude,
      });

      navigation.goBack();
    } catch (error) {
      console.log("Error while creating event: ", error);
    }
  }

  return (
    <View>
      <Text style={styles.title}>Edit Event</Text>
      <Text>Title</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <Text>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <Text>Time</Text>
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={setTime}
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Text>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
      />
      <Button title="Save Event" onPress={handleCreateEvent} />
    </View>
  );
}

//#endregion

//#region Map
/*
  ==================================================================================
                                  Map
  ==================================================================================
*/

function MapScreen({ navigation }) {
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 12,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  async function fetchRegions() {
    try {
      const eventDocs = await getDocs(collection(database, "User"));
      const allEvents = eventDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setEvents(allEvents);
    } catch (error) {
      console.log("Error fetching regions:", error);
    }
  }

  // function addMarker() {
  //   alert("Marker Added");
  // }

  function handlePressMarker(event) {
    alert("MARKER PRESSED!");
    navigation.navigate("Event", { itemObject: event });
  }

  return (
    <View style={styles.screenContainer}>
      <Text>HERE IS A MAP</Text>
      <MapView style={styles.map} reion={region}>
        {events.map((event) => (
          <Marker
            coordinate={event.coordinate}
            key={event.id}
            title={event.title}
            onPress={() => handlePressMarker(event)}
          />
        ))}
      </MapView>
      <Button
        title="Go to Default"
        onPress={() => navigation.navigate("Default")}
      />
    </View>
  );
}
//#endregion

//#region App
/*
  ==================================================================================
                                App
  ==================================================================================
*/

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="NewEvent" component={NewEventScreen} />
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});

//#endregion
