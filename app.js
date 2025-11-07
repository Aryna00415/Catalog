document.addEventListener('DOMContentLoaded', () => {

    const catalog = document.querySelector('.catalog');

    const cartItems = document.querySelector('.cart-items');

    const cartEmpty = document.querySelector('.cart-empty');

    const cartTotal = document.querySelector('.cart-total');

    const cartClear = document.querySelector('.cart-clear');

 

    let cart = [];

 

    // Форматирование цены

    function formatPrice(cents) {

        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'BYN' }).format(cents / 1);

    }

 

    // Обновление количества в карточке

    function updateQuantity(card, delta) {

        const input = card.querySelector('.quantity-input');

        let value = parseInt(input.value) + delta;

        value = Math.max(1, Math.min(999, value));

        input.value = value;

        updateCardTotal(card);

    }

 

    // Обновление итога по карточке

    function updateCardTotal(card) {

        const price = parseInt(card.dataset.price);

        const quantity = parseInt(card.querySelector('.quantity-input').value);

        const total = price * quantity;

        card.querySelector('.card-total').textContent = formatPrice(total);

    }

 

    // Добавление в корзину

    function addToCart(card) {

        const id = card.dataset.id;

        const name = card.querySelector('h3').textContent;

        const price = parseInt(card.dataset.price);

        const quantity = parseInt(card.querySelector('.quantity-input').value);

 

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            cart.push({ id, name, price, quantity });

        }

 

        updateCart();

        alert(`Товар добавлен. Итого по корзине: ${formatPrice(getCartTotal())}`);

 

    }

 

    // Обновление корзины

    function updateCart() {

        if (cart.length === 0) {

            cartItems.innerHTML = '';

            cartEmpty.style.display = 'block';

        } else {

            cartEmpty.style.display = 'none';

            cartItems.innerHTML = cart.map(item => `

                <div class="cart-item" data-id="${item.id}">

                    <div>

                        <h3>${item.name}</h3>

                        <p>${formatPrice(item.price)}</p>

                    </div>

                    <div class="quantity-controls">

                        <button class="quantity-minus" aria-label="Уменьшить количество">-</button>

                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="999" step="1" aria-label="Количество">

                        <button class="quantity-plus" aria-label="Увеличить количество">+</button>

                    </div>

                    <p>Итого: ${formatPrice(item.price * item.quantity)}</p>

                    <button class="remove-item" aria-label="Удалить позицию">Удалить</button>

                </div>

            `).join('');

        }

        cartTotal.textContent = formatPrice(getCartTotal());

    }

 

    // Итоговая сумма корзины

    function getCartTotal() {

        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    }

 

    // Очистка корзины

    cartClear.addEventListener('click', () => {

        cart = [];

        updateCart();

    });

 

    // Делегирование событий для кнопок в корзине

    cartItems.addEventListener('click', (e) => {

        const cartItem = e.target.closest('.cart-item');

        if (!cartItem) return;

 

        const itemId = cartItem.dataset.id;

        const currentItem = cart.find(item => item.id === itemId);

 

        if (e.target.classList.contains('quantity-minus')) {

            currentItem.quantity = Math.max(1, currentItem.quantity - 1);

            updateCart();

        } else if (e.target.classList.contains('quantity-plus')) {

            currentItem.quantity += 1;

            updateCart();

        } else if (e.target.classList.contains('remove-item')) {

            cart = cart.filter(item => item.id !== itemId);

            updateCart();

        }

    });

 

    // Делегирование событий для изменения количества в корзине

    cartItems.addEventListener('change', (e) => {

        if (e.target.classList.contains('quantity-input')) {

            const cartItemsElement = e.target.closest('.cart-item');

            const itemId = cartItemsElement.dataset.id;

            const currentItem = cart.find(item => item.id === itemId);

            let value = parseInt(e.target.value);

            if (value <= 0) {

                cart = cart.filter(item => item.id !== itemId);

            } else {

                value = Math.max(1, Math.min(999, value));

                currentItem.quantity = value;

            }

            // const cartItem = e.target.closest('.cart-item');

            // const itemId = cartItem.dataset.id;

            // const currentItem = cart.find(item => item.id === itemId);

 

            // let value = parseInt(e.target.value);

            // value = Math.max(1, Math.min(999, value));

            // currentItem.quantity = value;

            updateCart();

        }

    });

 

    // Обработчики событий для каталога

    catalog.addEventListener('click', (e) => {

        const card = e.target.closest('.card');

        if (!card) return;

 

        if (e.target.classList.contains('quantity-minus') || e.target.classList.contains('quantity-plus')) {

            updateQuantity(card, e.target.classList.contains('quantity-plus') ? 1 : -1);

        } else if (e.target.classList.contains('add-to-cart')) {

            addToCart(card);

        }

    });

 

    // Обработчики для изменения количества в карточках каталога

    document.querySelectorAll('.card .quantity-input').forEach(input => {

        input.addEventListener('change', (e) => {

            const card = e.target.closest('.card');

            let value = parseInt(e.target.value);

            value = Math.max(1, Math.min(999, value));

            e.target.value = value;

            updateCardTotal(card);

        });

    });

});