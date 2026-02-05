// View - отображение и взаимодействие с DOM
import { model } from './model.js';
import { viewModel } from './viewmodel.js';

// Получаем элементы DOM
const productList = document.getElementById('product-list');
const cartList = document.getElementById('cart-list');
const totalPrice = document.getElementById('total-price');

function renderProducts() {
	// Очищаем список товаров
	productList.innerHTML = '';

	// Добавляем товары в список
	model.products.forEach(product => {
		const productItem = document.createElement('li');
		productItem.textContent = `${product.name} - ${product.price} руб.`;
		productItem.addEventListener('click', () => viewModel.addToCart(product.id));
		productList.appendChild(productItem);
	});
}

const cartElements = new Map();

function renderCart() {
	// Очищаем список товаров в корзине
	cartList.innerHTML = '';
	cartElements.clear();

	// Добавляем товары в список
	model.cart.items.forEach(product => {
		const cartItem = createCartItem(product);
		cartElements.set(product.id, cartItem);
		cartList.appendChild(cartItem);
	});

	// Рассчитываем и отображаем итоговую сумму
	const total = viewModel.getTotal();
	totalPrice.textContent = total;
}

function createCartItem(product) {
	const cartItem = document.createElement('li');

	const info = document.createElement('span');
	info.textContent = `${product.name} - ${product.price} руб. x ${product.quantity}`;
	cartItem.appendChild(info);

	const input = createCartItemInput(product);
	cartItem.appendChild(input);

	const deleteButton = createCartItemDeleteButton(product);
	cartItem.appendChild(deleteButton);

	return cartItem;
}

function createCartItemInput(product) {
	const input = document.createElement('input');
	input.type = 'number';
	input.value = product.quantity;
	input.min = 0;
	input.addEventListener('change', () => viewModel.updateQuantity(product.id, Number(input.value)));
	return input;
}

function createCartItemDeleteButton(product) {
	const button = document.createElement('button');
	button.textContent = 'Удалить';
	button.addEventListener('click', () => viewModel.removeFromCart(product.id));
	return button;
}

function updateTotal() {
	totalPrice.textContent = viewModel.getTotal();
}

viewModel.subscribe(event => {
	if (event.type === 'cart-updated') {
		const product = model.cart.items.find(p => p.id === event.productId);
		const cartItem = cartElements.get(event.productId);
		if (!product && cartItem) {
			cartItem.remove();
			cartElements.delete(event.productId);
		} else if (product && !cartItem) {
			const newCartItem = createCartItem(product);
			cartElements.set(product.id, newCartItem);
			cartList.appendChild(newCartItem);
		} else if (product && cartItem) {
			cartItem.querySelector('input').value = product.quantity;
			cartItem.querySelector('span').textContent = `${product.name} - ${product.price} руб. x ${product.quantity}`;
		}
	}

	updateTotal();
});

function render() {
	renderProducts();
	renderCart();
}

render();
