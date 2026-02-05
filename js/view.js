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

function renderCart() {
	// Очищаем список товаров в корзине
	cartList.innerHTML = '';

	// Добавляем товары в список
	model.cart.items.forEach(product => {
		const cartItem = document.createElement('li');
		cartItem.textContent = `${product.name} - ${product.price} руб. x ${product.quantity}`;
		cartItem.addEventListener('click', () => viewModel.removeFromCart(product.id));
		cartList.appendChild(cartItem);
	});

	// Рассчитываем и отображаем итоговую сумму
	const total = viewModel.getTotal();
	totalPrice.textContent = total;
}

function render() {
	renderProducts();
	renderCart();
}

viewModel.subscribe(render);
render();