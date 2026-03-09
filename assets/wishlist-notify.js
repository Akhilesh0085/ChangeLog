window.addEventListener("DOMContentLoaded", function() {
  const emailHolder = document.querySelector(".before_wish");
  if (emailHolder) {
    const email = emailHolder.getAttribute("customer-email");
    if (email && email !== "") {
      refreshWishlist(email);
    }
  }
});

$(document).ready(function () {
  // --- Helpers ---
  function showPopup(popupId, message) {
    var popup = document.getElementById(popupId);
    if (popup) {
      popup.querySelector("p").textContent = message;
      popup.style.display = "block";
      setTimeout(function () {
        popup.style.display = "none";
      }, 3000);
    }
  }

  // --- Notify Button Click ---
  $(document).on("click", ".sold_out_product_notify, #notifyMeBtn", function () {
    var variantIdAttr = $(this).attr("variant-id"), customerEmail = $(this).attr("customer-email"), 
      customerPhone = $(this).attr("customer-phone"), customerId = $(this).attr("customer-id"), 
      productId = $(this).attr("productid"), notifyDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    console.log("this", $(this), "customerId", customerId);
    if (!customerEmail) {
      $("#loginPopup").html(`
        <div class="noti_pop_log">
          <span class="popup-close">✖</span>
          <h3>Please Login</h3>
          <p>This feature requires you to log in first</p>
          <div class="button log_in_opup">Login</div>
        </div>
      `).fadeIn();
      return;
    }

    if (variantIdAttr && variantIdAttr.startsWith("[")) {
      var variantIds = variantIdAttr.replace(/[\[\]\s]/g, "").split(",");
      $("#outOfStockVariants").empty();

      Promise.all(
        variantIds.map((id) =>
          fetch(`/variants/${id}.js`)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Failed to fetch variant ${id}: ${res.status}`))))
            .catch((err) => {
              console.error(`Fetch error for variant ${id}:`, err);
              return null;
            })
        )
      )
        .then((variants) => {
          const validVariants = variants.filter((v) => v !== null);
          if (validVariants.length === 0) {
            $("#outOfStockVariants").html("<p>No valid variants available.</p>");
            return;
          }

          validVariants.sort((a, b) => {
            const titleA = a.title || a.option1 || (a.id && a.id.toString()) || "";
            const titleB = b.title || b.option1 || (b.id && b.id.toString()) || "";
            return titleA.localeCompare(titleB);
          });

          validVariants.forEach((variant) => {
            let variantId = variant.id?.toString() || "unknown";
            const variantTitle = variant.title || variant.option1 || variant.option2 || variant.option3 || variant.name || `Variant ${variantId.replace("gid://shopify/ProductVariant/", "").slice(-4) || "unknown"}`;

            $("#outOfStockVariants").append(`
              <div class="out-of-stock-option">
                <label>
                  <input type="radio" class="notify-variant" name="notify_variant" value="${variantId.replace("gid://shopify/ProductVariant/", "") || variantId}">
                  ${variantTitle}
                </label>
              </div>
            `);
          });
        })
        .catch((err) => {
          console.error("Variant fetch error:", err);
          $("#outOfStockVariants").html("<p>Error loading variants. Please try again.</p>");
        });
    } else if (variantIdAttr) {
      $("#outOfStockVariants").empty();
      fetch(`/variants/${variantIdAttr}.js`)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Failed to fetch variant ${variantIdAttr}: ${res.status}`))))
        .then((variant) => {
          let variantId = variant.id?.toString() || "unknown";
          const variantTitle = variant.title || variant.option1 || variant.option2 || variant.option3 || variant.name || `Variant ${variantId.replace("gid://shopify/ProductVariant/", "").slice(-4) || "unknown"}`;

          $("#outOfStockVariants").append(`
            <div class="out-of-stock-option">
              <label>
                <input type="radio" class="notify-variant" name="notify_variant" value="${variantId.replace("gid://shopify/ProductVariant/", "") || variantId}" checked>
                ${variantTitle}
              </label>
            </div>
          `);
        })
        .catch((err) => {
          console.error("Single variant fetch error:", err);
          $("#outOfStockVariants").html("<p>Error loading variant. Please try again.</p>");
        });
    } else {
      $("#outOfStockVariants").html("<p>No variants available.</p>");
    }

    $("#notifyMePopup").css("display", "block");
  });

  // --- Close Popups ---
  $(document).on("click", ".close-popup, .close-btn", function () {
    $("#loginPopup, #notifyMePopup").fadeOut();
  });

  $(".close-popup").on("click", function () {
    $("#notifyMePopup").css("display", "none");
  });

  // --- Notify Submit ---
  $(document).on("click", "#notifySubmit", function () {
    var customerEmail = $(".sold_out_product_notify").attr("customer-email");
    var customerId = $(".sold_out_product_notify").attr("customer-id");
    var customerPhone = $(".sold_out_product_notify").attr("customer-phone");
    var productId = $(".sold_out_product_notify").attr("productid");
    var notifyDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

    var selectedVariants = [];
    $(".notify-variant:checked").each(function () {
      selectedVariants.push($(this).val());
    });

    if (selectedVariants.length === 0) {
      showPopup("notifyPopup", "Please select at least one out-of-stock size.");
      return;
    }

    if (!customerEmail) {
      $("#loginPopup").html(`
        <div class="noti_pop_log">
          <span class="popup-close">✖</span>
          <h3>Please Login</h3>
          <p>This feature requires you to log in first</p>
          <div class="button log_in_opup">Login</div>
        </div>
      `).fadeIn();
      return;
    }

    $(this).addClass("loading").prop("disabled", true);

    fetch("https://shopify.shopforaurelia.com/notification/adddata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customerEmail,
        phone: customerPhone || "",
        variantid: selectedVariants[0],
        productid: productId,
        notify_date: notifyDate,
        customerid: customerId
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Notify adddata API failed: ${response.status}`);
        const data = await response.json();
        showPopup("notifyPopup", "We’ve received your request. You’ll be notified soon!");
        $("#notifyMePopup").fadeOut();
        getNotifyByEmail(customerEmail);
      })
      .catch((error) => {
        console.error("Notify adddata error:", error);
        showPopup("notifyPopup", "Something went wrong, please try again later.");
      })
      .finally(() => {
        $(this).removeClass("loading").prop("disabled", false);
      });
  });

  // --- Notify Get by Email ---
  async function getNotifyByEmail(email) {
    const $notifySection = $("#notify-section");
    $notifySection.html('<p>Loading notifications...</p>');

    try {
      if (!email) {
        $notifySection.html(
          `<p>Please log in to view notifications. <a href="${loginUrl}" class="button">Login</a></p>`
        );
        return;
      }

      const response = await fetch("https://shopify.shopforaurelia.com/notification/getbyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTgxMDI3NTZ9.Eyxcm5176i2RVvfRao9gZjp8a3Aa_bg3igEJ0ssVd6Y",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Notify getbyemail API failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data || !result.data.length) {
        $notifySection.html("<p>No notifications found.</p>");
        return;
      }

      $notifySection.empty();
      result.data.forEach((item) => {
        const productHtml = `
          <div class="notify-item">
            <p>Product ID: ${item.productid}</p>
            <p>Variant ID: ${item.variantid}</p>
            <p>Notify Date: ${item.notify_date}</p>
          </div>`;
        $notifySection.append(productHtml);
      });
    } catch (err) {
      console.error("Notify getbyemail error:", err);
      $notifySection.html("<p>Error loading notifications. Please try again later.</p>");
    }
  }

  // --- Wishlist Button Click ---
  $(document).on("click", ".cstm_wishlist_icon", function () {
    var before = $(this).find(".before_wish");
    var after = $(this).find(".after_wish");
    var variantId = before.attr("variant-id");
    var customerEmail = before.attr("customer-email");
    var customerPhone = before.attr("customer-phone");
    var customerId = before.attr("customer-id");
    var productId = before.attr("productid");
    var productTitle = before.attr("product-title");
    var productHandle = before.attr("product-handle");
    var price = before.attr("product-price");
    var variantTitle = before.attr("variant-title");
    var productImage = before.attr("product-image");
    var wishlistDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

    if (!customerEmail) {
      $("#loginPopup").html(`
        <div class="noti_pop_log">
          <span class="popup-close">✖</span>
          <h3>Please Login</h3>
          <p>This feature requires you to log in first</p>
          <div class="button log_in_opup">Login</div>
        </div>
      `).fadeIn();
      return;
    }

    var wishlist = getWishlist();
    var exists = wishlist.find((item) => item.variantId === variantId);

    if (exists) {
      wishlist = wishlist.filter((item) => item.variantId !== variantId);
      before.show();
      after.hide();
      showPopup("wishlistPopup", "Removed from Wishlist ❌");
      saveWishlist(wishlist);
      return fetch(`https://shopify.shopforaurelia.com/wishlist/getdatabyuser/${customerEmail}`, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((response) => response.json())
        .then((result) => {
          let serverVariantIds = [];
          if (result.success && result.data && result.data.variantid && result.data.variantid.length) {
            serverVariantIds = result.data.variantid.map((item) => String(item.id).replace("gid://shopify/ProductVariant/", ""));
          }
          const updatedVariantIds = serverVariantIds.filter((id) => id !== variantId);
          return updateWishlistAPI(customerEmail, customerPhone, wishlist, productId, wishlistDate, updatedVariantIds);
        })
        .then(() => refreshWishlist(customerEmail))
        .catch((error) => {
          console.error("Wishlist remove error:", error);
          showPopup("wishlistPopup", "Error removing from wishlist. Please try again.");
        });
    } else {
      wishlist.push({
        variantId,
        productId,
        productTitle,
        productHandle,
        productImage,
        price,
        variantTitle,
        wishlistDate,
        customerEmail,
        customerPhone,
      });
      before.hide();
      after.show();
      showPopup("wishlistPopup", "Added to Wishlist ❤️");
      saveWishlist(wishlist);
      return fetch(`https://shopify.shopforaurelia.com/wishlist/getdatabyuser/${customerEmail}`, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((response) => response.json())
        .then((result) => {
          let serverVariantIds = [];
          if (result.success && result.data && result.data.variantid && result.data.variantid.length) {
            serverVariantIds = result.data.variantid.map((item) => String(item.id).replace("gid://shopify/ProductVariant/", ""));
          }
          const mergedVariantIds = [...new Set([...serverVariantIds, ...wishlist.map((item) => item.variantId)])];
          return updateWishlistAPI(customerEmail, customerPhone, wishlist, productId, wishlistDate, mergedVariantIds);
        })
        .then(() => refreshWishlist(customerEmail))
        .catch((error) => {
          console.error("Wishlist add error:", error);
          showPopup("wishlistPopup", "Error adding to wishlist. Please try again.");
        });
    }
  });

  // --- Wishlist Add/Update API ---
  function updateWishlistAPI(email, phone, list, productId, wishlistDate, variantIds) {
    const payload = {
      useremail: email || "Guest",
      variantids: variantIds || list.map((item) => item.variantId),
      phone: phone || "",
      productid: productId || "",
      wishlist_date: wishlistDate || "",
    };

    return fetch("https://shopify.shopforaurelia.com/wishlist/addwishlistdata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();
        return data;
      })
      .catch((error) => {
        console.error("Wishlist addwishlistdata error:", error);
        throw error;
      });
  }

  // --- Variant Selection Updates ---
  $(document).on("click", "label[current-variant-id]", function () {
    var newVariantId = $(this).attr("current-variant-id");
    $(".before_wish").attr("variant-id", newVariantId);
  });

  $(document).on("click", ".cstm__size_coll a", function (e) {
    e.preventDefault();
    var newVariantId = $(this).data("attr");
    var cardWrapper = $(this).closest(".cstm__card_bottom");
    cardWrapper.find(".cstm__card_button").attr("data-id", newVariantId);
    cardWrapper
      .closest(".grid__item, .product-card, [productid]")
      .find(".before_wish")
      .attr("variant-id", newVariantId);
  });

  // --- Close Login Popup ---
  $(document).on("click", ".popup-close, .close-btn", function () {
    $("#loginPopup").fadeOut();
  });

  $(document).ready(function(){
    $("#loginPopup").click(function(){
      $(".otp_overlay").css("display", "block");
      $("#loginPopup .noti_pop_log").css("display", "none");
    });
  });
});

function getWishlist() {
  var list = localStorage.getItem("wishlist");
  return list ? JSON.parse(list) : [];
}

function saveWishlist(list) {
  localStorage.setItem("wishlist", JSON.stringify(list));
}

async function refreshWishlist(email) {
  const $wishlistPage = $("#wishlistPage");
  $wishlistPage.html('<p>Loading wishlist...</p>');

  try {
    if (!email) {
      $wishlistPage.html(
        `<p>Please log in to view wishlist. <a href="${loginUrl}" class="button">Login</a></p>`
      );
      return;
    }

    const response = await fetch(`https://shopify.shopforaurelia.com/wishlist/getdatabyuser/${email}`, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) {
      throw new Error(`Wishlist getdatabyuser API failed: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data || !result.data.variantid || !result.data.variantid.length) {
      $wishlistPage.html("<p>No items in your wishlist.</p>");
      saveWishlist([]);
      const cartWishListButton = document.querySelector("#cart_wishlist_btn");
      if (cartWishListButton) {
        cartWishListButton.style.display = "none";
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
      productId: item.product && item.product.id ? String(item.product.id).replace("gid://shopify/Product/", "") : "",
      product_checker: item.availableForSale || false,
      wishlistDate: result.data.wishlist_date || "",
      customerEmail: result.data.useremail || "",
      customerPhone: result.data.phone || "",
    }));

    let wishlist = getWishlist();
    const mergedWishlist = [...wishlist];
    apiItems.forEach((serverItem) => {
      if (!mergedWishlist.find((item) => item.variantId === serverItem.variantId)) {
        mergedWishlist.push(serverItem);
      }
    });

    const treatAsPaise = apiItems.some((it) => Math.abs(it.priceRaw) >= 100000 && Number.isInteger(it.priceRaw));
    function rawToRupees(raw) { return Number.isFinite(raw) ? (treatAsPaise ? raw / 100 : raw) : 0; }
    function limitChars(str, limit) { return str.length > limit ? str.substring(0, limit) + "..." : str; }
    function formatINRNumber(rupeeNumber) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(rupeeNumber);
    }

    $wishlistPage.empty();
    apiItems.forEach((item) => {
      const priceR = rawToRupees(item.priceRaw);
      const compareR = rawToRupees(item.compareRaw);
      let compareHtml = "", discountHtml = "";
      if (compareR > priceR && compareR > 0) {
        compareHtml = `<p class="compare-price">${formatINRNumber(compareR)}</p>`;
        const discountPercent = Math.round(((compareR - priceR) / compareR) * 100);
        const savings = compareR - priceR;
        discountHtml = `<span class="discount__percentage__grid font-bold">- ${discountPercent}% (Save - ${formatINRNumber(savings)})</span>`;
      }


    
      $wishlistPage.append(`
        <div class="wishlist-item">
          <button class="wishlist_remove_btn" data-variant-id="${item.variantId}" data-product-id="${item.productId}" data-wishlist-date="${item.wishlistDate || ""}" data-email="${item.customerEmail}" data-phone="${item.customerPhone}">✖</button>
          <a href="/products/${item.productHandle}" class="view-product" checker="${item.product_checker}">
            <img class="wishlisht_prd_img" src="${item.productImage}" alt="${item.productTitle}">
            <h4>${limitChars(item.productTitle, 25)} (${item.variantTitle})</h4>
            <div class="wishlist_card_price">${compareHtml}<p class="final-price">${formatINRNumber(priceR)}</p>${discountHtml}</div>
          </a>
          ${
            item.product_checker
              ? `<button class="wishlist_add_to_cart product-form__submit button button--secondary button--full-width" variant_id="${item.variantId}">Add To Cart</button>`
              : `<button class="wishlist_add_to_cart product-form__submit button button--secondary button--full-width disabled" disabled variant_id="${item.variantId}">Sold Out</button>`
          }
        </div>
      `);
    });

    const cartWishListButton = document.querySelector("#cart_wishlist_btn");
    if (cartWishListButton) {
      cartWishListButton.style.display = (mergedWishlist.length === 0 ? "none" : "flex");
    }
    saveWishlist(mergedWishlist);
    $(".before_wish").each(function () {
      var before = $(this), after = before.siblings(".after_wish");
      var variantId = before.attr("variant-id");
      var exists = getWishlist().find((item) => item.variantId === variantId);
      if (exists) { before.hide(); after.show(); } else { after.hide(); before.show(); }
    });
  } catch (err) {
    console.error("Wishlist getdatabyuser error:", err);
    $wishlistPage.html("<p>Error loading wishlist. Please try again later.</p>");
  }
}

function updateWishlistCounterFromStorage() {
  try {
    var wishlistData = localStorage.getItem("wishlist");
    var count = wishlistData ? JSON.parse(wishlistData).length : 0;
    var counter = document.querySelector(".wishlist_counter_block");
    if (counter) counter.textContent = count;
  } catch (e) {
    console.error("Wishlist parse error", e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateWishlistCounterFromStorage();
  window.addEventListener("storage", function (event) {
    if (event.key === "wishlist") updateWishlistCounterFromStorage();
  });
  document.body.addEventListener("click", function (e) {
    if (e.target.closest(".swym-button, .swym-add-to-wishlist, .swym-heart")) {
      setTimeout(updateWishlistCounterFromStorage, 300);
    }
  });
  setInterval(updateWishlistCounterFromStorage, 5000);
});