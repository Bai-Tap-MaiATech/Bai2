document.addEventListener('DOMContentLoaded', () => {
    // Top bar close functionality
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.querySelector('.top-bar').style.display = 'none';
        });
    }
    // Size buttons functionality
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Color circles functionality
    const colorCircles = document.querySelectorAll('.color-circle');
    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            colorCircles.forEach(c => c.innerHTML = '');
            circle.innerHTML = '<i class="fas fa-check"></i>';
        });
    });

    // Tab buttons functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    // Thumbnail image gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const mainImage = document.querySelector('.main-image img');
    const thumbnailContainers = document.querySelectorAll('.thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.parentElement.addEventListener('click', () => {
                mainImage.src = thumb.src;
                mainImage.alt = thumb.alt;
                
                thumbnailContainers.forEach(c => c.classList.remove('active'));
                thumb.parentElement.classList.add('active');
            });
        });
    }
    // Quantity functionality
    const qtySelector = document.querySelector('.quantity-selector');
    if (qtySelector) {
        const minusBtn = qtySelector.querySelectorAll('.qty-btn')[0];
        const plusBtn = qtySelector.querySelectorAll('.qty-btn')[1];
        const qtySpan = qtySelector.querySelector('.qty');
        
        minusBtn.addEventListener('click', () => {
            let currentVal = parseInt(qtySpan.textContent);
            if (currentVal > 1) {
                qtySpan.textContent = currentVal - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let currentVal = parseInt(qtySpan.textContent);
            qtySpan.textContent = currentVal + 1;
        });
    }
    // Mobile filter toggle functionality
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const closeFilterBtn = document.querySelector('.filter-icon-btn');

    if (mobileFilterBtn && filterSidebar && sidebarOverlay) {
        const toggleFilter = () => {
            if (window.innerWidth <= 768) {
                // Mobile behavior
                filterSidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
            } else {
                // Desktop behavior
                filterSidebar.classList.toggle('desktop-hidden');
                mobileFilterBtn.classList.toggle('show-desktop');
            }
        };

        mobileFilterBtn.addEventListener('click', toggleFilter);
        sidebarOverlay.addEventListener('click', toggleFilter);
        if (closeFilterBtn) {
            closeFilterBtn.addEventListener('click', toggleFilter);
        }
        
        // Handle window resize logic so states don't conflict
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                filterSidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            } else {
                filterSidebar.classList.remove('desktop-hidden');
                mobileFilterBtn.classList.remove('show-desktop');
            }
        });
    }

    // Filter Accordion Toggle
    const filterHeaders = document.querySelectorAll('.filter-group-header');
    filterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            if (content) {
                if (content.style.display === 'none') {
                    content.style.display = '';
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                } else {
                    content.style.display = 'none';
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            }
        });
    });

    // Price Slider Logic
    const sliderTrack = document.querySelector('.slider-track');
    const sliderFill = document.querySelector('.slider-fill');
    const thumbLeft = document.querySelector('.slider-thumb.left');
    const thumbRight = document.querySelector('.slider-thumb.right');
    const priceLabels = document.querySelectorAll('.slider-labels span');

    if (sliderTrack && sliderFill && thumbLeft && thumbRight && priceLabels.length === 2) {
        let isDraggingLeft = false;
        let isDraggingRight = false;
        
        let minVal = 50;
        let maxVal = 200;
        const ABS_MIN = 0;
        const ABS_MAX = 250;
        
        const updateUI = () => {
            const percentLeft = ((minVal - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100;
            const percentRight = ((maxVal - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100;
            
            thumbLeft.style.left = percentLeft + '%';
            thumbRight.style.left = percentRight + '%';
            
            sliderFill.style.left = percentLeft + '%';
            sliderFill.style.width = (percentRight - percentLeft) + '%';
            
            priceLabels[0].textContent = '$' + Math.round(minVal);
            priceLabels[1].textContent = '$' + Math.round(maxVal);
        };
        
        const handleDrag = (e) => {
            if (!isDraggingLeft && !isDraggingRight) return;
            
            const rect = sliderTrack.getBoundingClientRect();
            let x = e.clientX || (e.touches && e.touches[0].clientX);
            if (x === undefined) return;
            
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            let val = (percent / 100) * (ABS_MAX - ABS_MIN) + ABS_MIN;
            
            if (isDraggingLeft) {
                if (val > maxVal - 5) val = maxVal - 5;
                minVal = val;
            } else if (isDraggingRight) {
                if (val < minVal + 5) val = minVal + 5;
                maxVal = val;
            }
            updateUI();
        };

        const stopDrag = () => {
            isDraggingLeft = false;
            isDraggingRight = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', handleDrag);
            document.removeEventListener('touchend', stopDrag);
        };

        const startDragLeft = (e) => {
            e.preventDefault();
            isDraggingLeft = true;
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', handleDrag);
            document.addEventListener('touchend', stopDrag);
        };

        const startDragRight = (e) => {
            e.preventDefault();
            isDraggingRight = true;
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', handleDrag);
            document.addEventListener('touchend', stopDrag);
        };

        thumbLeft.addEventListener('mousedown', startDragLeft);
        thumbLeft.addEventListener('touchstart', startDragLeft, {passive: false});
        thumbRight.addEventListener('mousedown', startDragRight);
        thumbRight.addEventListener('touchstart', startDragRight, {passive: false});

        // Apply Filter Logic
        const applyFilterBtn = document.querySelector('.apply-filter-btn');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => {
                const productCards = document.querySelectorAll('.category-grid .product-card');
                let count = 0;
                productCards.forEach(card => {
                    const priceElement = card.querySelector('.price');
                    if (priceElement) {
                        const price = parseFloat(priceElement.textContent.replace('$', '').trim());
                        if (price >= minVal && price <= maxVal) {
                            card.style.display = '';
                            count++;
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
                
                const metaSpan = document.querySelector('.category-meta span');
                if (metaSpan) {
                    metaSpan.textContent = `Showing 1-${count} of ${count} Products`;
                }

                const filterSidebar = document.querySelector('.filter-sidebar');
                const sidebarOverlay = document.querySelector('.sidebar-overlay');
                if (filterSidebar && filterSidebar.classList.contains('active')) {
                    filterSidebar.classList.remove('active');
                    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                }
            });
        }
    }

    // --- CART LOGIC ---
    const getCart = () => JSON.parse(localStorage.getItem('shopco_cart')) || [];
    const saveCart = (cart) => localStorage.setItem('shopco_cart', JSON.stringify(cart));
    
    // Add to Cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn, .add-cart-large');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let productCard = e.target.closest('.product-card');
            let item = {};
            
            if (productCard) {
                // Adding from a grid (e.g. casual.html, index.html)
                const titleEl = productCard.querySelector('.product-title');
                const priceEl = productCard.querySelector('.price');
                const imgEl = productCard.querySelector('img');
                
                item = {
                    id: Date.now().toString(), // unique id
                    title: titleEl ? titleEl.textContent.trim() : 'Product',
                    price: priceEl ? parseFloat(priceEl.textContent.replace('$', '').trim()) : 0,
                    img: imgEl ? imgEl.src : '',
                    size: 'N/A',
                    color: 'N/A',
                    quantity: 1
                };
            } else {
                // Adding from product detail page (product.html)
                const container = document.querySelector('.product-detail-container');
                if (container) {
                    const titleEl = container.querySelector('.product-title');
                    const priceEl = container.querySelector('.price');
                    const imgEl = container.querySelector('.main-img-placeholder img') || container.querySelector('.main-img-placeholder');
                    const sizeActive = container.querySelector('.size-btn.active');
                    const colorActive = container.querySelector('.color-circle.active') || container.querySelector('.color-circle i');
                    const qtyEl = container.querySelector('.qty span');
                    
                    let imgSrc = '';
                    if (imgEl && imgEl.tagName === 'IMG') imgSrc = imgEl.src;
                    else if (imgEl) imgSrc = imgEl.style.backgroundImage.slice(5, -2);
                    
                    // Simple color extraction from background-color
                    let colorVal = 'Black';
                    if (colorActive) {
                        const circle = colorActive.tagName === 'I' ? colorActive.parentElement : colorActive;
                        colorVal = circle.style.backgroundColor || 'Black';
                    }
                    
                    item = {
                        id: Date.now().toString(),
                        title: titleEl ? titleEl.textContent.trim() : 'Product',
                        price: priceEl ? parseFloat(priceEl.textContent.replace('$', '').trim()) : 0,
                        img: imgSrc,
                        size: sizeActive ? sizeActive.textContent.trim() : 'N/A',
                        color: colorVal,
                        quantity: qtyEl ? parseInt(qtyEl.textContent) : 1
                    };
                }
            }
            
            if (item.title) {
                const cart = getCart();
                // Check if identical item (title, size, color) exists
                const existingIndex = cart.findIndex(i => i.title === item.title && i.size === item.size && i.color === item.color);
                if (existingIndex > -1) {
                    cart[existingIndex].quantity += item.quantity;
                } else {
                    cart.push(item);
                }
                saveCart(cart);
                
                // Show simple feedback
                const originalText = btn.textContent;
                btn.textContent = 'Added!';
                btn.style.backgroundColor = '#00C12B';
                btn.style.color = '#fff';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 1500);
            }
        });
    });

    // Render Cart Page
    const cartItemsList = document.getElementById('cart-items-list');
    if (cartItemsList) {
        const renderCart = () => {
            const cart = getCart();
            cartItemsList.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
                document.getElementById('summary-subtotal').textContent = '$0';
                document.getElementById('summary-discount').textContent = '-$0';
                document.getElementById('summary-total').textContent = '$15'; // Base delivery
                return;
            }
            
            let subtotal = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const itemHtml = `
                    <div class="cart-item">
                        <div class="cart-item-img">
                            <img src="${item.img}" alt="${item.title}" onerror="this.src='../img/c1.png'" />
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-header">
                                <h3>${item.title}</h3>
                                <button class="cart-item-delete" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                            </div>
                            <p class="cart-item-meta">Size: <span>${item.size}</span></p>
                            <p class="cart-item-meta">Color: <span>${item.color === 'N/A' ? 'N/A' : '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background-color:'+item.color+';vertical-align:middle;border:1px solid #00000033;"></span>'}</span></p>
                            <div class="cart-item-bottom">
                                <span class="cart-item-price">$${item.price}</span>
                                <div class="qty-selector">
                                    <button class="qty-btn minus-btn" data-index="${index}"><i class="fas fa-minus"></i></button>
                                    <span class="qty">${item.quantity}</span>
                                    <button class="qty-btn plus-btn" data-index="${index}"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cartItemsList.insertAdjacentHTML('beforeend', itemHtml);
            });
            
            // Update summary
            const discount = subtotal * 0.20; // 20% discount
            const delivery = 15;
            const total = subtotal - discount + delivery;
            
            document.getElementById('summary-subtotal').textContent = '$' + subtotal.toFixed(0);
            document.getElementById('summary-discount').textContent = '-$' + discount.toFixed(0);
            document.getElementById('summary-total').textContent = '$' + total.toFixed(0);
            
            // Bind events for dynamically added buttons
            document.querySelectorAll('.cart-item-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    const currentCart = getCart();
                    currentCart.splice(idx, 1);
                    saveCart(currentCart);
                    renderCart();
                });
            });
            
            document.querySelectorAll('.minus-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    const currentCart = getCart();
                    if (currentCart[idx].quantity > 1) {
                        currentCart[idx].quantity--;
                        saveCart(currentCart);
                        renderCart();
                    }
                });
            });
            
            document.querySelectorAll('.plus-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    const currentCart = getCart();
                    currentCart[idx].quantity++;
                    saveCart(currentCart);
                    renderCart();
                });
            });
        };
        
        renderCart();
    }
});
