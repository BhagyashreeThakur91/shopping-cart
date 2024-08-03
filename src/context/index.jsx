// create the context
// provide the state to context
// wrap context in root element
// consume the context using useContext

import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ShoppingCartContext = createContext(null);

function ShoppCartProvider({children}) {
    const [loading, setLoading] = useState(true);
    const [listOfProducts, setListOfProducts] = useState([]);
    const [productDetails, setProductDetails] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    async function fetchListOfPoducts(){
        const apiResponse = await fetch('https://dummyjson.com/products');
        const result = await apiResponse.json();
        //console.log(result);
        if(result && result?.products) {
            setListOfProducts(result?.products);
            setLoading(false)
        }        
    }

    function handleAddToCart(getProductDetails) {
        console.log(getProductDetails);
        let copyExistingCartItems = [...cartItems];
        const findIndexOfCurrentItem = copyExistingCartItems.findIndex(cartItem=>cartItem.id === getProductDetails.id);
        console.log(findIndexOfCurrentItem);

        if(findIndexOfCurrentItem === -1){
            copyExistingCartItems.push({
                ...getProductDetails,
                quantity : 1,
                totalPrice : getProductDetails?.price
            })
        } else{
            copyExistingCartItems[findIndexOfCurrentItem] ={
                ...copyExistingCartItems[findIndexOfCurrentItem],
                quantity : copyExistingCartItems[findIndexOfCurrentItem].quantity + 1,
                totalPrice : (copyExistingCartItems[findIndexOfCurrentItem].quantity + 1 ) *
                copyExistingCartItems[findIndexOfCurrentItem].price
            }

        }
            console.log(copyExistingCartItems);
            setCartItems(copyExistingCartItems);
            localStorage.setItem('cartItems', JSON.stringify(copyExistingCartItems));
            navigate("/cart");
    }

    function handleRemoveFromCart(getProductDetails, isFullyRemoveFromCart){
        let cpyExistingCartItems = [...cartItems];
        const findIndexOfCurrentCartItem = cpyExistingCartItems.findIndex(item=> item.id === getProductDetails.id);
        if(isFullyRemoveFromCart) {
            cpyExistingCartItems.splice(findIndexOfCurrentCartItem, 1)
        } else{
            cpyExistingCartItems[findIndexOfCurrentCartItem] = {
                ...cpyExistingCartItems[findIndexOfCurrentCartItem],
                quantity : cpyExistingCartItems[findIndexOfCurrentCartItem].quantity - 1,
                totalPrice : (cpyExistingCartItems[findIndexOfCurrentCartItem].quantity - 1) * cpyExistingCartItems[findIndexOfCurrentCartItem].price
            }
        }
        localStorage.setItem('cartItems', JSON.stringify(cpyExistingCartItems))
        setCartItems(cpyExistingCartItems);
    }

    useEffect(()=>{
        fetchListOfPoducts()
        setCartItems(JSON.parse(localStorage.getItem('cartItems') || []))
    },[])
   
    console.log(cartItems);
    

    return <ShoppingCartContext.Provider value={{
        listOfProducts,
        loading, 
        setLoading,
        productDetails, 
        setProductDetails,
        handleAddToCart, 
        cartItems,
        handleRemoveFromCart,
    }}>
        {children}
    </ShoppingCartContext.Provider>
}

export default ShoppCartProvider;