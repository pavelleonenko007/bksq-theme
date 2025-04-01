
<?php wp_footer(); ?>
<script type="text/javascript"
  src="<?php echo get_template_directory_uri() ?>/js/main.js?ver=1736940039"></script>
<script type="text/javascript"
  src="<?php echo get_template_directory_uri() ?>/js/front.js?ver=1736940039"></script>
<?php if(file_exists(dirname( __FILE__ ).'/mailer.php') && !function_exists("wtw_forms_extentions")){ include_once 'mailer.php'; } ?>
<?php if(function_exists('get_field')) { echo get_field('footer_code', 'option'); } ?>
<?php if(file_exists(dirname( __FILE__ ).'/footer_code.php')){ include_once 'footer_code.php'; } ?>
<script type="text/javascript"
  src="<?php echo get_template_directory_uri() ?>/js/shop.js?ver=1736940039"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js"></script><script src="https://thevogne.ru/clients/creativepeople/bsqr/lenis.js"></script><script src="https://thevogne.ru/clients/creativepeople/bsqr/swiper.js"></script><script src="https://thevogne.ru/clients/creativepeople/bsqr/script.js"></script><script>
$(document).ready(function(){
  
  
  $( "#accept" ).on( "click", function() {
   Cookies.set('alert', true, { expires: 365 });
} );
  
  
	if (!Cookies.get('alert')) { 
	  $('.popup-overlay').show(); 
 	 
	}
});
		</script><script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"></script><script>
const swiperTg = new Swiper(".swiper-tg", {
  // Optional parameters
  direction: "horizontal",
  loop: false,
  slidesPerView: 1,
  slidesPerGroup: 1,
  freeMode: true,
  mousewheel: true,

  loop: true,
  grabCursor: true,
  centeredSlides: false,
  mousewheel: {
    forceToAxis: true
  },
  speed: 300,
  // Responsive breakpoints
   breakpoints: {
			0: { /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 1,
         slidesPerGroup:1,
       
      },
     480: { /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 1,
         slidesPerGroup:1,
      
      },
    // when window width is >= 768px
    768: {
      slidesPerView: 1
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 1
    }
  },
});

const swiper2 = new Swiper(".swiper-numbers", {
	navigation: {
        nextEl: ".number-next",
        prevEl: ".number-prev",
      },
  // Optional parameters
  direction: "horizontal",
  loop: false,
  grabCursor: true,
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 20,
  loop: true,
  centeredSlides: true,
  
  mousewheel: {
    forceToAxis: true
  },
  speed: 300,
  autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        
  // Responsive breakpoints
  breakpoints: {
	0: { /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 3,
         slidesPerGroup:1,
       
      },
     480: { /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 3,
         slidesPerGroup:1,
      
      },
    // when window width is >= 768px
    768: {
      slidesPerView: 3
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
      spaceBetween: 60
    }
  },
});
		</script>