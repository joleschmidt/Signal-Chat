import React, { useState } from "react";
import { StyleSheet, Text, KeyboardAvoidingView, ScrollView, TextInput, View, TouchableOpacity, Image, StatusBar, ImageBackground, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import DatePicker from 'react-native-datepicker'
import Constants from "expo-constants";
import { Dropdown } from "react-native-material-dropdown-v2";
import Fire from './screens/Fire'
import RegisterScreen from "./RegisterScreen";

const firebase = require("firebase");
require("firebase/firestore");

const options = {
    allowsEditing: true
};

const RegisterScreen2 = () => {

    const [user, setUser] = useState({
        firstname: "",
        name: "",
        email: "",
        password: "",
        birthday: "",
        avatar: null
    });

    const [errorMessage, setErrorMessage] = useState({
        errorMessage: null
    });



    handleSignUp = () => {
        Fire.shared.createUser(user);
    };

    componentDidMount = () => {
        this.getPhotoPermission();
    };

    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };

    handlePickAvatar = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            setState({ user: { ...user, avatar: result.uri } });
        }
    };


    let gender = [{
        value: '-',
    }, {
        value: 'Male',
    }, {
        value: 'Female',
    }, {
        value: 'idk',
    }];

    return (
        <ImageBackground source={require("./assets/BackGround(h).png")} style={{ width: '100%', height: '100%' }}>
            <ScrollView style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                <Image
                    source={require("./assets/authHeader.png")}
                    style={{ opacity: 0, marginTop: -200, marginLeft: -50 }}
                ></Image>
                <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
                    <Ionicons name="ios-arrow-round-back" size={32} color="#FFF"></Ionicons>
                </TouchableOpacity>
                <View style={{ position: "absolute", alignItems: "center", width: "100%" }}>
                    <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <Ionicons
                            name="ios-add"
                            size={40}
                            color="#FFF"
                            style={{ marginTop: 6, marginLeft: 2 }}
                        ></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={firstname => setUser({ user: { ...user, firstname } })}
                            value={user.firstname}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={styles.inputTitle}>Name</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={name => setUser({ user: { ...user, name } })}
                            value={user.name}
                        ></TextInput>
                    </View>
                    <View style={{ marginTop: 12 }}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={email => setUser({ user: { ...user, email } })}
                            value={user.email}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={password => setUser({ user: { ...user, password } })}
                            value={user.password}
                        ></TextInput>
                    </View>

                    {/* <View style={{ marginTop: 12 }}>
                            <Text style={styles.inputTitle}>Gender</Text>
                            <Dropdown
                                baseColor="white"
                                color="white"
                                data={gender}
                                fontSize={15}
                                onChangeText={gender => this.setState({ user: { ...this.state.user, gender } })}
                                value={this.state.user.gender}
                                containerStyle={{
                                    textColor: "white",
                                }}
                                inputContainerStyle={{
                                    textColor: "white",
                                    marginTop: -26,
                                    marginBottom: 5
                                }}
                            />
                        </View> */}

                    <View style={{ marginTop: 12 }}>
                        <Text style={styles.inputTitle}>Birthday</Text>
                        <DatePicker
                            date={this.state.user.birthday}
                            format="DD-MM-YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            mode="date"
                            onDateChange={(birthday) => { setUser({ user: { ...user, birthday: birthday } }) }}
                            onChangeText={birthday => setUser({ user: { ...user, birthday } })}
                            value={tuser.birthday}
                            customStyles={{
                                btnTextConfirm: {
                                    color: "#ec404b",
                                    marginLeft: 0
                                },
                                dateText: {
                                    color: "white",
                                    fontSize: 15,
                                },
                                placeholderText: {
                                    fontSize: 15,
                                    color: "white",
                                },
                                placeholder: {
                                    marginLeft: 0
                                },
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 8,
                                    marginLeft: 0,
                                    height: 24,
                                    width: 24,
                                },
                                dateInput: {
                                    marginLeft: 24,
                                    borderWidth: 0
                                }
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.errorMessage}>
                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            </View>
        </ImageBackground>
    );

}
export default RegisterScreen2

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
        color: "#FFF"
    },
    form: {
        marginBottom: 24,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "white",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "white",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "white"
    },
    inputBorder: {
        borderBottomColor: "white",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    date: {
        borderBottomColor: "white",
        fontSize: 10,
        marginTop: 14,
        color: "white"
    },
    button: {
        marginVertical: 12,
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
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
        color: "white"
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    back: {
        position: "absolute",
        top: 48,
        left: 32,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center"
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: "#E1E2E6",
        opacity: 0.7,
        borderRadius: 50,
        marginTop: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50
    }
});