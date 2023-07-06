import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuthContext } from '../contexts/AuthContext';

function DeliveryAddressScreen() {
    const { dbUser } = useAuthContext();
    const [name, setName] = useState(dbUser?.name || '');
    const [address, setAddress] = useState(dbUser?.address || '');
    const [phoneNumber, setPhoneNumber] = useState(dbUser?.phoneNumber || '');
    const [lat, setLat] = useState(dbUser?.lat.toString() || '0');
    const [lng, setLng] = useState(dbUser?.lng.toString() || '0');
    const [paymentMethod, setPaymentMethod] = useState('');


    const [region, setRegion] = useState({
        latitude: 12.669160,
        longitude: 79.287086,
        latitudeDelta: 0.0321,
        longitudeDelta: 0.0021,
    });

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setLat(latitude.toString());
                setLng(longitude.toString());
            } else {
                // Handle permission denied
            }
        } catch (error) {
            console.log('Error getting current location:', error);
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLat(latitude.toString());
        setLng(longitude.toString());
    };

    const handleProceed = () => {
        // Handle the proceed action
        console.log('Proceed to payment:', paymentMethod);
    };


    return (
        <ScrollView style={styles.container}>
            <Header title="FoodX" />
            <Text style={styles.deliveryTitle}>Delivery Details</Text>
            <View style={styles.mapContainer}>
                <Text style={styles.instructionsText}>Drag and drop the pin to accurately mark your current location</Text>
                <TouchableOpacity onPress={getCurrentLocation} style={{ width: "100%", padding: 10, backgroundColor: "#4B5563" }}>
                    <Text style={styles.proceedButtonText}>Locate Me</Text>
                </TouchableOpacity>
                <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    onPress={handleMapPress}
                >
                    <Marker coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }} />
                </MapView>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>


            <View style={styles.paymentContainer}>

                <Text style={styles.paymentLabel}>Select Payment Method:</Text>

                <Picker
                    style={styles.paymentInput}
                    selectedValue={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                >
                    <Picker.Item label="Online Payment" value="Online Payment" />
                    <Picker.Item label="Cash On Delivery" value="Cash On Delivery" />
                </Picker>

            </View>

            <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
                <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    deliveryTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    mapContainer: {
        height: 320,
        overflow: 'hidden',
        marginHorizontal: 20,

    },
    map: {
        flex: 1,
    },
    instructionsText: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        backgroundColor: "#6B7280",
        color: "white",
        padding: 10,
        borderRadius: 5,
    },
    paymentContainer: {
        paddingHorizontal: 20,
        
    },
    paymentLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paymentInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 0,
        backgroundColor: "#F3F4F6",
        marginBottom:10
    },
    proceedButton: {
        backgroundColor: '#1C64F2',
        paddingVertical: 10,
        margin: 20,
        borderRadius: 5,
    },
    proceedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DeliveryAddressScreen;
