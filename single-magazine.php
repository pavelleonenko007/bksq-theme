<?php
/*
Template name: Журнал BKSQ №1(11) «Новая география»
*/
?>
    <!DOCTYPE html>
<html data-wf-page="6704f17061cf6aa78bd63b25" data-wf-site="6704f17061cf6aa78bd63b0e">
	<?php get_template_part("header_block", ""); ?>
	<body class="body magazine-body wpsite">
		<?php if(function_exists('get_field')) { echo get_field('body_code', 'option'); } ?>
		
		<div class="css w-embed">
			<style>



*[ww-cms="pageimg"],
*[data-acf],
*[data-wp],
*[data-acf-link],
*[data-acf-image],
*[data-acf-bg-image],
*[data-acf-file],
*[data-acf-lightbox-video],
*[data-wp-terms],
*[data-wp-term],
*[data-acf-repeater],
*[data-acf-flexible],
*[data-acf-layout],
*[data-wp],
*[data-menu-item],
*[data-template-part]{
	outline: solid 2px #ff00f7;
}

html{font-size:calc(100vw / 1340)}

.preloader-fugure {
  animation: loadcube 5s ease-out infinite;
  will-change: transform;
  
}

.ms6-link-wrap a:nth-last-child(1) .btns{display:none}

.ms6-link-wrap a:nth-last-child(1){padding-bottom:0}

.preloader-fugure {
    transform-style: preserve-3d;
}

  
  @keyframes loadcube {
  0% { transform: rotateY(0deg) translateZ(0) }
  15% { transform: rotateY(-90deg) translateZ(0) }
  25% { transform: rotateY(-90deg) translateZ(0) }
  35% { transform: rotateY(-180deg) translateZ(0) }
  50% { transform: rotateY(-180deg) translateZ(0) }
  60% { transform: rotateY(-270deg) translateZ(0) }
  75% { transform: rotateY(-270deg) translateZ(0) }
  85% { transform: rotateY(-360deg) translateZ(0) }
  100% { transform: rotateY(-360deg) translateZ(0) }
}


body .cursor-holder {
  opacity: 0;
}
body:hover .cursor-holder {
  opacity: 1;
}
a{color:inherit;}
.underlined-link:hover {
  border-color: rgba(0, 0, 0, 0);
}
.underlined-link:hover > .outline-on-hover {
  background-color: rgba(0, 0, 0, 0);
}
@media (min-width: 1440px) {
 html{font-size:calc(100vw / 1600)}
}
@media (min-width: 1920px) {
 html{font-size:calc(100vw / 1900)}
}
@media (max-width: 991px) {
  html{font-size:calc(100vw / 768)}
}
@media (max-width: 479px) {
  html{font-size:calc(100vw / 375)}
}

.form-drop-toggle-content .text-24 {
    letter-spacing: -.01em;
    font-size: 24rem;
    line-height: 120%;
    max-width: 100%;
    white-space: pre-line;
}

.splide__slide.is-active .wp-slide-card-image {
    height: 618rem;
}

@media screen and (max-width:1600px){


.projects-slider .splide__track {
    width: calc(820rem + 20rem);
}

.splide__slide .wp-slide-card-image {
    height: 412rem;
}

.splide__slide.is-active .wp-slide-card-image {
    height: 520rem;
}
}


@media screen and (max-width:1340px){


.projects-slider .splide__track {
    width: calc(620rem + 20rem);
}

.splide__slide .wp-slide-card-image {
    height: 345rem;
}

.splide__slide.is-active .wp-slide-card-image {
    height: 430rem;
}
}


@media screen and (max-width:992px){

.projects-slider .splide__track {
        width: 90vw;
    }

.splide__slide .wp-slide-card-image {
    height: 480rem;
}

.splide__slide.is-active .wp-slide-card-image {
    height: 480rem;
}
}

@media screen and (max-width:495px){

.mag-image-box {
    flex: 0;
    width: auto;
    display: flex;
}

.mag-popup-inner {
        justify-content: flex-start;
        align-items: flex-start;
    }
    
        .close-popup.mag-close-popup {
        left: auto;
        right: 12rem;
    }
    
    .mag-image-row {
    grid-column-gap: 16rem;
    grid-row-gap: 16rem;
    flex: 1;
    height: 71.75vh;
    padding-bottom: 20rem;
    padding-left: 24rem;
    padding-right: 24rem;
    display: flex;
    overflow: auto;
    width: 100%;
}

.mag-image-box img {
    object-fit: inherit !important;
    width: auto;
    /* display: block; */
    height: auto;
}

.splide__slide .wp-slide-card-image {
    height: 237rem;
}

.splide__slide.is-active .wp-slide-card-image {
    height: 237rem;
}


.mag-image-box {
    flex: 0 !important;
    width: auto;
    display: flex;
}

    .mag-image-box img {
        object-fit: fill;
        width: auto !important;
        }
        
     
.mag-image-box{ flex-shrink: 0 !important;
    
}

}

.popup__header::after {
  
    flex: none !important;
}




.team-tabs-menu::-webkit-scrollbar {
height:auto;
width:3px
}

.team-tabs-menu::-webkit-scrollbar-track {
background:transparent
}

.team-tabs-menu::-webkit-scrollbar-thumb {
background-color:black;
border-radius:0;
border:0 solid black
}

.mag-image-box {flex: none;
    width: auto;
    display: flex;}

.mag-image-box img{object-fit: fill;
    width: 100%;
    /* display: block; */
    height: auto;}
    
    
.magazine-body .nav-top, 
.magazine-body .nav-bottom{
   
    mix-blend-mode: normal !important;
    filter: contrast(1) !important;
    color: black !important;
}

.button-wrap.show-more.scrollobs{display:none !important;}

@media screen and (max-width:495px){
   .mag-image-box img {
    object-fit: fill !important;
    width: 100%;
    display: block;
    height: auto;
    flex: 0 !important;
    
        flex-shrink: 0 !important;
        
        height: 61.75svh;
    
}
}

.startloaded .load-image{width:958rem}

.startloaded .load-black{opacity:0}

@media screen and (max-width:992px){

.load-image{width:294rem}
.startloaded .load-image{width:670rem}

}

@media screen and (max-width:495px){

.load-image{width:205rem}
.startloaded .load-image{width:350rem;}

}
			
			</style>
			   <div class="w-embed">
            <style>
               :root {
               --maincolor: <?php the_field( 'cvet' ); ?>;
               }
               :root {
               --magazine-1:  <?php the_field( 'cvet' ); ?>;
               }
               .switcher__checkbox:checked+.switcher__label,
               .custom-select__option--value{
               background-color: var(--maincolor);
               }
               .popup__link:hover{color:var(--maincolor);}
               .popup__link:hover:before{background-color:var(--maincolor);}
            </style>
         </div>
		</div>
		
	 <div class="page-wrap">
         <div class="main-wrap">
            <section class="section magazine-hero-section is-yellow-bg">
               <div class="container">
                  <div class="hero-content magazine-hero-content">
                     <div class="magazine-hero-caption">
                        <div class="text-18 mob-18 fls">
                           <div class="text-18 mob-18">BKSQ №<span><?php echo get_field( 'mag_num', false ); ?></span>     </div>
                           <h1 class="text-18 mob-18 h1-mag"><span><?php the_title(); ?></span></h1>
                        </div>
                     </div>
                     <div class="mag1-hero-heading">
                        <div class="h1 magazine-h1"><?php echo get_field( 'bigtext', false ); ?></div>
                        <div class="mag-hero-quote-detail">
                           <div class="mag-hero-line"></div>
                           <div class="text-24 _16-tab"><?php echo get_field( 'autorname', false ); ?></div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section magazine-s2-section">
               <div class="container">
                  <div class="content-block magazine-s2-content-block">
                   <div class="magazine-s2-left-col scrollobs visible">
                        <div class="gap-8 magazine-s2-text-box">
                           <?php if ( ! empty( get_field( 'release_date_top', false ) ) ) : ?>
                           <p class="text-16 is-opacity-60 _14-tab"><?php echo get_field( 'release_date_top', false ); ?></p>
                           <?php endif; ?>
                           <p class="text-16 _14-tab"><?php echo get_field( 'release_date', false ); ?></p>
                        </div>
                        <div class="gap-8 magazine-s2-text-box">
                           <?php if ( ! empty( get_field( 'polotnost_top', false ) ) ) : ?>
                           <p class="text-16 is-opacity-60 _14-tab"><?php echo get_field( 'polotnost_top', false ); ?></p>
                           <?php endif; ?>
                           <p class="text-16 _14-tab"><?php echo get_field( 'polotnost', false ); ?></p>
                        </div>
                        <div class="gap-8 magazine-s2-text-box">
                           <?php if ( ! empty( get_field( 'ves_top', false ) ) ) : ?>
                           <p class="text-16 is-opacity-60 _14-tab"><?php echo get_field( 'ves_top', false ); ?></p>
                           <?php endif; ?>
                           <p class="text-16 _14-tab"><?php echo get_field( 'ves', false ); ?></p>
                        </div>
                        <div class="gap-8 magazine-s2-text-box">
                           <?php if ( ! empty( get_field( 'format_top', false ) ) ) : ?>
                           <p class="text-16 is-opacity-60 _14-tab"><?php echo get_field( 'format_top', false ); ?></p>
                           <?php endif; ?>
                           <p class="text-16 _14-tab"><?php echo get_field( 'format', false ); ?></p>
                        </div>
                        <div class="button-wrap magazine-s2-left-button-wrap">
                           <a href="#tochki-prodazh" class="dot-link magazine-button w-inline-block">
                              <div class="text-16">Точки продаж</div>
                           </a>
                           <div class="button-wrap n-mob">
                              <a href="#tizer" class="dot-link underlined-link w-inline-block">
                                 <div class="text-18">Превью номера</div>
                                 <img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt="" class="image">
                              </a>
                           </div>
                        </div>
                     </div>
                     <div class="magazine-s2-image-column containerer"><img class="image-contain image-cover" src="<?php the_post_thumbnail_url(); ?>" alt="" loading="lazy"></div>
                     <div class="magazine-s2-right-col scrollobs">
                        <p class="text-neue-44">BKSQ №<span><?php echo get_field( 'mag_num', false ); ?></span></p>
                        <p class="text-16 _14-tab"><?php echo get_field( 'opisanie_mag', false ); ?></p>
                        <div class="button-wrap hidden-tab">
                           <a href="#tizer" class="dot-link underlined-link w-inline-block w--current">
                              <?php if ( ! empty( get_field( 'prev_mm', false ) ) ) : ?>
                              <div class="text-18"><?php echo get_field( 'prev_mm', false ); ?></div>
                              <?php endif; ?><img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt="" class="image">
                           </a>
                        </div>
                        <div class="button-wrap magazine-s2-right-button-wrap">
                           <a href="#" class="dot-link magazine-button w-inline-block">
                              <div class="text-16">Точки продаж</div>
                           </a>
                           <div class="button-wrap">
                              <a href="#" class="dot-link underlined-link w-inline-block">
                                 <div class="text-18">Превью номера</div>
                                 <img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt="" class="image">
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section magazine-s3-section">
               <div class="container">
                  <div class="heading-wrap mag1-s3-heading-wrap">
                     <h2 class="h1 magazine-h1 scrollobs"><?php echo get_field( 'citata_Mag', false ); ?></h2>
                     <div class="magazine-s3-quote-info-box mag1-s3-quote-info-box scrollobs">
                        <div class="ms3-info-line"></div>
                        <div class="ms-info-text-box">
                           <div class="text-24 _16-tab"><?php echo get_field( 'citata___imya_i_familiya', false ); ?></div>
                           <div class="text-18 is-opacity-60 _14-tab"><?php echo get_field( 'citata___gde_byla_citata', false ); ?></div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section id="tizer" class="section magazine-s4-section">
               <div class="container">
                  <div class="content-block ms4-content-block">
                     <div class="ms4-left">
                        <div class="ms-4-left-top scrollobs">
                           <div class="mag-s4-capture">
                              <p class="text-16 _14-tab"><?php echo get_field( 'otryvok_1___stranicy', false ); ?></p>
                              <p class="text-16 _14-tab capture-text"><?php echo get_field( 'otryvok_1_-_gtw', false ); ?></p>
                           </div>
                           <div class="heading-wrap ms4-heading-wrap">
                              <h2 class="h2"><?php echo get_field( 'otryvok_1___zagolovok', false ); ?></h2>
                           </div>
                        </div>
                        <div class="ms-4-left-bottom scrollobs">
                           <div class="ms4-text-grid">
                              <div class="text-16 _14-tab"><?php echo get_field( 'otryvok_1___tekst_sleva', false ); ?></div>
                              <div id="w-node-_95efbdf8-9de4-0953-a3fa-65e655080c1e-8bd63b25" class="text-16 _14-tab"><?php echo get_field( 'otryvok_1___tekst_sprava', false ); ?></div>
                           </div>
                           <div class="text-14 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_1___tekst_vnizu', false ); ?></div>
                        </div>
                     </div>
                     <div class="ms4-right scrollobs">
                        <div class="ms4-image-box cursor-hover"><img class="ms4-image" src="<?php echo get_field( 'otryvok_1___prevyu_izobrazhenie', false ); ?>" alt="" loading="lazy"></div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section magazine-s5-section">
               <div class="container">
                  <div class="content-block ms5-content-block">
                     <div class="ms5-box cursor-hover scrollobs">
                        <?php if ( have_rows( 'otryvok_2___izobrazheniya', false ) ) : ?>
                        <div class="ms5-image-row">
                           <?php while ( have_rows( 'otryvok_2___izobrazheniya', false ) ) : the_row(); ?>
                           <div class="ms5-image ms5-image-double"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                        <div class="ms5-box-bottom">
                           <div class="ms5-box-bottom-left mw-278">
                              <p class="text-16 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_2_-_gtw', false ); ?></p>
                              <p class="text-16"><?php echo get_field( 'otryvok_2___opisanie', false ); ?></p>
                           </div>
                           <div class="ms5-box-bottom-right">
                              <p class="text-16 _14-tab _2"><?php echo get_field( 'otryvok_2___stranicy', false ); ?></p>
                           </div>
                        </div>
                     </div>
                     <div class="ms5-box cursor-hover scrollobs">
                        <?php if ( have_rows( 'otryvok_3___izobrazheniya', false ) ) : ?>
                        <div class="ms5-image-row">
                           <?php while ( have_rows( 'otryvok_3___izobrazheniya', false ) ) : the_row(); ?>
                           <div class="ms5-image ms5-image-double"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                        <div class="ms5-box-bottom">
                           <div class="ms5-box-bottom-left mw-278">
                              <p class="text-16 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_3_-_gtw', false ); ?></p>
                              <p class="text-16"><?php echo get_field( 'otryvok_3___opisanie', false ); ?></p>
                           </div>
                           <div class="ms5-box-bottom-right">
                              <p class="text-16 _14-tab _2"><?php echo get_field( 'otryvok_3___stranicy', false ); ?></p>
                           </div>
                        </div>
                     </div>
                     <div class="ms5-box cursor-hover scrollobs">
                        <?php if ( have_rows( 'otryvok_4___izobrazheniya', false ) ) : ?>
                        <div class="ms5-image-row">
                           <?php while ( have_rows( 'otryvok_4___izobrazheniya', false ) ) : the_row(); ?>
                           <div class="ms5-image ms5-image-double"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                        <div class="ms5-box-bottom">
                           <div class="ms5-box-bottom-left mw-278">
                              <p class="text-16 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_4_-_gtw', false ); ?></p>
                              <p class="text-16"><?php echo get_field( 'otryvok_4___opisanie', false ); ?></p>
                           </div>
                           <div class="ms5-box-bottom-right">
                              <p class="text-16 _14-tab _2"><?php echo get_field( 'otryvok_4___stranicy', false ); ?></p>
                           </div>
                        </div>
                     </div>
                     <div class="ms5-box cursor-hover scrollobs">
                        <?php if ( have_rows( 'otryvok_5___izobrazheniya', false ) ) : ?>
                        <div class="ms5-image-row">
                           <?php while ( have_rows( 'otryvok_5___izobrazheniya', false ) ) : the_row(); ?>
                           <div class="ms5-image ms5-image-double"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                        <div class="ms5-box-bottom">
                           <div class="ms5-box-bottom-left mw-278">
                              <p class="text-16 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_5_-_gtw', false ); ?></p>
                              <p class="text-16"><?php echo get_field( 'otryvok_5___opisanie', false ); ?></p>
                           </div>
                           <div class="ms5-box-bottom-right">
                              <p class="text-16 _14-tab _2"><?php echo get_field( 'otryvok_5___stranicy', false ); ?></p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section">
               <div class="vimeo-cursor-hover">
                  <div data-w-id="3b21dbcf-607c-b553-4500-0e2ad8e6b99e" class="container full-width-container">
                     <div class="mag-video">
                        <div class="background-video w-background-video w-background-video-atom" data-autoplay="true" data-loop="true" data-wf-ignore="true" >
                           <video id="dc4b5437-e5bc-a8b2-5ccb-24a08add721f-video" autoplay muted  loop=""  playsinline="" data-wf-ignore="true" data-object-fit="cover">
                           <source src="<?php echo get_field( 'bgvideo', false ); ?>" data-wf-ignore="true">
                           </video>
                        </div>
                     </div>
                     <?php $link = get_field( 'linkonvideo', false );
                        if ( ! empty( $link ) ) :
                        			$url = $link['url'];
                        			$title = $link['title'];
                        			$target = $link['target'] ? $link['target'] : '_self'; 
                        		?>
                     <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="_blank" class="video-block abst w-inline-block" style="transform: translate3d(0px, 0px, 0px) scale3d(0.7, 0.7, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                  </div>
               </div>
            </section>
            <section id="tochki-prodazh" class="section magazine-s6-section is-yellow-bg">
               <div class="container">
                  <div class="heading-wrap ms6-heading-wrap scrollobs">
                     <?php if ( ! empty( get_field( 'rozntochki', false ) ) ) : ?>
                     <h2 class="h1"><?php echo get_field( 'rozntochki', false ); ?></h2>
                     <?php endif; ?>
                  </div>
                  <div class="content-block mag-map-content-block scrollobs">
                     <div class="w-embed w-script">
                        <section class="map-section">
                           <div class="map-section__wrapper">
                              <script>
                                 window.locations = [
                                      
                                      <?php 
                                    if( have_rows('karta_tochki_prodazh') ):
                                    while ( have_rows('karta_tochki_prodazh') ) : the_row(); ?>
                                       
                                         {
                                 coordinates: [ <?php echo get_sub_field('dolgota_i_shirota') ?> ],
                                 iconSrc: '/assets/marker.svg',
                                 title: <?php echo ! empty(get_sub_field('nazvanie')) ? "'" . get_sub_field('nazvanie') . "'" : '""' ?>,
                                 address: <?php echo ! empty(get_sub_field('adress')) ? "'" . get_sub_field('adress') . "'" : '""' ?>,
                                 city: <?php echo ! empty(get_sub_field('city')) ? "'" . get_sub_field('city') . "'" : '""' ?>,
                                 additionalInfo: <?php echo ! empty(get_sub_field('additionalInfo')) ? "'" . get_sub_field('additionalInfo') . "'" : '""' ?>,
                                 linkToShop: <?php echo ! empty(get_sub_field('link')) ? "'" . get_sub_field('link')['url'] . "'" : '""' ?>,
                                 categories: <?php echo ! empty(get_sub_field('kategorii')) ? json_encode(get_sub_field('kategorii'), JSON_UNESCAPED_UNICODE) : '[]'; ?>,
                                 },
                                        
                                        <?php endwhile;
                                    endif; ?>
                                      
                                      
                                 
                                 ];
                              </script>
                              <form class="filter-form">
                                 <select name="city" data-custom="select"></select>
                                 <div class="switcher">
                                    <input type="radio" name="switcher" id="switcher1" class="switcher__checkbox sr-only" value="Где купить" checked="">
                                    <label for="switcher1" class="switcher__label">Где купить</label>
                                    <input type="radio" name="switcher" id="switcher2" class="switcher__checkbox sr-only" value="Где почитать">
                                    <label for="switcher2" class="switcher__label">Где почитать</label>
                                 </div>
                              </form>
                              <div id="map" class="map">
                               
                              </div>
                           </div>
                        </section>
                     </div>
                  </div>
                  <div class="content-block magazine-s6-content-block scrollobs visible">
                     <div class="ms6-left">
                        <?php if ( ! empty( get_field( 'tekst_pod_kartoj', false ) ) ) : ?>
                        <div class="text-18 mob-18"><?php echo get_field( 'tekst_pod_kartoj', false ); ?></div>
                        <?php endif; ?>
                     </div>
                     <div class="ms6-right">
                        <?php if ( have_rows( 'tochki_prodazh_pod_kartoj', false ) ) : ?>
                        <div class="ms6-link-wrap">
                           <?php while ( have_rows( 'tochki_prodazh_pod_kartoj', false ) ) : the_row(); ?>
                           <div class="div-block-9">
                              <div class="ms6-arrow-link">
                                 <?php if ( ! empty( get_sub_field( 'nazvanie_magazina' ) ) ) : ?>
                                 <div class="text-neue-44 h-90"><?php echo get_sub_field( 'nazvanie_magazina' ); ?></div>
                                 <?php endif; ?>
                                 <div class="ms6-link-arrow">
                                    <div class="svg w-embed">
                                       <svg width="100%" style="" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6522 1.20666L14.7378 1.12109L20.5213 1.12109L32.0005 12.6003V19.1164L20.5221 30.5948H14.7369L14.6522 30.5101L27.1981 17.9643L0 17.9643V13.7537L27.1993 13.7537L14.6522 1.20666Z" fill="currentColor"></path>
                                       </svg>
                                    </div>
                                 </div>
                                 <div class="ms6-link-divider btns"></div>
                              </div>
                              <?php $link = get_sub_field( 'link' );
                                 if ( ! empty( $link ) ) :
                                 			$url = $link['url'];
                                 			$title = $link['title'];
                                 			$target = $link['target'] ? $link['target'] : '_self'; 
                                 		?>
                              <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="ms6-arrow-link abs w-inline-block"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                           </div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                        <div class="button-wrap">
                           <a href="#" class="dot-link underlined-link viewallpop w-inline-block"  data-lenis-stop>
                              <div class="text-18">Посмотреть все</div>
                              <img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt="" class="image">
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section magazine-s7-section" id="toform">
               <div class="container">
                   <div class="heading-wrap s2-heading-wrap scrollobs visible">
                     <?php if ( ! empty( get_field( 'h2corppok', false ) ) ) : ?>
                     <h2 class="h1"><?php echo get_field( 'h2corppok', false ); ?></h2>
                     <?php endif; ?>
                  </div>
                  <div class="content-block ms7-content-block scrollobs visible">
                     <div class="ms7-left">
                        <?php if ( ! empty( get_field( 'tekst_v_formah_pokupki', 'option' ) ) ) : ?>
                        <div class="text-16 _14-tab x1920-18"><?php echo get_field( 'tekst_v_formah_pokupki', 'option' ); ?></div>
                        <?php endif; ?><a href="<?php echo esc_url( 'mailto:' . get_field('email_opc', 'option')); ?>" class="text-18 is-link"><?php if ( ! empty( get_field( 'email_opc', 'option' ) ) ) : ?><span><?php echo get_field( 'email_opc', 'option' ); ?></span><?php endif; ?></a>
                     </div>
                     <div class="ms7-right">
                        <div class="form-block w-form">
                           <div class="w-embed w-script">
                              <!-- Replace native Submit Button with Custom one -->
                              <script>
                                 document.addEventListener('DOMContentLoaded', function (scriptTag) {
                                   return function () {
                                     const form = scriptTag.parentNode.parentNode.querySelector("form");
                                     const submitBtn = form.querySelector('input[type="submit"]');
                                     let btnsGroup = submitBtn.parentNode;
                                     if (btnsGroup.children.length === 2) {
                                       let submitText = submitBtn.dataset.wait;
                                       let newSubmitBtn = btnsGroup.querySelector('a');
                                       submitBtn.style.display = 'none';
                                       newSubmitBtn.addEventListener('click', (e) => {
                                         e.preventDefault();
                                         submitBtn.click();
                                       })
                                 
                                       form.addEventListener("submit", function () {
                                         newSubmitBtn.textContent = submitText;
                                       });
                                     }
                                   }
                                 }(document.scripts[document.scripts.length - 1]));
                              </script>
                           </div>
                           <form id="email-form" name="email-form" data-name="Email Form" method="get" class="mag-form" data-wf-page-id="6704f17061cf6aa78bd63b25" data-wf-element-id="6a14147e-1e8e-b3b2-4328-9af66c98669c" aria-label="Email Form" novalidate="true">
                              <div class="form-field-wrap"><label for="name-2" class="field-label">Имя</label><input class="text-field w-input" maxlength="256" name="field" data-name="Имя" placeholder="" type="text" id="name"></div>
                              <div id="w-node-_6a14147e-1e8e-b3b2-4328-9af66c9866a1-8bd63b25" class="form-field-wrap"><label for="phone-2" class="field-label">Tелефон</label><input class="text-field w-input" maxlength="256" name="field" data-name="Телефон" placeholder="" type="tel" id="phone" required=""></div>
                              <div id="w-node-_6a14147e-1e8e-b3b2-4328-9af66c9866a5-8bd63b25" class="form-field-wrap"><label for="email-3" class="field-label">Email</label><input class="text-field w-input" maxlength="256" name="email-2" data-name="Email 2" placeholder="" type="email" id="email-2" required=""></div>
                              <div id="w-node-_6a14147e-1e8e-b3b2-4328-9af66c9866a9-8bd63b25" class="form-field-wrap">
                                 <label for="releases" class="field-label">Выпуски</label>
                                 <div class="w-embed">
                                    <select id="releases" name="releases" data-name="releases" required="" multiple="" class="hidden-select w-select" style="display: none;">
                                      <?php
// Получаем текущий заголовок страницы
$current_page_title = get_the_title();

// Создаем новый объект WP_Query для получения записей кастомного типа поста
$args = array(
    'post_type'      => 'magazine', // Название вашего кастомного типа поста
    'posts_per_page' => 10          // Ограничиваем количество записей до 10
);
$query = new WP_Query($args);
if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        $mag_num = get_field('mag_num'); // Получение значения кастомного поля
        $title = get_the_title();        // Получение заголовка записи

        // Проверяем, совпадает ли заголовок записи с текущим заголовком страницы
        $is_selected = ($title === $current_page_title) ? ' selected' : ''; // Добавляем пробел перед словом "selected"
        
        // Выводим опции
        echo '<option value="' . esc_attr("№{$mag_num} {$title}") . '"' . $is_selected . '>№' . esc_attr($mag_num) . ' ' . esc_attr($title) . '</option>';
    }
    wp_reset_postdata(); // Сбрасываем глобальные переменные после использования WP_Query
} else {
    echo '<option value="Записи не найдены.">Записи не найдены.</option>';
}
?>
                                    </select>
                                 </div>
                                 <div data-hover="false" data-delay="0" class="form-dropdown w-dropdown">
                                    <div class="form-dropdown-toggle w-dropdown-toggle" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                       <div class="form-drop-toggle-content">
                                          <div class="text-24 is-drop-placeholder"></div>
                                          <div class="form-drop-toggle-icon" style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                                             <div class="svg w-embed">
                                                <svg width="100%" style="" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                   <path d="M10 0L10 10L-4.37114e-07 10L10 0Z" fill="currentColor"></path>
                                                </svg>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <nav class="form-drop-list w-dropdown-list" style="height: 0px; display: none;" id="w-dropdown-list-0" aria-labelledby="w-dropdown-toggle-0">
                                       <div class="form-drop-list-content w-embed">
                                        <?php
$current_page_title = get_the_title(); // Получаем текущий заголовок страницы

// Создаем новый объект WP_Query для получения записей кастомного типа поста
$args = array(
    'post_type'      => 'magazine', // Название вашего кастомного типа поста
    'posts_per_page' => 10          // Ограничиваем количество записей до 10
);
$query = new WP_Query($args);
if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        $mag_num = get_field('mag_num'); // Получение значения кастомного поля
        $title = get_the_title();        // Получение заголовка записи
        // Проверяем, совпадает ли заголовок записи с текущим заголовком страницы
        $is_selected = ($title === $current_page_title) ? 'selected' : '';
        // Выводим опции
        echo '
        <div class="form-drop-link">
            <div class="text-18 minw-36">№' . esc_attr($mag_num) . ' ' . esc_attr($title) . '</div>
        </div>
        ';
    }
    wp_reset_postdata(); // Сбрасываем глобальные переменные после использования WP_Query
} else {
    echo '
    <div class="error-message">Записи не найдены.</div>
    ';
}
?>
                                       </div>
                                    </nav>
                                 </div>
                              </div>
                              <div id="w-node-_6a14147e-1e8e-b3b2-4328-9af66c9866bf-8bd63b25" class="form-field-wrap numeric"><label for="quantity" class="field-label">Кол-во экземпляров</label><input class="text-field num w-input" maxlength="256" name="field" data-name="Кол-во экземпляров" pattern="[0-9]*" placeholder="" type="number" id="quantity"></div>
                              <div id="w-node-_6a14147e-1e8e-b3b2-4328-9af66c9866c3-8bd63b25" class="form-field-wrap"><label for="comment" class="field-label">Комментарий</label><textarea class="text-area w-input" data-lenis-prevent="" maxlength="5000" name="field" data-name="Комментарий" placeholder="" id="comment"></textarea></div>
                              <div id="w-node-_6a14147e-1e8e-b3b2-4328-9af66c9866c7-8bd63b25" class="form-field-wrap">
                                 <label class="w-checkbox checkbox-field">
                                    <div class="w-checkbox-input w-checkbox-input--inputType-custom checkbox"></div>
                                    <input type="checkbox" name="" id="policy" data-name="Политика" required="" style="opacity:0;position:absolute;z-index:-1"><span class="text-16 policy-label w-form-label">Нажимая кнопку "Оставить заявку", вы даете свое согласие на обработку изложенных в настоящей форме персональных данных на условиях <a href="/policy.pdf" target="_blank" class="text-link">Политики обработки персональных данных</a></span>
                                 </label>
                              </div>
                              <div class="submit-wrap">
                                 <input type="submit" data-wait="Оставить заявку" class="submit-button w-button" value="Оставить заявку" style="display: none;">
                                 <a href="#toform" class="submit-button dot-link w-inline-block">
                                    <div class="text-18 mob-18">Оставить заявку</div>
                                 </a>
                              </div>
                           </form>
                           <div class="w-form-done" tabindex="-1" role="region" aria-label="Email Form success">
                              <div>Спасибо! Ваша заявка получена!</div>
                           </div>
                           <div class="w-form-fail" tabindex="-1" role="region" aria-label="Email Form failure">
                              <div>Oops! Something went wrong while submitting the form.</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section s3-section">
               <div class="container">
                  <div class="content-block scrollobs visible">
                     <div class="book-polka">
                        <div class="book-slider">
                           <?php $query_args = array( 'posts_per_page' => 5,
                              'post_type' => 'magazine',
                               );
                              $custom_query = new WP_Query( $query_args );
                              
                              	if ( $custom_query->have_posts() ): ?>
                           <div data-query-arg-posts_per_page="5" data-query-arg-post_type="magazine" class="book-slider__container">
                              <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                              <a data-if-exists="true" href="<?php the_permalink(); ?>" class="book-slider__slide book book--3 cursor-hover w-inline-block book-slider__slide--active" style="--root-width: -72px; rotate: y 0deg; translate: -350.572px; transition: 0.6s ease-out;">
                                 <div class="book__root" style="transform: translate3d(50%, 0px, -36px) rotateY(-180deg);"><img src="<?php echo get_field( 'koreshok', false ); ?>" loading="eager" alt="" class="img-cover"></div>
                                 <div class="book_shadow"></div>
                                 <div data-wp="post_bg_image" class="book-forot"><img src="<?php the_post_thumbnail_url(); ?>" loading="eager" alt="" class="img-cover"></div>
                              </a>
                              <?php endwhile; wp_reset_postdata(); ?>
                           </div>
                           <?php endif; ?>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section prefooter-section">
               <div class="container">
                  <div class="content-block mag-telegram-content-block scrollobs">
                     <div class="text-24 _18-tab">Смотрите далее</div>
                     <div class="rel">
                        <div class="prefooter-link cursor-hover">
                           <div class="h1">Телеграм</div>
                           <div class="prefooter-link-icon">
                              <div class="svg w-embed">
                                 <svg width="100%" style="" viewBox="0 0 78 79" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.7134 3.44387L35.9209 3.23633L50.0201 3.23633L78.0002 31.2164V47.0982L50.0201 75.0782H35.9209L35.7134 74.8707L66.2939 44.2902L0 44.2902V34.0271L66.2966 34.0271L35.7134 3.44387Z" fill="currentColor"></path>
                                 </svg>
                              </div>
                           </div>
                           <?php $link = get_field( 'ssylka_na_telegramm', 'option' );
                              if ( ! empty( $link ) ) :
                              			$url = $link['url'];
                              			$title = $link['title'];
                              			$target = $link['target'] ? $link['target'] : '_self'; 
                              		?>
                           <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="prefooter-link cursor-hover abs w-inline-block"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
           <section class="section footer-section">
            <div class="container footer-container">
               <div class="footer-content">
                  <div class="footer-left">
                     <div class="footer-left-top">
                        <div class="text-14 is-opacity-60">контакты</div>
                        <div class="text-14"><?php echo get_field( 'llc_ooo', 'option' ); ?></div>
                        <div class="text-14"><?php echo get_field( 'adress_opc', 'option' ); ?></div>
                        <a href="mailto:info@bksq.art" class="text-14 is-footer-link1"><?php echo get_field( 'email_opc', 'option' ); ?></a>
                     </div>
                     <?php $link = get_field( 'tochki_prodazh_opc', 'option' );
                        if ( ! empty( $link ) ) :
                        			$url = $link['url'];
                        			$title = $link['title'];
                        			$target = $link['target'] ? $link['target'] : '_self'; 
                        		?>
                     <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="footer-link-block w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                     <?php $link = get_field( 'tochki_prodazh_opc_2', 'option' );
                        if ( ! empty( $link ) ) :
                        			$url = $link['url'];
                        			$title = $link['title'];
                        			$target = $link['target'] ? $link['target'] : '_self'; 
                        		?>
                     <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="footer-link-block w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                  </div>
                 <div class="footer-right">
                     <div class="footer-title-wrap">
                        <div class="tg-icon footer-tg-icon">
                           <div class="svg w-embed">
                              <svg width="100%" style="" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <circle cx="18" cy="18" r="16.9474" fill="currentColor" stroke="none" stroke-width="2.10526"></circle>
                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M22.1881 25.8972C22.4462 26.0812 22.779 26.1272 23.0756 26.0142C23.3722 25.9005 23.5903 25.6455 23.656 25.3365C24.3527 22.0411 26.0427 13.7002 26.6769 10.7026C26.725 10.4766 26.6448 10.2418 26.4684 10.0909C26.292 9.94004 26.0475 9.89647 25.8294 9.97796C22.4679 11.2303 12.1155 15.1397 7.88406 16.7156C7.61549 16.8156 7.44072 17.0754 7.44954 17.3603C7.45916 17.6459 7.64996 17.8936 7.92495 17.9767C9.82259 18.548 12.3135 19.3428 12.3135 19.3428C12.3135 19.3428 13.4776 22.8811 14.0845 24.6804C14.1606 24.9064 14.3362 25.0839 14.5679 25.1452C14.7988 25.2057 15.0457 25.142 15.2181 24.9782C16.1929 24.0519 17.7001 22.6196 17.7001 22.6196C17.7001 22.6196 20.5638 24.7329 22.1881 25.8972ZM13.3613 18.8958L14.7074 23.3644L15.0064 20.5346C15.0064 20.5346 20.2071 15.8134 23.1718 13.1224C23.2584 13.0434 23.2704 12.911 23.1982 12.8182C23.1269 12.7255 22.9954 12.7037 22.8968 12.7666C19.4607 14.9751 13.3613 18.8958 13.3613 18.8958Z" fill="black"></path>
                              </svg>
                           </div>
                        </div>
                        <div class="text-neue-44 footer-heading"><?php $link = get_field( 'ssylka_na_telegramm', 'option' );
                           if ( ! empty( $link ) ) :
                           			$url = $link['url'];
                           			$title = $link['title'];
                           			$target = $link['target'] ? $link['target'] : '_self'; 
                           		?>
                           <a href="<?php echo esc_url( $url ); ?>" data-if-exists="true" target="<?php echo esc_attr( $target ); ?>" class="title-link cursor-hover"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                        </div>
                        <?php if ( ! empty( get_field( 'foobig-text', 'option' ) ) ) : ?>
                        <div class="text-neue-44 footer-heading"><?php echo get_field( 'foobig-text', 'option' ); ?></div>
                        <?php endif; ?>
                     </div>
                     <div class="footer-right-bottom">
                        <a href="<?php echo get_field( 'policy_opc', 'option' ); ?>" target="_blank" class="text-16 is-footer-link2">Политика обработки персональных данных</a><a href="#" class="text-16 is-footer-link2 show-coocky">Использование cookie-файлов</a>
                        <p class="text-16 is-opacity-40"><?php echo get_field( 'art_opc', 'option' ); ?></p>
                        <p class="text-16"><span class="is-opacity-40">Сделано в</span> <a href="https://cpeople.ru/" target="_blank" class="footer-link3">CreativePeople</a></p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         <div class="nav-top">
            <div class="container nav-container">
               <div class="div-block-4">
                  <a href="/" aria-current="page" class="brand cursor-hover w-inline-block w--current">
                     <div>Black square</div>
                  </a>
               </div>
               <div class="div-block-4 center"><?php $link = get_field( 'ssylka_na_telegramm', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
                  <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="nav-link cursor-hover"><?php echo esc_html( $title ); ?></a><?php endif; ?>
               </div>
               <div class="div-block-4 r"><?php $link = get_field( 'menyu_biznes_soprovozhzhenie', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
                  <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="nav-link cursor-hover" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
               </div>
            </div>
         </div>
         <div class="nav-bottom">
            <div class="container nav-container">
               <?php $link = get_field( 'menyu_o_proekte', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
               <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="nav-link cursor-hover" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
               <a href="#" class="nav-link cursor-hover hidden">афиша</a><?php $query_args = array( 'posts_per_page' => 1,
                  'post_type' => 'magazine',
                   );
                  $custom_query = new WP_Query( $query_args );
                  
                  	if ( $custom_query->have_posts() ): ?>
               <div data-query-arg-posts_per_page="1" data-query-arg-post_type="magazine">
                  <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                  <a href="<?php the_permalink(); ?>" class="nav-link cursor-hover w-inline-block">
                      <?php if ( ! empty( get_field( 'zhur_opc', 'option' ) ) ) : ?>
                     <div><?php echo get_field( 'zhur_opc', 'option' ); ?></div>
                     <?php endif; ?>
                  </a>
                  <?php endwhile; wp_reset_postdata(); ?>
               </div>
               <?php endif; ?>
            </div>
         </div>
         <div class="cursor-wrap">
            <div data-w-id="c6a75421-3296-aff3-c94d-f3107a546d49" class="cursor-holder" style="will-change: transform; transform: translate3d(44.164vw, 48.715vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
               <div class="vimeo-cursor" style="opacity: 0;">
                  <div>Vimeo</div>
                  <div class="vimeo-button-icon">
                     <div class="svg w-embed">
                        <svg width="100%" style="" viewBox="0 0 46 46" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4749 13.4965L11.4749 13.3767L15.5655 9.28601H31.7987L36.406 13.8933L36.406 30.1276L32.3165 34.2172H32.1955L32.1955 16.4743L12.9638 35.706L9.98654 32.7287L29.2187 13.4965L11.4749 13.4965Z" fill="currentColor"></path>
                        </svg>
                     </div>
                  </div>
               </div>
               <div class="tg-cursor">
                  <div>Telegram</div>
                  <div class="vimeo-button-icon">
                     <div class="svg w-embed">
                        <svg width="100%" style="" viewBox="0 0 46 46" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4749 13.4965L11.4749 13.3767L15.5655 9.28601H31.7987L36.406 13.8933L36.406 30.1276L32.3165 34.2172H32.1955L32.1955 16.4743L12.9638 35.706L9.98654 32.7287L29.2187 13.4965L11.4749 13.4965Z" fill="currentColor"></path>
                        </svg>
                     </div>
                  </div>
               </div>
               <div class="cube-cursor" style="opacity: 0;">
                  <div class="svg w-embed">
                     <svg width="100%" style="" viewBox="0 0 13 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <rect y="0.5" width="13" height="13" fill="currentColor"></rect>
                     </svg>
                  </div>
               </div>
               <div class="cube-lista"></div>
               <div class="cube-lista-2"></div>
            </div>
         </div>
       <div class="popup-overlay">
            <div class="cookies-popup">
               <div class="cookies-popup-inner">
                  <div class="cookies-content">
                     <p class="text-neue-18 is-uppercase _16-mob">Сайт использует cookie</p>
                     <p class="text-16"><span class="is-opacity-60">Согласен c условиями</span> <a href="<?php echo get_field( 'policy_opc', 'option' ); ?>" target="_blank" class="cookie-link">Политики обработки персональных данных </a><span class="is-opacity-60">и предоставляю согласие на использование cookie-файлов.<br>Если вы не согласны на использование cookie-файлов, поменяйте настройки браузера.</span></p>
                  </div>
                  <div class="button-wrap cookies-button-wrap"><a id="accept" href="#" class="dot-link cookies-button w-button">Принять</a><a href="#" class="dot-link cookies-button-decline decline w-button">Отклонить</a></div>
               </div>
            </div>
         </div>
         <div class="mobmenu">
            <a data-lenis-toggle="" href="#" class="mob-btn w-inline-block">
               <div class="code-embed-2 w-embed">
                   <svg width="100%" height="100%" viewBox="0 0 375 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M213.03 8.43015C220.813 15.4131 229.56 23 240.017 23H351C364.255 23 375 23 375 23V92C375 105.255 364.255 116 351 116H24C10.7452 116 0 105.255 0 92V23H24H135.983C146.44 23 155.187 15.4131 162.969 8.43014C168.811 3.18846 176.533 0 185 0H191C199.467 0 207.189 3.18847 213.03 8.43015Z" fill="black"/>
<path d="M180 16.5H196M180 23.5H196" stroke="white" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"/>
</svg>  <svg style="display:none" class="kres" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="white"/>
</svg>
               </div>
            </a>
            <div data-lenis-prevent="" class="mob-menu-line">
               <a href="/" class="menu-btn">BKSQ</a><?php $link = get_field( 'menyu_o_proekte', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
               <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="menu-btn" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
             <?php $query_args = array( 'posts_per_page' => 1,
                  'post_type' => 'magazine',
                   );
                  $custom_query = new WP_Query( $query_args );
                  
                  	if ( $custom_query->have_posts() ): ?>
               <div data-query-arg-posts_per_page="1" data-query-arg-post_type="magazine">
                  <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                  <a href="<?php the_permalink(); ?>" class="w-inline-block">
                     <div>Журнал</div>
                  </a>
                  <?php endwhile; wp_reset_postdata(); ?>
               </div>
               <?php endif; ?>
               <?php $link = get_field( 'menyu_biznes_soprovozhzhenie', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
               <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="menu-btn" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
            </div>
         </div>
      
      </div>
      <div class="popup-wrapper see-all-popup-wrapper">
         <div data-lenis-start="" class="popup-bg-overlay"></div>
         <div data-lenis-prevent="" class="see-all-popup">
            <div data-lenis-start="" class="close-popup">
               <div class="svg w-embed">
                  <svg width="100%" style="" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
                     <rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
                  </svg>
               </div>
            </div>
            <div class="see-all-popup-inner">
               <div class="text-18 mob-18 isuppercase">Журнал BKSQ в онлайн-магазинах</div>
               <?php if ( have_rows( 'popuplinks', false ) ) : ?>
               <div class="see-all-grid">
                  <?php while ( have_rows( 'popuplinks', false ) ) : the_row(); ?>
                  <div id="w-node-_929622b3-614d-6665-096f-61246073a472-6073a471" class="see-all-box"><img src="<?php echo get_sub_field( 'imgpopupbuy' ); ?>" loading="lazy" alt="" class="image-contain"><?php $link = get_sub_field( 'linkpopupbuy' );
                     if ( ! empty( $link ) ) :
                     			$url = $link['url'];
                     			$title = $link['title'];
                     			$target = $link['target'] ? $link['target'] : '_self'; 
                     		?>
                     <a data-if-exists="true" id="w-node-_380cfb1c-7c77-0320-803d-5f9340276eed-6073a471" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="see-all-box abst w-inline-block"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                  </div>
                  <?php endwhile; ?>
               </div>
               <?php endif; ?>
            </div>
         </div>
      </div>
      <div class="popup-wrapper mag1-popup-wrapper mag">
         <div class="popup-bg-overlay"></div>
         <div class="mag-popup">
            <div data-lenis-start="" class="close-popup mag-close-popup">
               <div class="svg w-embed">
                  <svg width="100%" style="" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
                     <rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
                  </svg>
               </div>
            </div>
            <div class="mag-popup-inner">
               <?php if ( have_rows( 'otryvok_2___izobrazheniya', false ) ) : ?>
               <div class="mag-image-row single-image-row">
                  <?php while ( have_rows( 'otryvok_2___izobrazheniya', false ) ) : the_row(); ?>
                  <div class="mag-image-box"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                  <?php endwhile; ?>
               </div>
               <?php endif; ?>
               <div class="mag-popup-bottom">
                  <p class="text-18 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_2_-_gtw', false ); ?></p>
                  <p class="text-16 _14-tab"><?php echo get_field( 'otryvok_2___opisanie', false ); ?></p>
               </div>
            </div>
         </div>
      </div>
      <div class="popup-wrapper mag1-popup-wrapper mag">
         <div class="popup-bg-overlay"></div>
         <div class="mag-popup">
            <div data-lenis-start="" class="close-popup mag-close-popup">
               <div class="svg w-embed">
                  <svg width="100%" style="" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
                     <rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
                  </svg>
               </div>
            </div>
            <div class="mag-popup-inner">
               <?php if ( have_rows( 'otryvok_3___izobrazheniya', false ) ) : ?>
               <div class="mag-image-row single-image-row">
                  <?php while ( have_rows( 'otryvok_3___izobrazheniya', false ) ) : the_row(); ?>
                  <div class="mag-image-box"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                  <?php endwhile; ?>
               </div>
               <?php endif; ?>
               <div class="mag-popup-bottom">
                  <p class="text-18 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_3_-_gtw', false ); ?></p>
                  <p class="text-16 _14-tab"><?php echo get_field( 'otryvok_3___opisanie', false ); ?></p>
               </div>
            </div>
         </div>
      </div>
      <div class="popup-wrapper mag1-popup-wrapper mag">
         <div class="popup-bg-overlay"></div>
         <div class="mag-popup">
            <div data-lenis-start="" class="close-popup mag-close-popup">
               <div class="svg w-embed">
                  <svg width="100%" style="" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
                     <rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
                  </svg>
               </div>
            </div>
            <div class="mag-popup-inner">
               <?php if ( have_rows( 'otryvok_4___izobrazheniya', false ) ) : ?>
               <div class="mag-image-row single-image-row">
                  <?php while ( have_rows( 'otryvok_4___izobrazheniya', false ) ) : the_row(); ?>
                  <div class="mag-image-box"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                  <?php endwhile; ?>
               </div>
               <?php endif; ?>
               <div class="mag-popup-bottom">
                  <p class="text-18 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_4_-_gtw', false ); ?></p>
                  <p class="text-16 _14-tab"><?php echo get_field( 'otryvok_4___opisanie', false ); ?></p>
               </div>
            </div>
         </div>
      </div>
      <div class="popup-wrapper mag1-popup-wrapper mag">
         <div class="popup-bg-overlay"></div>
         <div class="mag-popup">
            <div data-lenis-start="" class="close-popup mag-close-popup">
               <div class="svg w-embed">
                  <svg width="100%" style="" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
                     <rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
                  </svg>
               </div>
            </div>
            <div class="mag-popup-inner">
               <?php if ( have_rows( 'otryvok_5___izobrazheniya', false ) ) : ?>
               <div class="mag-image-row single-image-row">
                  <?php while ( have_rows( 'otryvok_5___izobrazheniya', false ) ) : the_row(); ?>
                  <div class="mag-image-box"><img class="image-cover" src="<?php echo get_sub_field( 'foto' ); ?>" alt="" loading="lazy"></div>
                  <?php endwhile; ?>
               </div>
               <?php endif; ?>
               <div class="mag-popup-bottom">
                  <p class="text-18 is-opacity-60 is-uppercase"><?php echo get_field( 'otryvok_5_-_gtw', false ); ?></p>
                  <p class="text-16 _14-tab"><?php echo get_field( 'otryvok_5___opisanie', false ); ?></p>
               </div>
            </div>
         </div>
      </div>
      <div class="popup-wrapper mag5-popup-wrapper mag">
         <div class="popup-bg-overlay"></div>
         <div class="mag-popup">
            <div data-lenis-start="" class="close-popup mag-close-popup">
               <div class="svg w-embed">
                  <svg width="100%" style="" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
                     <rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
                  </svg>
               </div>
            </div>
            <div class="mag-popup-inner">
               <div class="mag-image-row single-image-row">
                  <div class="mag-image-box maxh-450"><img class="image-cover" src="<?php echo get_field( 'otryvok_1___prevyu_izobrazhenie', false ); ?>" alt="" loading="lazy"></div>
               </div>
            </div>
         </div>
      </div>
	
	
		<!-- FOOTER CODE -->
		<?php get_template_part("footer_block", ""); ?>
	</body>
</html>
