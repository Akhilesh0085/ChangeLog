class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-items').updateQuantity(this.dataset.index, 0);
    });
  }
}
customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();

    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');
    this.cartErrors = document.getElementById('cart-errors');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    if (event.target === null) return;
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  getSectionsToRender() {
    let sections = [
      {
        id: 'mini-cart',
        section: document.getElementById('mini-cart')?.id,
        selector: '.shopify-section',
      },
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items')?.dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'mobile-cart-icon-bubble',
        section: 'mobile-cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer')?.dataset.id,
        selector: '.js-contents',
      }
    ];
    if (document.querySelector('#main-cart-footer .free-shipping')) {
      sections.push({
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer')?.dataset.id,
        selector: '.free-shipping',
      });
    }
    return sections;
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);
    const sections = this.getSectionsToRender().map((section) => section.section);

    const body = JSON.stringify({
      line,
      quantity,
      sections: sections,
      sections_url: window.location.pathname
    });

    fetch(`${theme.routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (parsedState.errors) {
          this.updateErrorLiveRegions(line, parsedState.errors);
        }
        this.getSectionsToRender().forEach((section => {
          const element = document.getElementById(section.id);
          if (element) {
            const elementToReplace = element.querySelector(section.selector) || element;

            if (elementToReplace && parsedState.sections[section.section]) {
              elementToReplace.innerHTML =
                this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            }
          }
        }));
        
        this.updateQuantityLiveRegions(line, parsedState.item_count);
        
        const lineItem = document.getElementById(`CartItem-${line}`);
        if (lineItem && name) lineItem.querySelector(`[name="${name}"]`).focus();
        this.disableLoading();

        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: {
            cart: state
          }
        }));
        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items' });
      })
      .catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        this.disableLoading();
        if (this.cartErrors) {
          this.cartErrors.textContent = theme.cartStrings.error;
        }
      });
  }
  
  updateErrorLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item__error-text').innerHTML = message;
  
    this.lineItemStatusElement.setAttribute('aria-hidden', true);
  
    const cartStatus =
      document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);
  
    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }
  
  updateQuantityLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      const quantityError = document.getElementById(`Line-item-error-${line}`);
      if (quantityError) {
        quantityError.querySelector('.cart-item__error-text')
          .innerHTML = theme.cartStrings.quantityError.replace(
            '[quantity]',
            document.getElementById(`Quantity-${line}`).value
          ); 
      }
    }

    this.currentItemCount = itemCount;
    
    if (this.lineItemStatusElement) this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text');
    if (cartStatus) {
      cartStatus.setAttribute('aria-hidden', false);

      setTimeout(() => {
        cartStatus.setAttribute('aria-hidden', true);
      }, 1e3);
    }
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector)?.innerHTML;
  }

  enableLoading(line) {
    const cartItems = document.getElementById('main-cart-items');
    if (cartItems) cartItems.classList.add('cart__items--disabled');

    const loadingOverlay = this.querySelectorAll('.loading-overlay')[line - 1];
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    
    document.activeElement.blur();
    if (this.lineItemStatusElement) this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading() {
    const cartItems = document.getElementById('main-cart-items');
    if (cartItems) cartItems.classList.remove('cart__items--disabled');
  }

  renderContents(parsedState) {
    this.getSectionsToRender().forEach((section => {
      const element = document.getElementById(section.id);

      if (element) {
        element.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }
    }));
  }
}
customElements.define('cart-items', CartItems);

class CartNote extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('change', debounce((event) => {
      const body = JSON.stringify({ note: event.target.value });
      fetch(`${theme.routes.cart_update_url}`, {...fetchConfig(), ...{ body }});
    }, 300));
  }
}
customElements.define('cart-note', CartNote);

class DiscountCode extends HTMLElement {
  constructor() {
    super();

    if (isStorageSupported('session')) {
      this.setupDiscount();

      this.addEventListener('change', (event) => {
        window.sessionStorage.setItem('discount', event.target.value);
      });
    }
  }

  setupDiscount() {
    const discount = window.sessionStorage.getItem('discount');
    if (discount !== null) {
      this.querySelector('input[name="discount"]').value = discount;
    }
  }
}

customElements.define('discount-code', DiscountCode);

class ShippingCalculator extends HTMLElement {
  constructor() {
    super();

    this.setupCountries();
    
    this.errors = this.querySelector('#ShippingCalculatorErrors');
    this.success = this.querySelector('#ShippingCalculatorSuccess');
    this.zip = this.querySelector('#ShippingCalculatorZip');
    this.country = this.querySelector('#ShippingCalculatorCountry');
    this.province = this.querySelector('#ShippingCalculatorProvince');
    this.button = this.querySelector('button');
    this.button.addEventListener('click', this.onSubmitHandler.bind(this));
  }

  setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('ShippingCalculatorCountry', 'ShippingCalculatorProvince', {
        hideElement: 'ShippingCalculatorProvinceContainer'
      });
    }
  }

  onSubmitHandler(event) {
    event.preventDefault();
    
    this.errors.classList.add('hidden');
    this.success.classList.add('hidden');
    this.zip.classList.remove('invalid');
    this.country.classList.remove('invalid');
    this.province.classList.remove('invalid');
    this.button.classList.add('loading');
    this.button.setAttribute('disabled', true);

    const body = JSON.stringify({
      shipping_address: {
        zip: this.zip.value,
        country: this.country.value,
        province: this.province.value
      }
    });
    let sectionUrl = `${theme.routes.cart_url}/shipping_rates.json`;

    // remove double `/` in case shop might have /en or language in URL
    sectionUrl = sectionUrl.replace('//', '/');

    fetch(sectionUrl, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((parsedState) => {
        if (parsedState.shipping_rates) {
          this.success.classList.remove('hidden');
          this.success.innerHTML = '';
          
          parsedState.shipping_rates.forEach((rate) => {
            const child = document.createElement('p');
            child.innerHTML = `${rate.name}: ${rate.price} ${Shopify.currency.active}`;
            this.success.appendChild(child);
          });
        }
        else {
          let errors = [];
          Object.entries(parsedState).forEach(([attribute, messages]) => {
            errors.push(`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${messages[0]}`);
          });

          this.errors.classList.remove('hidden');
          this.errors.querySelector('.errors').innerHTML = errors.join('; ');
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.button.classList.remove('loading');
        this.button.removeAttribute('disabled');
      });
  }
}

customElements.define('shipping-calculator', ShippingCalculator);



function getWishlist() {
  const list = localStorage.getItem("wishlist");
  return list ? JSON.parse(list) : [];
}

function saveWishlist(list) {
  localStorage.setItem("wishlist", JSON.stringify(list));
}

document.addEventListener("click", function(e) {
  // Open drawer when wishlist button clicked
  const btn = e.target.closest("#cart_wishlist_btn");
  if (btn) {
    e.preventDefault();

    var customerEmail = $("#cart_wishlist_btn").attr("customer-email");
    if (!customerEmail) {
      $("#loginPopup").fadeIn();
      return;
    }

    fetch(`https://shopify.shopforaurelia.com/wishlist/getdatabyuser/${customerEmail}`, { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        if (!result.success || !result.data || !result.data.variantid || result.data.variantid.length === 0) {
          $("#wishlistPage").html("<p>No items in your wishlist.</p>");
          const cartWishListButton = document.querySelector("#cart_wishlist_btn");
          if (cartWishListButton) {
            cartWishListButton.style.display = "none";
          }
          return;
        }

        // Map raw items
        var apiItems = result.data.variantid.map(function (item) {
          return {
            variantId: item.id ? String(item.id).replace("gid://shopify/ProductVariant/", "") : "",
            priceRaw: item.price !== undefined ? Number(item.price) : 0,
            compareRaw: item.compareAtPrice !== undefined ? Number(item.compareAtPrice) : 0,
            productTitle: item.product ? item.product.title : "",
            productHandle: item.product ? item.product.handle : "",
            productImage: item.product && item.product.images && item.product.images[0] ? item.product.images[0].url : "",
            variantTitle: item.title || "",
            customerEmail: result.data.useremail || "",
            wishlistDate: result.data.wishlist_date || "",
            productId: item.product && item.product.id 
              ? String(item.product.id).replace("gid://shopify/Product/", "") 
              : "",
            customerPhone: document.querySelector("#cart_wishlist_btn").getAttribute("customer-phone")
          };
        });

        // Heuristic detection
        var paiseCount = 0;
        var fractionFound = false;
        apiItems.forEach(function (it) {
          if (!Number.isFinite(it.priceRaw)) it.priceRaw = 0;
          if (!Number.isFinite(it.compareRaw)) it.compareRaw = 0;
          if (!Number.isInteger(it.priceRaw) || !Number.isInteger(it.compareRaw)) {
            fractionFound = true;
          }
          if (Math.abs(it.priceRaw) >= 100000 || Math.abs(it.compareRaw) >= 100000) {
            paiseCount++;
          }
        });

        var treatAsPaise = fractionFound ? false : paiseCount > apiItems.length / 2;

        function rawToRupees(raw) {
          if (!Number.isFinite(raw)) return 0;
          return treatAsPaise ? (raw / 100) : raw;
        }
        function limitChars(str, limit) {
          return str.length > limit ? str.substring(0, limit) + "..." : str;
        }
        function formatINRNumber(rupeeNumber) {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(rupeeNumber);
        }
        
        $("#wishlist-items").empty();
        apiItems.forEach(function (item) {
          var priceR = rawToRupees(item.priceRaw);
          var compareR = rawToRupees(item.compareRaw);

          var compareHtml = "";
          var discountHtml = "";
          if (compareR > priceR && compareR > 0) {
            compareHtml = `<p class="compare-price">${formatINRNumber(compareR)}</p>`;
            var discountPercent = Math.round(((compareR - priceR) / compareR) * 100);
            var savings = compareR - priceR;
            discountHtml = `<span class="discount__percentage__grid font-bold">- ${discountPercent}% (Save - ${formatINRNumber(savings)})</span>`;
          }

          var productHtml = `
            <div class="wishlist-item">
            <button 
              class="wishlist_remove_btn" 
              data-variant-id="${item.variantId}" 
              data-product-id="${item.productId}"
              data-wishlist-date="${item.wishlistDate || ""}"
              data-email="${item.customerEmail}" 
              data-phone="${item.customerPhone}"
            >✖</button>
              <a href="/products/${item.productHandle}" class="view-product">
                <img class="wishlisht_prd_img" src="${item.productImage}" alt="${item.productTitle}">
                <h4>${limitChars(item.productTitle, 50)} (${item.variantTitle})</h4>
                <div class="wishlist_card_price">
                  ${compareHtml}
                  <p class="final-price">${formatINRNumber(priceR)}</p>
                  ${discountHtml}
                </div>
              </a>
              
              <button class="wishlist_add_to_cart product-form__submit button button--secondary button--full-width cstm__card_button" variant_id="${item.variantId}">Add To Cart</button>
            </div>
          `;
          $("#wishlist-items").append(productHtml);
        });
      })
      .catch((err) => {
        console.error("API Fetch Error:", err);
        $("#wishlistPage").html("<p>Error loading wishlist. Please try again later.</p>");
      });

    // Finally open the drawer
    const drawer = document.getElementById("wishlist-drawer");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "false");
      drawer.classList.add("open");
      document.body.classList.add("drawer-open");
    }
  }

  // Close drawer when backdrop or close button clicked
  if (e.target.matches("[data-drawer-close]")) {
    const drawer = document.getElementById("wishlist-drawer");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "true");
      drawer.classList.remove("open");
      document.body.classList.remove("drawer-open"); 
    }
  }
});

// Close login popup on close button click
$(document).on("click", "#loginPopup .close-btn", function() {
  $("#loginPopup").fadeOut();
});

$(document).on("click", ".wishlist_remove_btn", function () {
  const $button = $(this);
  const variantId = String($button.data("variant-id"));
  const productId = $button.data("product-id");
  const wishlistDate = $button.data("wishlist-date") || "";
  const customerEmail = $button.data("email");
  const customerPhone = $button.data("phone") || "";

  $button.addClass("loading");

  // Remove item from local storage
  let wishlist = getWishlist();
  wishlist = wishlist.filter((item) => String(item.variantId) !== variantId);
  saveWishlist(wishlist);
  const remainingVariantIds = wishlist.map((item) => item.variantId);

  // Update wishlist via POST API
  function updateWishlistAPI(email, phone, variantIds, productId, wishlistDate) {
    const payload = {
      useremail: email || "Guest",
      variantids: variantIds,
      phone: phone || "",
      productid: productId || "",
      wishlist_date: wishlistDate || "",
    };

    return fetch("https://shopify.shopforaurelia.com/wishlist/addwishlistdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`POST API failed with status: ${response.status}`);
        }
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (err) {
          console.error("JSON parse error:", err, text);
          throw err;
        }
      });
  }

  // Refresh wishlist UI via GET API
  function refreshWishlist(email) {
    $("#wishlist-items").html('<p>Loading...</p>'); 

    fetch(`https://shopify.shopforaurelia.com/wishlist/getdatabyuser/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.success || !result.data || !result.data.variantid || result.data.variantid.length === 0) {
          $("#wishlist-items").html("<p>No items in your wishlist.</p>");
          const cartWishListButton = document.querySelector("#cart_wishlist_btn");
          const wishlistDrawer = document.querySelector("#wishlist-drawer");
          if (cartWishListButton) {
            cartWishListButton.style.display = "none";
          }
          if (wishlistDrawer) {
            wishlistDrawer.classList.remove("open");
          }
          return;
        }

        const apiItems = result.data.variantid.map((item) => ({
          variantId: item.id ? String(item.id).replace("gid://shopify/ProductVariant/", "") : "",
          priceRaw: item.price !== undefined ? Number(item.price) : 0,
          compareRaw: item.compareAtPrice !== undefined ? Number(item.compareAtPrice) : 0,
          productTitle: item.product ? item.product.title : "",
          productHandle: item.product ? item.product.handle : "",
          productImage: item.product && item.product.images && item.product.images[0] ? item.product.images[0].url : "",
          variantTitle: item.title || "",
          productId: item.product && item.product.id
            ? String(item.product.id).replace("gid://shopify/Product/", "")
            : "",
          product_checker: item.availableForSale || false,
          wishlistDate: result.data.wishlist_date || "",
          customerEmail: result.data.useremail || "",
          customerPhone: result.data.phone || customerPhone,
        }));

        // Price handling
        const treatAsPaise = apiItems.some((it) => Math.abs(it.priceRaw) >= 100000 && Number.isInteger(it.priceRaw));

        function rawToRupees(raw) {
          return Number.isFinite(raw) ? (treatAsPaise ? raw / 100 : raw) : 0;
        }

        function limitChars(str, limit) {
          return str.length > limit ? str.substring(0, limit) + "..." : str;
        }

        function formatINRNumber(rupeeNumber) {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(rupeeNumber);
        }

        $("#wishlist-items").empty();
        apiItems.forEach((item) => {
          const priceR = rawToRupees(item.priceRaw);
          const compareR = rawToRupees(item.compareRaw);

          let compareHtml = "";
          let discountHtml = "";
          if (compareR > priceR && compareR > 0) {
            compareHtml = `<p class="compare-price">${formatINRNumber(compareR)}</p>`;
            const discountPercent = Math.round(((compareR - priceR) / compareR) * 100);
            const savings = compareR - priceR;
            discountHtml = `<span class="discount__percentage__grid font-bold">- ${discountPercent}% (Save - ${formatINRNumber(savings)})</span>`;
          }

          const productHtml = `
            <div class="wishlist-item">
              <button 
                class="wishlist_remove_btn" 
                data-variant-id="${item.variantId}" 
                data-product-id="${item.productId}"
                data-wishlist-date="${item.wishlistDate || ''}"
                data-email="${item.customerEmail}" 
                data-phone="${item.customerPhone}"
              >✖</button>
              <a href="/products/${item.productHandle}" class="view-product" checker="${item.product_checker}">
                <img class="wishlisht_prd_img" src="${item.productImage}" alt="${item.productTitle}">
                <h4>${limitChars(item.productTitle, 25)} (${item.variantTitle})</h4>
                <div class="wishlist_card_price">
                  ${compareHtml}
                  <p class="final-price">${formatINRNumber(priceR)}</p>
                  ${discountHtml}
                </div>
              </a>
              ${
                item.product_checker
                  ? `<button class="wishlist_add_to_cart product-form__submit button button--secondary button--full-width" variant_id="${item.variantId}">Add To Cart</button>`
                  : `<button class="wishlist_add_to_cart product-form__submit button button--secondary button--full-width disabled" disabled variant_id="${item.variantId}">Sold Out</button>`
              }
            </div>`;
          $("#wishlist-items").append(productHtml);
        });
        var list = localStorage.getItem("wishlist");
        const wishlistData = list ? JSON.parse(list) : [];
        const cartWishListButton = document.querySelector("#cart_wishlist_btn");
        const wishlistDrawer = document.querySelector("#wishlist-drawer");
        if (cartWishListButton) {
          cartWishListButton.style.display = (wishlistData.length === 0 ? "none" : "flex");
        }
        if (wishlistDrawer) {
          if (wishlistData.length === 0) {wishlistDrawer.classList.remove("open")}
        }
      })
      .catch((err) => {
        console.error("GET API Fetch Error:", err);
        $("#wishlist-items").html("<p>Error loading wishlist. Please try again later.</p>");
      })
      .finally(() => {
        $button.removeClass("loading");
      });
  }

  // Execute POST API and then refresh wishlist
  updateWishlistAPI(customerEmail, customerPhone, remainingVariantIds, productId, wishlistDate)
    .then((data) => {
      if (data.success) {
        refreshWishlist(customerEmail);
      } else {
        $("#wishlistPage").html("<p>Failed to update wishlist. Please try again.</p>");
        $button.removeClass("loading");
      }
    })
    .catch((error) => {
      console.error("POST API Fetch Error:", error);
      $("#wishlistPage").html("<p>Error updating wishlist. Please try again later.</p>");
      $button.removeClass("loading");
    });
});

$('body').on('click', '.wishlist_add_to_cart', function() {
  var id = $(this).attr('variant_id');
  var $button = $(this);
  if (!id) {
    console.log('No variant ID found.');
  } else {
    $button.addClass('loading');
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {
        id: id,
        quantity: 1,
      },
      dataType: 'json',
      success: function(response) {
        $.getJSON('/?sections=mini-cart,cart-icon-bubble,mobile-cart-icon-bubble').then(sections => {
          const minicart = document.querySelector('mini-cart');
          response.sections = sections;
          minicart.renderContents(response);
          $button.removeClass('loading');
          $('.main__cart_card').hide();
        });
      },
      error: function() {
        console.log('There was an error adding the item to the cart.');
        $button.removeClass('loading');
        $('.main__cart_card').hide();
      }
    });
  }
});
