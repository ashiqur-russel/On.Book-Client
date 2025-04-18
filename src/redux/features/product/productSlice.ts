import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "@/types";
import { RootState } from "@/redux/store";

interface CartItem extends IProduct {
  quantity: number;
  totalPrice: number;
}

interface ProductState {
  filteredProducts: IProduct[];
  cart: CartItem[];
  highlightedItemId: string | null;
}

const initialState: ProductState = {
  filteredProducts: [],
  cart: [],
  highlightedItemId: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilteredProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.filteredProducts = action.payload;
    },

    addToCart: (state, action: PayloadAction<IProduct>) => {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
        });
      }

      state.highlightedItemId = action.payload.id;
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        item.totalPrice = item.quantity * item.price;
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.totalPrice = item.quantity * item.price;
        } else {
          state.cart = state.cart.filter(
            (cartItem) => cartItem.id !== action.payload
          );
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      if (state.highlightedItemId === action.payload) {
        state.highlightedItemId = null;
      }
    },

    clearCart: (state) => {
      state.cart = [];
      state.highlightedItemId = null;
    },

    highlightCartItem: (state, action: PayloadAction<string>) => {
      state.highlightedItemId = action.payload;
    },
    resetHighlight: (state) => {
      state.highlightedItemId = null;
    },
  },
});

export const {
  setFilteredProducts,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  highlightCartItem,
  resetHighlight,
} = productSlice.actions;

export default productSlice.reducer;
export const selectCurrentStore = (state: RootState) => state.product;
