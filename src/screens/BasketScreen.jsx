import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useBasketContext } from '../contexts/BasketContext';
import BasketDishItem from '../components/BasketDishItem';

const BasketScreen = () => {
    const navigation = useNavigation();
    const { restaurant, basketDishes, totalPrice } = useBasketContext();

    const onCreateOrder = () => {
        // Logic for creating the order
    };

    return (
        <View style={styles.container}>
            <Header title="FoodX" />
            <View style={styles.orderContainer}>
                <Text style={styles.sectionTitle}>Cart Items</Text>
                <Text style={styles.restaurantName}>{restaurant?.name}</Text>

                <FlatList
                    data={basketDishes}
                    renderItem={({ item }) => <BasketDishItem basketDish={item} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
            <View style={styles.totalContainer}>
                <Pressable onPress={onCreateOrder} style={styles.button}>
                    <Text style={styles.buttonText}>  Create order &#8226; ${totalPrice !== undefined ? totalPrice.toFixed(2) : '0.00'}</Text>
                </Pressable>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    orderContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 16,
    },
    totalContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#ff5d5a',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default BasketScreen;
