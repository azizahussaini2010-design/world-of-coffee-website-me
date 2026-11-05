// Mobile Navigation
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');

        toggle.setAttribute('aria-expanded', String(open));
    });
}


// Coffee Gallery
document.addEventListener('DOMContentLoaded', () => {

    const track = document.querySelector('[data-auto-scroll]');

    if (!track) return;

    const cards = [...track.querySelectorAll('.coffee-card')];

    let paused = false;
    let focused = null;
    let last = 0;

    const step = () => {
        return cards[0].getBoundingClientRect().width + 22;
    };

    // Previous button
    document.querySelector('.gallery-prev')?.addEventListener('click', () => {
        track.scrollBy({
            left: -step(),
            behavior: 'smooth'
        });
    });

    // Next button
    document.querySelector('.gallery-next')?.addEventListener('click', () => {
        track.scrollBy({
            left: step(),
            behavior: 'smooth'
        });
    });

    // Pause scrolling when the mouse enters.
    track.addEventListener('mouseenter', () => {
        paused = true;
    });

    track.addEventListener('mouseleave', () => {
        paused = false;
    });

    // Pause scrolling when using keyboard navigation.
    track.addEventListener('focusin', () => {
        paused = true;
    });

    track.addEventListener('focusout', () => {
        paused = false;
    });

    // Focus on a selected coffee card.
    cards.forEach(card => {

        card.querySelector('button').addEventListener('click', () => {

            if (focused === card) {

                focused = null;

                track.classList.remove('has-focus');

                cards.forEach(c => {
                    c.classList.remove('focused');
                });

            } else {

                focused = card;

                track.classList.add('has-focus');

                cards.forEach(c => {
                    c.classList.toggle('focused', c === card);
                });

                paused = true;

                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    });

    // Automatic gallery animation.
    function animate(t) {

        if (!last) last = t;

        const dt = Math.min(t - last, 40);

        last = t;

        if (!paused && !focused && track.scrollWidth > track.clientWidth) {

            track.scrollLeft += dt * 0.025;

            if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
                track.scrollLeft = 0;
            }
        }

        requestAnimationFrame(animate);
    }

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(animate);
    }

});


// Coffee Menu
const menu = [

    {
        'name': 'Espresso',
        'description': 'Rich, concentrated, and full of character.',
        'price': 3.0,
        'image': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Americano',
        'description': 'A smooth classic with a clean finish.',
        'price': 3.5,
        'image': 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Cappuccino',
        'description': 'Espresso with silky milk and soft foam.',
        'price': 4.5,
        'image': 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Caffè Latte',
        'description': 'A comforting balance of espresso and milk.',
        'price': 4.75,
        'image': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Flat White',
        'description': 'Velvety microfoam meets a bold espresso base.',
        'price': 4.5,
        'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Mocha',
        'description': 'A rich blend of coffee and chocolate.',
        'price': 5.0,
        'image': 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Iced Latte',
        'description': 'Chilled espresso and milk, served over ice.',
        'price': 4.75,
        'image': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=85'
    },

    {
        'name': 'Caramel Macchiato',
        'description': 'Creamy coffee with a caramel finish.',
        'price': 5.25,
        'image': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=85'
    }

];


// Shopping Cart
const cart = {};

const host = document.getElementById('order-products');
const cartHost = document.getElementById('cart-items');
const totalHost = document.getElementById('cart-total');
const countHost = document.getElementById('cart-count');


// Format prices.
const money = n => '$' + n.toFixed(2);


// Display coffee products.
host.innerHTML = menu.map((x, i) => `

    <article class="order-item">

        <img src="${x.image}" alt="${x.name}">

        <h3>${x.name}</h3>

        <p>${x.description}</p>

        <div class="order-item-bottom">

            <strong>${money(x.price)}</strong>

            <button class="add-button" data-add="${i}">
                Add +
            </button>

        </div>

    </article>

`).join('');


// Update the shopping cart.
function render() {

    const entries = Object.entries(cart);

    const count = entries.reduce((s, [, q]) => s + q, 0);

    const total = entries.reduce((s, [i, q]) => {
        return s + menu[i].price * q;
    }, 0);

    countHost.textContent = count + ' ' + (count === 1 ? 'item' : 'items');

    totalHost.textContent = money(total);

    // Display selected products.
    cartHost.innerHTML = entries.length

        ? entries.map(([i, q]) => `

            <div class="cart-line">

                <span>${menu[i].name} × ${q}</span>

                <span>

                    ${money(menu[i].price * q)}

                    <button data-remove="${i}" aria-label="Remove one">
                        −
                    </button>

                </span>

            </div>

        `).join('')

        : '<p class="empty-cart">Your basket is waiting for something lovely.</p>';
}


// Add products to the cart.
host.addEventListener('click', e => {

    const b = e.target.closest('[data-add]');

    if (b) {

        const i = b.dataset.add;

        cart[i] = (cart[i] || 0) + 1;

        render();
    }
});


// Remove products from the cart.
cartHost.addEventListener('click', e => {

    const b = e.target.closest('[data-remove]');

    if (b) {

        const i = b.dataset.remove;

        if (--cart[i] <= 0) {
            delete cart[i];
        }

        render();
    }
});


// Checkout Form
document.getElementById('checkout-form').addEventListener('submit', e => {

    e.preventDefault();

    if (!Object.keys(cart).length) {

        alert('Please add a coffee to your order first.');

        return;
    }

    alert('Thank you! This demo order was created on this page. No real order or payment was sent.');

    Object.keys(cart).forEach(k => {
        delete cart[k];
    });

    e.target.reset();

    render();

});


// Initial cart display.
render();


// Contact Form
const form = document.getElementById('contact-form');

if (form) {

    form.addEventListener('submit', e => {

        e.preventDefault();

        document.getElementById('contact-feedback').textContent =
            'Thank you for your message! This demo form has not sent your message.';

        form.reset();

    });

}


// Single-page navigation:
// Close the mobile menu after choosing a section.
const pageNav = document.querySelector('.main-nav');

const pageToggle = document.querySelector('.menu-toggle');

if (pageNav) {

    pageNav.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            pageNav.classList.remove('open');

            pageToggle?.setAttribute('aria-expanded', 'false');

        });

    });

}


// Highlight the navigation link
// for the section currently on screen.
const navSections = [

    'home',
    'coffee',
    'story',
    'cafe',
    'order',
    'contact'

]

.map(id => document.getElementById(id))

.filter(Boolean);


// Observe sections while scrolling.
if ('IntersectionObserver' in window) {

    const sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                document.querySelectorAll('.main-nav a').forEach(link => {

                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );

                });

            }

        });

    }, {
        rootMargin: '-25% 0px -65% 0px'
    });

    navSections.forEach(section => {
        sectionObserver.observe(section);
    });

}