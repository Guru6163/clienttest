import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from "aws-amplify";
import { Basket, BasketDish } from "../models";
import { useAuthContext } from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
    const { dbUser } = useAuthContext();

    const [restaurant, setRestaurant] = useState(null);
    const [basket, setBasket] = useState(null);
    const [basketDishes, setBasketDishes] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)

    const calculateTotalPrice = async (basketDishes, deliveryFee) => {
        try {
            // Use Promise.all to resolve all Dish promises in the basketDishes array
            const resolvedBasketDishes = await Promise.all(
                basketDishes.map(async (basketDish) => {
                    const dish = await basketDish.Dish;
                    return { ...basketDish, Dish: dish };
                })
            );

            // Calculate the totalPrice
            const totalPrice = resolvedBasketDishes.reduce(
                (sum, basketDish) => sum + basketDish.quantity * basketDish.Dish.price,
                deliveryFee
            );

            return totalPrice;
        } catch (error) {
            console.log("Error calculating total price:", error);
            return 0; // Or handle the error based on your requirements
        }
    };

    // Call the calculateTotalPrice function and update the state
    useEffect(() => {
        calculateTotalPrice(basketDishes, restaurant?.deliveryFee).then((totalPrice) => {
            setTotalPrice(totalPrice);
        });
    }, [basketDishes, restaurant?.deliveryFee]);


    useEffect(() => {
        DataStore.query(Basket, (b) =>
            b.restaurantID("eq", restaurant.id).userID("eq", dbUser.id)
        ).then((baskets) => setBasket(baskets[0]));
    }, [dbUser?.id, restaurant]);

    useEffect(() => {
        if (basket) {
            DataStore.query(BasketDish, (bd) => bd.basketID("eq", basket.id)).then(
                setBasketDishes
            );
        }
    }, [basket]);

    const addDishToBasket = async (dish, quantity) => {
        // get the existing basket or create a new one
        let theBasket = basket || (await createNewBasket());

        // create a BasketDish item and save to Datastore
        const newDish = await DataStore.save(
            new BasketDish({ quantity, Dish: dish, basketID: theBasket.id })
        );

        console.log("Basket-Dish============", newDish)
        setBasketDishes([...basketDishes, newDish]);
    };

    const createNewBasket = async () => {
        const newBasket = await DataStore.save(
            new Basket({ userID: dbUser.id, restaurantID: restaurant.id })
        );
        setBasket(newBasket);
        return newBasket;
    };

    return (
        <BasketContext.Provider
            value={{
                addDishToBasket,
                setRestaurant,
                restaurant,
                basket,
                basketDishes,
                totalPrice,
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);