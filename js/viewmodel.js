import { model } from './model.js';

// ViewModel - связующее звено между Model и View
export const viewModel = {
	listeners: [],
	subscribe(fn) {
		this.listeners.push(fn);
	},

	addToCart(id) {
		const product = model.products.find(p => p.id === id);
		const isInCart = model.cart.items.find(p => p.id === id);

		if (!isInCart) {
			model.cart.items.push({
				...product,
				quantity: 1,
			});
		} else {
			isInCart.quantity++;
		}

		this.notify({ type: 'cart-updated', productId: id });
	},

	removeFromCart(id) {
		model.cart.items = model.cart.items.filter(p => p.id !== id);
		this.notify({ type: 'cart-updated', productId: id });
	},

	getTotal() {
		return model.cart.items.reduce((acc, p) => acc + p.price * p.quantity, 0);
	},

	getTotalCount() {
		return model.cart.items.reduce((acc, p) => acc + p.quantity, 0);
	},

	updateQuantity(id, quantity) {
		const item = model.cart.items.find(p => p.id === id);

		if (!item) return;

		item.quantity = quantity;
		if (quantity <= 0) {
			this.removeFromCart(id);
		} else {
			this.notify({ type: 'cart-updated', productId: id });
		}
	},

	notify(event) {
		this.listeners.forEach(fn => fn(event));
	},
};
