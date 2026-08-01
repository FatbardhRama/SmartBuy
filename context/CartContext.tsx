"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";


type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};


type CartContextType = {
  cart: Product[];
  loaded: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};


const KEY = "cart";


const CartContext =
  createContext<CartContextType | null>(null);



export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [cart, setCart] = useState<Product[]>([]);


  const [loaded, setLoaded] = useState(false);



  // Load cart only on client
  useEffect(() => {

    try {

      const saved = localStorage.getItem(KEY);


      if (saved) {

        setCart(
          JSON.parse(saved)
        );

      }

    } catch {

      setCart([]);

    }


    setLoaded(true);


  }, []);





  // Save cart
  useEffect(() => {


    if (!loaded) {
      return;
    }


    if (cart.length === 0) {

      localStorage.removeItem(KEY);

    } else {

      localStorage.setItem(
        KEY,
        JSON.stringify(cart)
      );

    }


  }, [cart, loaded]);






  function addToCart(product: Product) {


    setCart((current) => {


      const exists = current.find(
        (item) =>
          item.id === product.id
      );



      if (exists) {
        if (exists.quantity >= product.stock) {
          return current;
        }

        return current.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item

        );

      }

      if (product.stock <= 0) {
        return current;
      }

      return [

        ...current,

        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          quantity: 1,
          stock: product.stock,
        },

      ];

    });

  }






  function removeFromCart(id:string) {

    setCart((current)=>
      current.filter(
        (item)=>item.id !== id
      )
    );

  }







  function increaseQuantity(id:string) {


    setCart((current)=>

      current.map((item)=>

        item.id === id && item.quantity < item.stock

        ? {
            ...item,
            quantity:item.quantity + 1,
          }

        : item

      )

    );


  }







  function decreaseQuantity(id:string) {


    setCart((current)=>

      current.map((item)=>

        item.id === id && item.quantity > 1

        ? {
            ...item,
            quantity:item.quantity - 1,
          }

        : item

      )

    );


  }







  function clearCart(){

    setCart([]);

  }







  const itemCount =
    cart.reduce(
      (sum,item)=>
        sum + item.quantity,
      0
    );



  const subtotal =
    cart.reduce(
      (sum,item)=>
        sum + item.price * item.quantity,
      0
    );








  return (

    <CartContext.Provider

      value={{
        cart,
        loaded,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}

    >

      {children}

    </CartContext.Provider>

  );

}





export function useCart(){

  const context =
    useContext(CartContext);


  if(!context){

    throw new Error(
      "useCart must be inside CartProvider"
    );

  }


  return context;

}