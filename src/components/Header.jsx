import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Icon name="fast-food-outline" size={24} color="black" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContent}>
        {/* Add the Cart icon here */}
        <Icon name="cart-outline" size={24} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Header;
