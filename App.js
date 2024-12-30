// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { app, database, storage } from "./firebaseConfig.js";
import { firebaseConfig } from "./firebaseConfig.js";
// import MapView from "react-native-maps";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
// Login firebase auth
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// import { unsubscribe } from "diagnostics_channel";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   initializeAuth,
//   getReactNativePersistence,
//   setPersistence,
//   browserLocalPersistence,
// } from "firebase/auth";

let auth = getAuth(app);

/*

This is giving some errors - if I can make it work, good.

if (Platform.OS !== "web") {
  // Gemmer auth i devicen - virker dog ikke
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
*/

export default function App() {
  // Very silly to hve stuff like this hardcoded here...
  const [enteredEmail, setEnteredEmail] = useState("totallyreal3@email.com");
  const [enteredPassword, setEnteredPassword] = useState("123numanumayay");
  const [userId, setUserId] = useState(null);
  const [enteredText, setenteredText] = useState("type here");

  // "seemed to work"
  //alert(JSON.stringify(app, null, 4));

  // Kører når programmet starter
  useEffect(() => {
    const auth_ = getAuth();
    // Unsubscribe - mounter componenten...
    // Listener som håndtere om brugeren er logget ind eller ud
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  async function addDocument() {
    try {
      await addDoc(collection(database, userId), {
        text: enteredText,
      });
    } catch (error) {
      console.log("error addDocument " + error);
    }
  }

  // VI SKAL benytte CLIENT måden hvor man automatisk for log-in statet med...
  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      console.log("logged in " + userCredential.user.uid);
    } catch (error) {}
  }

  async function sign_out() {
    await signOut(auth);
  }

  async function signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      console.log("User created: " + userCredential.user.uid);
    } catch (error) {}
  }

  return (
    // <View style={styles.container}>
    //   <MapView style={styles.map}></MapView>
    // </View>
    <View style={styles.container}>
      {!userId && (
        <>
          <Text>Login</Text>
          <TextInput
            onChangeText={(newText) => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput
            onChangeText={(newText) => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <Button title="Log in" onPress={login} />

          <TextInput
            onChangeText={(newText) => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput
            onChangeText={(newText) => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <Button title="Signup" onPress={signup} />
        </>
      )}
      {userId && (
        <>
          <TextInput
            onChangeText={(newText) => setenteredText(newText)}
            value={enteredText}
          />

          <Button title="Add new Document" onPress={addDocument} />
          <Button title="Sign Out" onPress={sign_out} />
        </>
      )}
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
