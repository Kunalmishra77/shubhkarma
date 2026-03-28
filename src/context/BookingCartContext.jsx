/**
 * BookingCartContext — Business logic for ShubhKarma's purchase model.
 *
 * PRICING RULES:
 *   1. PUJA_BOOKING  → samagri at puja_price   (lowest, ~25% off retail)
 *   2. PANDIT_BOOKING → samagri at pandit_price (mid, ~15% off retail)
 *   3. STANDALONE    → retail_price             (full price, no discount)
 *
 * Users are strongly guided toward booking a puja or pandit before
 * purchasing samagri — the UI shows the discount they'll unlock.
 */
import { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Discount rates ──────────────────────────────────────────
export const DISCOUNT = {
  with_puja:   0.25,   // 25% off retail
  with_pandit: 0.15,   // 15% off retail
  standalone:  0,      // full retail
};

// ─── Price calculator ────────────────────────────────────────
export function getProductPrice(product, mode = 'standalone') {
  const retail = product.retail_price || product.price || 0;
  if (mode === 'with_puja')   return Math.round(retail * (1 - DISCOUNT.with_puja));
  if (mode === 'with_pandit') return Math.round(retail * (1 - DISCOUNT.with_pandit));
  return retail;
}

export function getPriceMode(state) {
  if (state.activePujaBooking)   return 'with_puja';
  if (state.activePanditBooking) return 'with_pandit';
  return 'standalone';
}

// ─── Initial state ───────────────────────────────────────────
const initialState = {
  activePujaBooking:   null, // { pujaId, pujaSlug, pujaTitle, tierId }
  activePanditBooking: null, // { panditId, panditName, panditSlug }
  cartItems: [],             // [{ product, qty, mode, unitPrice }]
};

// ─── Reducer ─────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'SET_PUJA_BOOKING':
      return { ...state, activePujaBooking: action.payload };

    case 'CLEAR_PUJA_BOOKING':
      return { ...state, activePujaBooking: null };

    case 'SET_PANDIT_BOOKING':
      return { ...state, activePanditBooking: action.payload };

    case 'CLEAR_PANDIT_BOOKING':
      return { ...state, activePanditBooking: null };

    case 'ADD_TO_CART': {
      const { product, qty = 1 } = action.payload;
      const mode      = getPriceMode(state);
      const unitPrice = getProductPrice(product, mode);
      const existing  = state.cartItems.findIndex((i) => i.product.id === product.id);
      if (existing >= 0) {
        const updated = [...state.cartItems];
        updated[existing] = { ...updated[existing], qty: updated[existing].qty + qty, unitPrice, mode };
        return { ...state, cartItems: updated };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { product, qty, mode, unitPrice }],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product.id !== action.payload),
      };

    case 'UPDATE_QTY': {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        return { ...state, cartItems: state.cartItems.filter((i) => i.product.id !== productId) };
      }
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.product.id === productId ? { ...i, qty } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────
const BookingCartContext = createContext(null);

export function BookingCartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setPujaBooking   = useCallback((booking) => dispatch({ type: 'SET_PUJA_BOOKING',   payload: booking }), []);
  const clearPujaBooking = useCallback(()         => dispatch({ type: 'CLEAR_PUJA_BOOKING' }), []);

  const setPanditBooking   = useCallback((booking) => dispatch({ type: 'SET_PANDIT_BOOKING',   payload: booking }), []);
  const clearPanditBooking = useCallback(()         => dispatch({ type: 'CLEAR_PANDIT_BOOKING' }), []);

  const addToCart    = useCallback((product, qty = 1) => dispatch({ type: 'ADD_TO_CART',    payload: { product, qty } }), []);
  const removeFromCart = useCallback((productId)      => dispatch({ type: 'REMOVE_FROM_CART', payload: productId }), []);
  const updateQty    = useCallback((productId, qty)   => dispatch({ type: 'UPDATE_QTY',    payload: { productId, qty } }), []);
  const clearCart    = useCallback(()                  => dispatch({ type: 'CLEAR_CART' }), []);

  const priceMode    = getPriceMode(state);
  const cartCount    = state.cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal    = state.cartItems.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  return (
    <BookingCartContext.Provider value={{
      // state
      activePujaBooking:   state.activePujaBooking,
      activePanditBooking: state.activePanditBooking,
      cartItems:           state.cartItems,
      priceMode,
      cartCount,
      cartTotal,
      // actions
      setPujaBooking,
      clearPujaBooking,
      setPanditBooking,
      clearPanditBooking,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      // helpers
      getPrice: (product) => getProductPrice(product, priceMode),
    }}>
      {children}
    </BookingCartContext.Provider>
  );
}

export function useBookingCart() {
  const ctx = useContext(BookingCartContext);
  if (!ctx) throw new Error('useBookingCart must be used inside <BookingCartProvider>');
  return ctx;
}
