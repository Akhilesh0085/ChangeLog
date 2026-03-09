// cartpage coupon poupop code here
document.addEventListener("DOMContentLoaded", function() {
  if (typeof jQuery !== "undefined") {
//$(document).ready(function(){  
  $('body').on('click', '.coupon-popup', function(){
     $(".discount_outler, .discount_box_container").show();
     $('.loader_gif').hide();
    }); 
  $(".close_btn").click(function(){
   $(".discount_outler").hide();
  });
  $('body').on('click', '#applycoupon', function(){
    var couponCode = $("#coupon_code").val();
     if(couponCode === "") {
        $(".error_message").text("Validation error");      
    } 
    else {
          $('.discount_box_container').hide();
    $('.loader_gif').show();
        $(".error_message").text("");
        applyDiscount(couponCode);
    }
    
});
   $('body').on('click','.remove-coupon',function(){
      $('.discount_outler, .loader_gif').show();
     $('.discount_box_container').hide();
   applyDiscount('coupons');
   });

    function  applyDiscount(val){
   // let shopUrl =  window.location.href.split("/cart")[0];
    let discountApplyUrl = "/discount/"+val;
    fetch(discountApplyUrl)
    .then(function(response) {
      console.log(response);
    if (!response.ok) {
    throw new Error('Failed to apply discount');
    }
    return response.text();
    })
    .then(function(data) {
     fetch(`${window.location.pathname}`)
.then((responsecart) => responsecart.text())
.then((datacart) => {
 var inhtml = new DOMParser().parseFromString(datacart, 'text/html').querySelector('cart-items').innerHTML;
document.querySelector('cart-items').innerHTML = inhtml;
  $(".discount_outler").hide();
});
    })
    .catch(function(error) {
    throw error;
    });
  }
}
});