import React, { useState, useLayoutEffect } from "react";
import { View, ScrollView, Text, ImageBackground, KeyboardAvoidingView, Button, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation } from "react-native";
import * as Google from 'expo-google-app-auth';
import { SocialIcon } from 'react-native-elements'

import * as firebase from "firebase";

import { auth } from '../firebase'


const LoginScreen2 = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(null)
    const [user, setUser] = useState(null)


    const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    // SignIn
    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error));
    }

    // Google SignIn
    const onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase
            .auth()
            .onAuthStateChanged(function (firebaseUser) {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!isUserEqual(googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    // Sign in with credential from the Google user.
                    firebase
                        .auth()
                        .signInWithCredential(credential)
                        .then(function (result) {
                            console.log('user signed in ');
                            if (result.additionalUserInfo.isNewUser) {
                                firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(result.user.uid)
                                    .set({
                                        email: result.user.email,
                                        avatar: result.additionalUserInfo.profile.picture,
                                        locale: result.additionalUserInfo.profile.locale,
                                        firstname: result.additionalUserInfo.profile.given_name,
                                        name: result.additionalUserInfo.profile.family_name,
                                        uid: result.user.uid,
                                        created_at: Date.now()
                                    })
                                    .then(function (snapshot) {

                                    });
                            } else {
                                firebase
                                    .database()
                                    .ref('/users/' + result.user.uid).update({
                                        last_login: Date.now()
                                    })
                            }
                        })
                        .catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            // ...
                        });
                } else {
                    console.log('User already signed-in Firebase.');
                }
            }.bind(this)
            );
    }

    const signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                //androidClientId: YOUR_CLIENT_ID_HERE,
                iosClientId: '435511933422-rhckjv07hjuqv9rvbblpng5i8jn25pvr.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });
            if (result.type === 'success') {
                onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    };
    LayoutAnimation.easeInEaseOut();

    return (
        <ImageBackground source={require("./assets/BackGround(h).png")} style={{ width: '100%', height: '100%' }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                <Image
                    source={require("./assets/authHeader.png")}
                    style={{ opacity: 0, marginTop: -176, marginLeft: -50 }}
                ></Image>
                <Image
                    source={require("./assets/Logo(White).png")}
                    style={styles.logo}
                ></Image>
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

                    <View style={styles.form}>
                        <View style={{ marginTop: 48 }}>
                            <Text style={styles.inputTitle}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                            ></TextInput>
                        </View>

                        <View style={{ marginTop: 32 }}>
                            <Text style={styles.inputTitle}>Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                autoCapitalize="none"
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                            ></TextInput>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("ResetPassword")}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate("Register")}>
                        <Text style={{ color: "#ec404b", fontWeight: "500" }}>Sign Up</Text>
                    </TouchableOpacity>
                    <View style={styles.googleSingIn} >
                        <Text style={styles.forgotPasswordText}>or</Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                        <SocialIcon
                            onPress={signInWithGoogleAsync}
                            type='google'
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
            <View style={styles.errorMessage}>
                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            </View>
        </ImageBackground>

    );
}

export default LoginScreen2;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 48,
        marginTop: 0
    },
    greeting: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center",
        color: "white"
    },
    logo: {
        marginTop: -90,
        marginHorizontal: 30,
        marginBottom: 10,
        width: '84%',
        height: '16%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    form: {
        marginBottom: 38,
        marginHorizontal: 30
    },
    inputTitle: {
        fontSize: 10,
        textTransform: "uppercase",
        color: "white"
    },
    input: {
        borderBottomColor: "white",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "white"
    },
    forgotPassword: {
        alignSelf: "center",
        marginBottom: 30
    },
    forgotPasswordText: {
        color: "white",
        fontSize: 10,
    },
    googleSingIn: {
        alignSelf: "center",
        marginVertical: 30
    },
    button: {
        marginBottom: 12,
        marginHorizontal: 30,
        backgroundColor: "#ec404b",
        borderRadius: 30,
        height: 42,
        alignItems: "center",
        justifyContent: "center"
    },
    button2: {
        marginHorizontal: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
        color: "white"
    },
    error: {
        color: "white",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    }
});