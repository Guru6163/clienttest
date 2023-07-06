import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BasketDishItem = ({ basketDish }) => {
  const getDishFromPromise = async () => {
    try {
      return await basketDish.Dish;
    } catch (error) {
      console.log('Error unwrapping Dish promise:', error);
      return null;
    }
  };

  const [dish, setDish] = useState(null);
  useEffect(() => {
    (async () => {
      const unwrappedDish = await getDishFromPromise();
      setDish(unwrappedDish);
    })();
  }, []);

  if (!dish) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemNameText}>{dish.name}</Text>
        <Text style={styles.quantityText}>Quantity: {basketDish.quantity}</Text>
      </View>
      <Text style={styles.itemPriceText}>${dish.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  itemDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 14,
    color: 'gray',
  },
  itemPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default BasketDishItem;
