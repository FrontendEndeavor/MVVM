import { model } from './model';

// ViewModel - связующее звено между Model и View
export const viewModel = {
	listeners: [],
	subscribe(fn) {
		this.listeners.push(fn);
	},
	notify() {
		this.listeners.forEach(fn => fn());
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

		this.notify();
	},
};
