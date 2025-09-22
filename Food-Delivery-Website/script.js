// let swiper = new Swiper('.mySwiper', {
//   loop: true,
//   navigation: {
//     nextEl: '#next',
//     prevEl: '#prev',
//   },
// });


const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartValueEl = document.querySelector('.cart-value');
const cartTotalEl = document.querySelector('.cart-total');
const hamburger = document.querySelector('.hamburger');


let productList = [];
let cartProduct = [];
const CART_STORAGE_KEY = 'foodie_cart';


// Hamburger menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.add('active');
    document.body.classList.add('menu-open');
  });

  closeMenu.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});

// Close menu when clicking on menu links
document.querySelectorAll('.mobile-menu a:not(.close-menu)').forEach(link => {
  link.addEventListener('click', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
 
      const formData = new FormData(checkoutForm);
      let isValid = true;
      let errorMessage = '';
      
     
      if (!formData.get('fullName').trim()) {
        isValid = false;
        errorMessage = 'Please enter your full name';
      } else if (!formData.get('email').trim()) {
        isValid = false;
        errorMessage = 'Please enter your email address';
      } else if (!formData.get('phone').trim()) {
        isValid = false;
        errorMessage = 'Please enter your phone number';
      } else if (!formData.get('address').trim()) {
        isValid = false;
        errorMessage = 'Please enter your delivery address';
      }
      
      if (!isValid) {
        alert(errorMessage);
        return;
      }
    
      const orderConfirmation = document.createElement('div');
      orderConfirmation.classList.add('order-confirmation');
      orderConfirmation.innerHTML = `
        <div class="confirmation-content">
          <i class="fa-solid fa-check-circle" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order, ${formData.get('fullName')}!</p>
          <p>Your delicious food is on the way to ${formData.get('address')}</p>
          <p>We've sent a confirmation email to ${formData.get('email')}</p>
          <a href="index.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
            Return to Home
          </a>
        </div>
      `;
      
      document.querySelector('.checkout-container').innerHTML = '';
      document.querySelector('.checkout-container').appendChild(orderConfirmation);
      
    
      localStorage.removeItem(CART_STORAGE_KEY);
    });
  }
});

if (cartIcon && cartTab) {
  cartIcon.addEventListener('click', () => {
    cartTab.style.inset = '0 0 0 auto';
  });
}

if (closeBtn && cartTab) {
  closeBtn.addEventListener('click', () => {
    cartTab.style.inset = '0 -1000px 0 auto';
  });
}


const saveCartToLocalStorage = () => {
  try {
    const cartData = cartProduct
      .filter((item) => item && item.id && item.quantity > 0)
      .map((item) => ({
        id: item.id,
        quantity: Math.max(1, item.quantity || 1),
      }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    return true;
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
    return false;
  }
};

const restoreCartItems = () => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
   
      cartProduct = parsedCart.map((item) => {
        const product = productList.find((p) => p.id === item.id);
        return product ? { ...product, quantity: item.quantity } : null;
      }).filter(item => item !== null);
    } catch (error) {
      console.error('Error parsing saved cart:', error);
      cartProduct = [];
    }
  }
  renderCartItems();
};

const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  cartProduct.forEach((item) => {
    const product = productList.find((p) => p.id === item.id);
    if (product) {
      const basePrice = parseFloat(product.price.replace('Rs', ''));
      totalPrice += basePrice * item.quantity;
      totalQuantity += item.quantity;
    }
  });

  if (cartTotalEl) cartTotalEl.textContent = `Rs ${totalPrice.toFixed(2)}`;
  if (cartValueEl) {
    cartValueEl.textContent = totalQuantity;
    cartValueEl.classList.add('cart-counter-update');
    setTimeout(() => {
      cartValueEl.classList.remove('cart-counter-update');
    }, 300);
  }
  saveCartToLocalStorage();
};

const renderCartItems = () => {
  if (!cartList) return;
  cartList.innerHTML = '';



  cartProduct.forEach((product) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('item');
    cartItem.setAttribute('data-product-id', product.id);
    const basePrice = parseFloat(product.price.replace('Rs', ''));

    cartItem.innerHTML = `
      <div class="image-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="name-container detail">
        <h4>${product.name}</h4>
        <h4 class="item-total">Rs ${(basePrice * product.quantity).toFixed(2)}</h4>
      </div>
      <div class="flex">
        <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
        <h4 class="quantity-value">${product.quantity}</h4>
        <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
      </div>
    `;

    cartList.appendChild(cartItem);

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');
    const quantityValueEl = cartItem.querySelector('.quantity-value');
    const itemTotalEl = cartItem.querySelector('.item-total');

    plusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const existingItem = cartProduct.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
        quantityValueEl.textContent = existingItem.quantity;
        itemTotalEl.textContent = `Rs ${(basePrice * existingItem.quantity).toFixed(2)}`;
        updateTotals();
      }
    });

    minusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const existingItem = cartProduct.find(item => item.id === product.id);

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
        quantityValueEl.textContent = existingItem.quantity;
        itemTotalEl.textContent = `Rs ${(basePrice * existingItem.quantity).toFixed(2)}`;
        updateTotals();
      } else if (existingItem && existingItem.quantity === 1) {
        cartItem.classList.add('slide-out');
        setTimeout(() => {
          cartProduct = cartProduct.filter((item) => item.id !== product.id);
          cartItem.remove();
          updateTotals();
          updateAllAddToCartButtons();
        }, 300);
      }
    });
  });
  updateTotals();
};



const addToCart = (product) => {
  if (!product || !product.id) {
    console.error('Invalid product data');
    return;
  }
  const existingProduct = cartProduct.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 0) + 1;
  } else {
    cartProduct.push({ ...product, quantity: 1 });
  }
  renderCartItems();
  updateAllAddToCartButtons();
};

const clearCart = () => {
  cartProduct = [];
  renderCartItems();
  updateAllAddToCartButtons();
};


const showCards = () => {
  if (!cardList) return;
  cardList.innerHTML = '';
  productList.forEach((product) => {
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');
    orderCard.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <div class="card-buttons">
        <a href="#" class="btn add-to-cart-btn" data-product-id="${product.id}">
          <span class="btn-text">Add to Cart</span>
        </a>
        <a href="#" class="btn go-to-cart-btn">
          <span>Go to Cart</span>
        </a>
      </div>
    `;
    cardList.appendChild(orderCard);

    const addToCartBtn = orderCard.querySelector('.add-to-cart-btn');
    const goToCartBtn = orderCard.querySelector('.go-to-cart-btn');
    
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(product, addToCartBtn);
    });

    goToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cartTab) {
        cartTab.style.inset = '0 0 0 auto';
      }
    });

    updateAddToCartButtonState(product, addToCartBtn);
  });
};

const handleAddToCart = (product, button) => {
  const btnText = button.querySelector('.btn-text');
  if (button.classList.contains('in-cart')) {
    if (cartTab) {
      cartTab.style.inset = '0 0 0 auto';
    }
    return;
  }

 

  setTimeout(() => {
    try {
      addToCart(product);
      button.classList.add('success');
      btnText.innerHTML = 'Added!';
    } catch (error) {
      console.error('Error adding to cart:', error);
      button.classList.add('error');
      btnText.innerHTML = 'Error';
    } finally {
      button.classList.remove('loading');
      button.disabled = false;
      setTimeout(() => {
        button.classList.remove('success', 'error');
        updateAddToCartButtonState(product, button);
      }, 1000);
    }
  }, 500);
};

const updateAddToCartButtonState = (product, button) => {
  const existingItem = cartProduct.find((item) => item.id === product.id);
  const btnText = button.querySelector('.btn-text');
  if (existingItem && existingItem.quantity > 0) {
    button.classList.add('in-cart');
    btnText.textContent = 'Added';
    button.disabled = false;
  } else {
    button.classList.remove('in-cart');
    btnText.textContent = 'Add to Cart';
    button.disabled = false;
  }
};

const updateAllAddToCartButtons = () => {
  document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
    const productId = parseInt(button.getAttribute('data-product-id'));
    const product = productList.find((p) => p.id === productId);
    if (product) {
      updateAddToCartButtonState(product, button);
    }
  });
};


const loadCheckoutCart = () => {
  const checkoutCartItems = document.getElementById('checkout-cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const deliveryFeeEl = document.getElementById('delivery-fee');
  const finalTotalEl = document.getElementById('final-total');
  const checkoutBtn = document.getElementById('place-order-btn');

  if (!checkoutCartItems || !subtotalEl || !finalTotalEl) {
    return;
  }
  
 
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      
      if (productList.length > 0) {
      
        cartProduct = parsedCart.map(item => {
          const product = productList.find(p => p.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        }).filter(item => item !== null);
      } else {
   
        cartProduct = parsedCart;
      }
    } catch (error) {
      console.error('Error parsing saved cart:', error);
      cartProduct = [];
    }
  }


  if (productList.length === 0) {
    fetch('./product.json')
      .then(response => response.json())
      .then(data => {
        productList = data;
        renderCheckoutItems();
      })
      .catch(error => {
        console.error('Error loading products:', error);
      });
  } else {
    renderCheckoutItems();
  }

  function renderCheckoutItems() {
    checkoutCartItems.innerHTML = '';
    let subtotal = 0;

    if (!cartProduct || cartProduct.length === 0) {
      checkoutCartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fa-solid fa-shopping-cart" style="font-size: 2rem; color: #ccc; margin-bottom: 1rem;"></i>
          <p>Your cart is empty</p>
          <a href="index.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
            <i class="fa-solid fa-arrow-left"></i>
            Back to Menu
          </a>
        </div>
      `;
      subtotalEl.textContent = 'Rs 0.00';
      finalTotalEl.textContent = 'Rs 0.00';
      
      
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
      }
      return;
    }

  
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove('disabled');
    }

    cartProduct.forEach((item) => {
      const product = productList.find((p) => p.id === item.id);
      if (product) {
        const basePrice = parseFloat(product.price.replace('Rs', ''));
        const itemTotal = basePrice * item.quantity;
        subtotal += itemTotal;
        const cartItem = document.createElement('div');
        cartItem.classList.add('checkout-item');
        
      
        let imagePath = product.image;
        if (imagePath && imagePath.startsWith('./')) {
          imagePath = imagePath.substring(2); 
        }
        
        cartItem.innerHTML = `
          <img src="${imagePath}" alt="${product.name}" />
          <div class="item-details">
            <h4>${product.name}</h4>
            <div class="item-price">${product.price}</div>
          </div>
          <div class="item-quantity">Qty: ${item.quantity}</div>
        
        `;
        checkoutCartItems.appendChild(cartItem);
      }
    });

    const deliveryFee = 50.00;
    const finalTotal = subtotal + deliveryFee;

    subtotalEl.textContent = `Rs ${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `Rs ${deliveryFee.toFixed(2)}`;
    finalTotalEl.textContent = `Rs ${finalTotal.toFixed(2)}`;
  }
};

const validateCheckoutForm = () => {
  const form = document.getElementById('checkout-form');
  if (!form) return false;
  const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode'];
  let isValid = true;

  requiredFields.forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    if (field && !field.value.trim()) {
      isValid = false;
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  });

  const emailField = document.getElementById('email');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      emailField.classList.add('invalid');
    }
  }

  const phoneField = document.getElementById('phone');
  if (phoneField && phoneField.value) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneField.value.replace(/\D/g, ''))) {
      isValid = false;
      phoneField.classList.add('invalid');
    }
  }
  return isValid;
};

const placeOrder = (e) => {
  e.preventDefault();
  if (cartProduct.length === 0) {
    alert('Your cart is empty. Please add items to your cart first.');
    return;
  }
  if (!validateCheckoutForm()) {
    alert('Please fill in all required fields correctly.');
    return;
  }

  const submitBtn = document.getElementById('place-order-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  }

  const form = document.getElementById('checkout-form');
  const formData = new FormData(form);
  const orderData = {
    customerInfo: {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      pincode: formData.get('pincode'),
    },
    paymentMethod: formData.get('payment'),
    items: cartProduct,
    orderDate: new Date().toISOString(),
    orderId: 'ORD' + Date.now(),
  };

  const totals = {
    subtotal: cartProduct.reduce((acc, item) => {
      const product = productList.find(p => p.id === item.id);
      const price = product ? parseFloat(product.price.replace('Rs', '')) : 0;
      return acc + (price * item.quantity);
    }, 0),
    deliveryFee: 50.00,
  };
  totals.total = totals.subtotal + totals.deliveryFee;
  orderData.totals = totals;

  setTimeout(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('foodie_orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('foodie_orders', JSON.stringify(orders));
      cartProduct = [];
      localStorage.removeItem(CART_STORAGE_KEY);
      alert(`Order placed successfully! Your order ID is: ${orderData.orderId}\nTotal: Rs ${orderData.totals.total.toFixed(2)}\n\nYou will receive a confirmation email shortly.`);
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Place Order';
      }
    }
  }, 2000);
};

const goBack = () => {
  window.history.back();
};

const initApp = async () => {
  try {
    const response = await fetch('product.json');
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    productList = await response.json();
    restoreCartItems();
    showCards();
    updateAllAddToCartButtons();
  } catch (error) {
    console.error('Error loading products:', error);
  }
};

const initCheckout = async () => {
  try {
    const response = await fetch('product.json');
    productList = await response.json(); 
    
    
    loadCheckoutCart(); 

   
  } catch (error) {
    console.error('Error loading products:', error);
  }
};
document.addEventListener('DOMContentLoaded', () => {
  
  const isCheckoutPage = window.location.pathname.includes('checkout.html');
  

  restoreCartItems();
  
  if (isCheckoutPage) {
    initCheckout();
    
       const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', placeOrder);
    }
  } else {
    initApp();
  }
});





