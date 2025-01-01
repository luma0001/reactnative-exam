import React, { useState } from "react";
import { TextInput, Button, Text, View } from "react-native-web";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth();

export function LogIn({ onLogin }) {
  const [enteredEmail, setEnteredEmail] = useState("HenryTestman@email.com");
  const [enteredPassword, setEnteredPassword] = useState("2012OpaGangmanStyle");

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

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        onChange={(newText) => setEnteredEmail(newText)}
        value={enteredEmail}
        placeholder="Email"
      />
      <TextInput
        onChange={(newText) => setEnteredPassword(newText)}
        value="enteredPassword"
        secreTextEntry
      />
      <Button title="Log in" onPress={login} />
    </View>
  );
}

export function signUp({ onSignUp }) {
  const [enteredEmail, setEnteredEmail] = useState("HenryTestman@email.com");
  const [enteredPassword, setEnteredPassword] = useState("2012OpaGangmanStyle");

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
    <View>
      <TextInput
        onChange={(newText) => setEnteredEmail(newText)}
        values={enteredEmail}
        placeholder="Email"
      />
      <TextInput
        onChange={(newText) => setEnteredPassword(newText)}
        values={enteredPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Signup" onPress={signup} />
    </View>
  );
}
