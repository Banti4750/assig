import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, loading]);

    function addItem(product) {
        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item._id === product._id
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    }

    function removeItem(productId) {
        setItems(prevItems => prevItems.filter(item => item._id !== productId));
    }

    function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    function clearCart() {
        setItems([]);
    }

    function getItemCount() {
        return items.reduce((total, item) => total + item.quantity, 0);
    }



    function getTotalPrice() {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    const value = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
    };

    return (
        <CartContext.Provider value={value}>
            {!loading && children}
        </CartContext.Provider>
    );
};