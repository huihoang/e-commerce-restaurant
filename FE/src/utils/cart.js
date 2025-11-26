// Simple cart utilities using localStorage and a custom event to notify listeners
const CART_KEY = 'bk_cart';

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // notify listeners in this tab
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

export function addToCart(product, quantity = 1) {
  const qty = Number(quantity) || 1;
  const items = getCart();
  const index = items.findIndex((i) => i._id === product._id);
  if (index >= 0) {
    items[index].quantity = (Number(items[index].quantity) || 0) + qty;
  } else {
    items.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      discountPercent: product.discountPercent || 0,
    });
  }
  setCart(items);
  return items;
}

export function updateQuantity(productId, quantity) {
  const qty = Math.max(0, Number(quantity) || 0);
  const items = getCart();
  const index = items.findIndex((i) => i._id === productId);
  if (index >= 0) {
    if (qty === 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = qty;
    }
  }
  setCart(items);
  return items;
}

export function clearCart() {
  setCart([]);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
}

export function onCartChange(callback) {
  const handler = () => callback(getCart());
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) handler();
  });
  window.addEventListener('cartUpdated', handler);
  // immediate call
  handler();
  return () => {
    window.removeEventListener('cartUpdated', handler);
  };
}
