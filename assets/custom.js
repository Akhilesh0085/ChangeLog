function initializeSlick() {
  // $(".hoverCard").each(function () {
  //   var $hoverCard = $(this);
  //   var $slider = $hoverCard.find(".imageSlider");
  //   $hoverCard.hover(
  //     function () {
  //       // console.log("Hover in");
  //       if (!$slider.hasClass("slick-initialized")) {
  //         // console.log("Initializing Slick Slider");
  //         $slider.slick({
  //           arrows: false,
  //           slidesToShow: 1,
  //           slidesToScroll: 1,
  //           speed: 400,
  //           dots: true,
  //           infinite: true,
  //           autoplay: true,
  //           autoplaySpeed: 500,
  //           adaptiveHeight: true,
  //         });
  //       }
  //     },
  //     function () {
  //       // console.log("Hover out");
  //       if ($slider.hasClass("slick-initialized")) {
  //         // console.log("Unslicking Slider");
  //         $slider.slick("unslick");
  //       }
  //     }
  //   );
  // });
 
   $('.hoverCard').mouseenter(function() {
        $(this).find('.imageSlider').slick({
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 400,
            dots: true,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 500,
            adaptiveHeight: true,
          });
  });
$('.hoverCard').mouseleave(function() {
 $(this).find('.imageSlider').slick('unslick');
});
  
}


$(document).ready(function () {

    // -------------------Banner Click ----------------------------
    document.querySelectorAll(".full-unstyled-link").forEach((item) => {
        item.addEventListener('click', function() {
         let tgthref =  item.getAttribute("href")
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({'event': 'Banner_Click',
                                'url':tgthref});
            } else {
                console.warn('dataLayer is not defined');
            }
        });
    });
   // -------------------Banner Click End----------------------------

      // -----------------------------Banner Click Bottom Grid-----------------------------
  const springBanner = (eventName,bannerLink)=>{
     dataLayer.push(
       {
        'event': "Banner_Click",
        'url':bannerLink
       });
  }
  const springBannerEl = document.querySelectorAll(".slider-mobile-gutter li");
  for(let i=0;i<springBannerEl.length;i++){
    const item = springBannerEl[i];
    item.addEventListener('click', function() {
      const bannerUrl = item.querySelector('.card-wrapper').href;
      const eventName = "Banner_Click";
      springBanner(eventName,bannerUrl);
    })
  }

// -----------------------------Banner Click Bottom Grid End-----------------------------


  
 // initializeSlick();
 
  // End code for slick slider on collection page for image slider

  $(".cstm_coll .cstm_product_slider2").slick({
    dots: false,
    arrows: true,
    nextArrow:
      '<button type="button" class="slick-next"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
    prevArrow:
      '<button type="button" class="slick-prev"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow"></path></svg></button>',
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "70px",
          swipe: false,
          draggable: false,
          touchMove: false
        },
      },
    ],
  });

  $(".cstm_product_slider").slick({
    dots: false,
    arrows: true,
    nextArrow:
      '<button type="button" class="slick-next"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
    prevArrow:
      '<button type="button" class="slick-prev"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow"></path></svg></button>',
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "120px",
        },
      },
    ],
  });
  // tab section slider
  $(".cstm_tab_product_slider").slick({
    dots: false,
    arrows: true,
    nextArrow:
      '<button type="button" class="slick-next"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
    prevArrow:
      '<button type="button" class="slick-prev"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow"></path></svg></button>',
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: false,
          swipe: false,
        draggable: false,
        touchMove: false
        },
      },
    ],
  });

  if ($(window).width() > 749) {
    /*Desktop Thumbnails*/
    $(".product--no_cstm .thumbnail-list").slick({
      dots: false,
      arrow: true,
      vertical: true,
      nextArrow:
        '<button type="button" class="slick-next"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
      prevArrow:
        '<button type="button" class="slick-prev"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow"></path></svg></button>',
      slidesToShow: 5,
      slidesToScroll: 1,
      focusOnSelect: true,
      infinite: true,
      watchCss: true,
      asNavFor: ".product--no_cstm .product__media-list",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    });
    $(".product--no_cstm .product__media-list").slick({
      dots: false,
      arrow: true,
      nextArrow:
        '<button type="button" class="slick-next"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
      prevArrow:
        '<button type="button" class="slick-prev"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow"></path></svg></button>',
      slidesToShow: 1,
      slidesToScroll: 1,
      focusOnSelect: true,
      asNavFor: ".product--no_cstm .thumbnail-list",
    });

    /*End Desktop Thumbnails*/
  }

  // new in slider css here
  if ($(window).width() < 749) {
    var style = $('<style id="dynamicStyle"></style>');
    var cssRule =
      ".cstm_coll .cstm_product_slider2 .slick-slide.slick-center { transform: scale(1.1) !important; }";
    style.text(cssRule);
    $("head").append(style);
    $(".cstm_coll .cstm_product_slider2 .cstm_quick_icon").on(
      "click",
      function () {
        $("#dynamicStyle").remove();
      }
    );
  }


$(".size_name").click(function(){
if(!$(this).hasClass('active')){
if($(this).hasClass('in_size_table')){
  $('.size-changetd').each(function(){
    var innerTxt = parseFloat($(this).text().trim());
    var multiVal = innerTxt/2.54;
    $(this).text(parseFloat(multiVal).toFixed(1));
  })
}else{
   console.log('sssss');
  $('.size-changetd').each(function(){
    var innerTxt = parseFloat($(this).text().trim());
    var multiVal = 2.54*innerTxt;
    $(this).text(parseFloat(multiVal).toFixed(1));
  })
}
  $(".size_name").removeClass('active');
$(this).addClass('active');
}
});


  
  
});





  // if ($(window).width() < 749) {
  //   $(".product__media-list").slick({
  //     dots: false,
  //     arrow: true,
  //     vertical: true,
  //     nextArrow:
  //       '<button type="button" class="slick-next"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
  //     prevArrow:
  //       '<button type="button" class="slick-prev"><svg viewBox="0 0 100 100"><path d="M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z" class="arrow"></path></svg></button>',
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     focusOnSelect: true,
  //     infinite: true,
  //     watchCss: true,
  //   });
  // };


// Size chart in and cm hide show code here
// Display the first div and set the first button as active by default
// document.addEventListener("DOMContentLoaded", function () {
//   var button1 = document.getElementById("button1");
//   var button2 = document.getElementById("button2");
//   if (button1) {
//     button1.classList.add("active");
//   }
//   if (button2) {
//     button2.classList.remove("active");
//   }
//   showDiv("myDIV");
// });

// function showDiv(divId) {
//   // Hide all divs
//   var divs = document.querySelectorAll(".myDiv");
//   divs.forEach(function (div) {
//     div.style.display = "none";
//   });

//   // Show the selected div
//   var selectedDiv = document.getElementById(divId);
//   if (selectedDiv) {
//     selectedDiv.style.display = "block";
//   }

//   // Remove active class from all buttons
//   var button1 = document.getElementById("button1");
//   var button2 = document.getElementById("button2");

//   if (button1) {
//     button1.classList.toggle("active", divId === "myDIV");
//   }
//   if (button2) {
//     button2.classList.toggle("active", divId === "myDIV2");
//   }
// }








