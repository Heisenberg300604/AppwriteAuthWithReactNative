import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Client, Account, ID, Databases } from "react-native-appwrite"

// Some another Syntax

// let client;
// let account;
// client = new Client();
// client
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject('671fb243000c089289d0')
//   .setPlatform('com.auth.app');

// I prefer this one 

// create new Client with details that can be retrieved from appwrite account.. Settings --> under API
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject('671fb243000c089289d0')
  .setPlatform('com.auth.app');

// create new account
const account = new Account(client);
const databases = new Databases(client);


export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const loginUser = async () => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setUserName(user.name);
      setUserEmail(user.email);
      setResponse(`Login Success: Welcome ${user.name}`);
    } catch (error) {
      setResponse(`Login Error: ${error.message}`);
    }
  }

  const registerUser = async () => {
    try {
      // create() method creates user
      await account.create(
        ID.unique(), // Generates unique ID for user
        email,
        password,
        name
      );
      setResponse(`Registration Successfull !! Now Login to Access the App`);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  const logoutUser = async () => {
    try {
      // Deletes the current session
      await account.deleteSession('current');
      setName('');
      setEmail(''); 
      setPassword('');
      setUserName(null); // Clear the username
      setUserEmail(null); // Clear the email
      setResponse('Logout Success: You have been logged out.');
    } catch (error) {
      setResponse(`Logout Error: ${error.message}`);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register / Login User</Text>

      <TextInput
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={registerUser}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logoutUser}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {response && (
        <Text style={styles.responseText}>
          {response}
        </Text>
      )}
      {userName && userEmail && (
        <Text style={{ marginTop: 20, fontSize: 18, textAlign: 'center' }}>
          Welcome, {userEmail}
        </Text>
      )}
    </View>
  );
}

// Styling is done here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  responseText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});
