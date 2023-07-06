import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import Header from '../components/Header';
import { DataStore } from 'aws-amplify';
import { Restaurant, Dish } from '../models';
import { useBasketContext } from '../contexts/BasketContext';
import { useNavigation } from '@react-navigation/native';
import DishItem from '../components/DishItem';

const RestaurantDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params?.id;
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const {
    setRestaurant: setBasketRestaurant,
    basket,
    basketDishes,
    addDishToBasket
  } = useBasketContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }
      setBasketRestaurant(null);
      try {
        const restaurantData = await DataStore.query(Restaurant, id);
        setRestaurant(restaurantData);
        const dishData = await DataStore.query(Dish, (dish) => dish.restaurantID.eq(id));
        setDishes(dishData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  // async function getDishById(dishId) {
  //   try {
  //     const dish = await DataStore.query(Dish, (dish) => dish.id.eq(dishId));
  //     console.log("Matched Dish ======= ", dish);
  //     return dish;
  //   } catch (error) {
  //     console.log('Error fetching dish by ID:', error);
  //     return null;
  //   }
  // }

  const addToCart = (item) => {
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update its quantity
      updatedCartItems[existingItemIndex].quantity++;
    } else {
      // If the item is not in the cart, add it with a quantity of 1
      updatedCartItems.push({ ...item, quantity: 1 });
    }

    setCartItems(updatedCartItems);
  };

  const subtractFromCart = (item) => {
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, decrease its quantity
      if (updatedCartItems[existingItemIndex].quantity > 1) {
        updatedCartItems[existingItemIndex].quantity--;
      } else {
        // If the quantity is 1 and the "subtract" button is pressed again, remove the item from the cart
        updatedCartItems.splice(existingItemIndex, 1);
      }
    }

    setCartItems(updatedCartItems);
  };

  useEffect(() => {
    setBasketRestaurant(restaurant);
  }, [restaurant]);

  useEffect(() => {
    const fetchDishes = async () => {
      for (const element of cartItems) {
        const { quantity, ...dish } = element;
        addDishToBasket(dish, quantity);
      }
    };

    fetchDishes();
  }, [cartItems]);

  if (!restaurant) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  const renderDishItem = ({ item }) => {
    return (
      <DishItem
        dishItem={item}
        addToCart={addToCart}
        subtractFromCart={subtractFromCart}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="FoodX" />
      {restaurant && (
        <>
          <Text style={[styles.restaurantName, styles.highlightedRestaurantName]}>
            {restaurant.name}
          </Text>
        </>
      )}

      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id}
        renderItem={renderDishItem}
        style={styles.dishList}
      />
      {basket && (
        <Pressable
          onPress={() => navigation.navigate("Cart")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Open basket ({basketDishes.length})
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  restaurantImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 0,
    textAlign: 'center',
  },
  highlightedRestaurantName: {
    backgroundColor: '#ff5d5a',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical:5,
    
  },

  dishList: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ff5d5a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RestaurantDetailScreen;
