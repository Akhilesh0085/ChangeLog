const changeTemplate = function (div) {
    const oldDiv = document.getElementById(div);
    const newDiv = document.getElementById(div + "-new").text;
    oldDiv.text = newDiv;
};


window.onWizzyScriptLoaded = function() {

  changeTemplate("wizzy-search-results-product");
  changeTemplate("wizzy-autocomplete-topproducts");

  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_INIT, function(data) {
      // console.log(data," <-- BEFORE_INIT");
      // window.wizzyConfig.common.isLazyInit = true;
      data.search.configs.facets.leftFacets.mobileCollapsible = !0;
      wizzyConfig.filters.configs.keepOpenedInMobileAfterApply = true;
      return data;
    });
  
     window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_SEARCH_EXECUTED, function(data) {
      // console.log(data," <-- BEFORE_SEARCH_EXECUTED");
       let closeButton = document.querySelector(".search__button[aria-label='Close']");
       if(closeButton) closeButton.click();

      const body = document.querySelector('body');
      if (body) {
          body.classList.remove('predictive-search--focus');
          // console.log('Removed predictive-search--focus class from <body>');
      } else {
          // console.log('Body element or predictive-search--focus class not found');
      }

       const button = document.querySelector('.search-modal__form .search__button[type="button"]');
        if (button) {
            button.click();
        }

       setTimeout(() => {
       const bodyTwo = document.querySelector("body.template-index");
        if (bodyTwo && bodyTwo.classList.contains("predictive-search--focus")) {
          bodyTwo.classList.remove("predictive-search--focus");
        }
         }, 500);

       
      return data;
    });
  
      window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_AUTOCOMPLETE_RENDER, function(data) {
        // console.log(data, "<====BEFORE_AUTOCOMPLETE_RENDER");
        let x = document.querySelector(".wizzy-body-end-wrapper");
        if(x && typeof data.isForDefault !== 'undefined' && data.isForDefault === true) {
          x.classList.add("wizzy-view-more-hide");
        }else if(x && x.classList.contains("wizzy-view-more-hide")) {
          x.classList.remove("wizzy-view-more-hide");
        }
        return data;
      });

      window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_SEARCH_EXECUTED, function(data) {
        // console.log(data, "<====BEFORE_SEARCH_EXECUTED");
        return data;
      });

      window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.VIEW_RENDERED, function(data) {
        console.log(data, "<====VIEW_RENDERED");

        // Select all the "ADD TO CART" buttons
        const addToCartButtons = document.querySelectorAll('.mobile__cart__icon');
        addToCartButtons.forEach(button => {
          button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
        
            const productItem = event.target.closest('.wizzy-result-product');
            const productId = productItem.getAttribute('data-id');
            const cartCard = productItem.querySelector('.main__cart_card');
        
            if (cartCard) {
              if (cartCard.style.display === 'none' || cartCard.style.display === '') {
                cartCard.style.display = 'block';
              } else {
                cartCard.style.display = 'none';
              }
            }
          });
        });

        // Select all the size swatch elements
        // const sizeSwatches = document.querySelectorAll('.cstm__size_collproduct-item-swatch-item');
        // sizeSwatches.forEach(swatch => {
        //   swatch.addEventListener('click', function(event) {
        //     event.preventDefault();
        //     const productItem = event.target.closest('[data-id]');
        //     const productId = productItem.getAttribute('data-id');
        //     const addToCartButton = productItem.querySelector('.cstm__card_button[data-id="' + productId + '"]');
        //     if (addToCartButton) {
        //       addToCartButton.click();
        //     }
        //   });
        // });

        const sizeSwatches = document.querySelectorAll('.cstm__size_collproduct-item-swatch-item');
        sizeSwatches.forEach(swatch => {
          swatch.addEventListener('click', function(event) {
            event.preventDefault();
            sizeSwatches.forEach(item => item.classList.remove('active'));
            let targetElement = event.target;
            if (targetElement.tagName.toLowerCase() === 'a') {
              targetElement = targetElement.closest('.cstm__size_collproduct-item-swatch-item');
            }
            targetElement.classList.add('active');

            const variationId = targetElement.getAttribute('data-variationid');
            const productItem = targetElement.closest('[data-id]');
            const productId = productItem.getAttribute('data-id');

            const addToCartButton = productItem.querySelector('.cstm__card_button');
            console.log("addtocart",addToCartButton,'.cstm__card_button');
            if (addToCartButton) {
              addToCartButton.setAttribute('data-id', variationId);
              if(document.documentElement.clientWidth < 768){
                addToCartButton.click();
              }
            } else {
            }
          });
        });

        return data;
      });

   window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.PRODUCTS_CACHED_RESULTS_RENDERED, function(data) {
        // console.log(data, "<====PRODUCTS_CACHED_RESULTS_RENDERED");

        // Select all the "ADD TO CART" buttons
        const addToCartButtons = document.querySelectorAll('.mobile__cart__icon');
        addToCartButtons.forEach(button => {
          button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
        
            const productItem = event.target.closest('.wizzy-result-product');
            const productId = productItem.getAttribute('data-id');
            const cartCard = productItem.querySelector('.main__cart_card');
        
            if (cartCard) {
              if (cartCard.style.display === 'none' || cartCard.style.display === '') {
                cartCard.style.display = 'block';
              } else {
                cartCard.style.display = 'none';
              }
            }
          });
        });

        // Select all the size swatch elements
        const sizeSwatches = document.querySelectorAll('.cstm__size_collproduct-item-swatch-item');
        sizeSwatches.forEach(swatch => {
          swatch.addEventListener('click', function(event) {
            event.preventDefault();
            sizeSwatches.forEach(item => item.classList.remove('active'));
            let targetElement = event.target;
            if (targetElement.tagName.toLowerCase() === 'a') {
              targetElement = targetElement.closest('.cstm__size_collproduct-item-swatch-item');
            }
            targetElement.classList.add('active');
            const variationId = targetElement.getAttribute('data-variationid');
            const productItem = targetElement.closest('[data-id]');
            const productId = productItem.getAttribute('data-id');
            const addToCartButton = productItem.querySelector('.cstm__card_button[data-id="' + productId + '"]');
            if (addToCartButton) {
              addToCartButton.setAttribute('data-id', variationId);
              if(document.documentElement.clientWidth < 768){
                addToCartButton.click();
              }
            } else {
            }
          });
        });

        return data;
      });




   window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.PRODUCT_SWATCH_CLICKED, function(data) {
        console.log(data, "<====PRODUCT_SWATCH_CLICKED");

        return data;
      });
      
      window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.AFTER_PRODUCTS_TRANSFORMED, function (data) {
        // console.log(data,"AFTER_PRODUCTS_TRANSFORMED");
    
           data.forEach(product => {
              product.new = false;
              product.plusSize = false;
              // product.recycled = false;
              // product.twoToThirteen = false;
              // product.sevenToThirteen = false;
              // product.soldOutTag = false;
              product.similarProducts = false;
              product.handle = "";
              product.attributes.forEach(attribute => {
                if (attribute.id === "product_tags") {
                  //    if (attribute.values.some(value => value.value.includes('Badge1: NEW LAUNCH'))) {
                  //   product.plusTag = true;
                  // } 
                  // attribute.values.forEach(tag => {
                  //     if (tag.value.some(value => value.includes('fresh-arrival'))) {
                  //         product.new = true;
                  //     }
                  // });
                  // attribute.values.forEach(tag => {
                  //     if (tag.value.some(value => value.includes('plus-side'))) {
                  //         product.plusSize = true;
                  //     }
                  // });
                  // attribute.values.forEach(tag => {
                  //     if (tag.value.some(value => value.includes('USP1:RECYCLED'))) {
                  //         product.recycled = true;
                  //     }
                  // });
                  // attribute.values.forEach(tag => {
                  //     if (tag.value.some(value => value.includes('USP1:2-13 Years'))) {
                  //         product.twoToThirteen = true;
                  //     }
                  // });
                  //  attribute.values.forEach(tag => {
                  //     if (tag.value.some(value => value.includes('USP1:7-13 Years'))) {
                  //         product.sevenToThirteen = true;
                  //     }
                  // });
    
                  // if (attribute.values.some(value => value.value.includes('Best-Seller'))) {
                  //   product.preLaunchTag = true;
                  // }
                }
                    // if(attribute.id === "product_similar_product_custom"){
                    //     console.log("wizzy getting true");
                    //     if(attribute.values.length > 0){
                    //           product.similarProducts = true;
                    //     }
                    //   }
                    //   if(attribute.id === "product_handle") {
                    //     product.handle = attribute.valuesAll[0];
                    //   }
                });
            });

            data.forEach((product) => {
                     product.totalVariants = false;
                     if(product.swatches) {
                       if (product.swatches[0]) {
                         if(product.swatches[0].values.length>1){
                           product.totalVariants = true;
                         }else {
                           product.totalVariants = false;
                         }
                       }
                     }
                 } )

          data.forEach((product) => {
            // Check if the last three characters of price are '.00' and remove them if necessary
            if(product.price){
              if (product.price.endsWith('.00')) {
                product.price = product.price.slice(0, -3);
              }
            }
            if(product.sellingPrice) {
              if (product.sellingPrice.endsWith('.00')) {
                product.sellingPrice = product.sellingPrice.slice(0, -3);
              }
            }
            if(product.discount) {
              if (product.discount.endsWith('.00')) {
                product.discount = product.discount.slice(0, -3);
              }
              var discountPrice = product.discount;
              if(discountPrice){
                product.discount = discountPrice.replace(/,/g, '');
              }
            }
        });

        if(data.length == 1){
          document.body.classList.add('wizzy-single-product');
        }else {
          document.body.classList.remove('wizzy-single-product');
        }
       
        return data;    
      });

  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_RENDER_RESULTS, function(data) {
      // console.log(data," <-- BEFORE_RENDER_RESULTS");

    // var facets = data?.response?.payload?.facets;

    // if (facets) {
    //   facets.forEach((facet) => {
    //     if (facet.key === "colors") {
    //       // var facetsData = facet.data;
    //       // facetsData.forEach((facetData) =>{
    //       //   facetData.isURLSwatch = false;
    //       //   if (facetData.data.swatch) {
    //       //     facetData.data.swatch.value = facetData.data.value;
    //       //   }
    //       //   // if (facetData.data.swatch.value.includes("Red")){
    //       //   //   facetData.data.swatch.value = "Red";
    //       //   // }
    //       //   console.log("Wiz->>", facetData.data.swatch.value);
    //       // });
    //     }
    //   });
    // }


    const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL","4XL", "FS","WS"];
    function compareSizes(a, b) {
        if (!isNaN(a.label) && !isNaN(b.label)) {
            return Number(a.label) - Number(b.label);
        }
    
        if (sizeOrder.includes(a.label) && sizeOrder.includes(b.label)) {
            return sizeOrder.indexOf(a.label) - sizeOrder.indexOf(b.label);
        }
    
        if (!isNaN(a.label)) {
            return 1;
        } else {
            return -1;
        }
    }
    const sizesFacet = data.response.payload.facets.find(facet => facet.key === "product_Size");
    if(sizesFacet){
      sizesFacet.data.sort(compareSizes);
    }
    
      return data;
    });
}



////////////////////////////////////////////////////////////////////////////////////

const searchIcon = document.querySelector('.header__icon.header__icon--search');

if (searchIcon) {
  searchIcon.addEventListener('click', function() {
    const searchInput = document.querySelector('.search__input');
      
      setTimeout(function() {
          searchInput.click();
      }, 300);
  });
}

////////////////////////////////////////////////////////////////////////////////////////


function checkScroll() {
  const scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100;

  const body = document.body;

  if (scrollPercentage >= 1) {
    body.classList.add('wizzy-scrolled');
  } else {
    body.classList.remove('wizzy-scrolled');
  }
}

window.addEventListener('scroll', checkScroll);
