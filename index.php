<?php
/*
Template name: Black Square
*/
?>
    <!DOCTYPE html>
<html data-wf-page="6704f17061cf6aa78bd63b0f" data-wf-site="6704f17061cf6aa78bd63b0e">
	<?php get_template_part("header_block", ""); ?>
	<body class="body">
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
		</div>
		
		
	 <div class="preloader">
         <div class="preloader-content">
            <div class="preloader-fugure">
               <div class="preloader-fugure_front"></div>
               <div class="preloader-fugure_right"></div>
               <div class="preloader-fugure_left"></div>
               <div class="preloader-fugure_back"></div>
            </div>
         </div>
         <div class="preloader-counter">
            <div id="loadertext" class="counter-text h2">0</div>
         </div>
         <img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6784f8a02f3f5412bfd2acf2_B.svg" loading="eager" alt="" class="image-2"><img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6784f8a00827d8f0f2c00a9e_S.svg" loading="eager" alt="" class="image-2 _2"><img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6784f8a01ad45c1f2d014c53_K.svg" loading="eager" alt="" class="image-2 _3"><img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6784f8a0a86924548c7f2c30_Q.svg" loading="eager" alt="" class="image-2 _4">
         <div class="load-image">
            <div class="image-cover w-background-video w-background-video-atom" >
               <video id="fa638008-8774-3ace-e4f6-f7ea57a4cabb-video" autoplay="" muted="" playsinline="" >
               <source src="<?php echo get_field( 'video_zastavka', false ); ?>" data-wf-ignore="true">
               </video>
            </div>
            <div class="load-black"></div>
         </div>
         <div class="div-block-8"><a href="#" class="skip-btn w-inline-block">
               <?php if ( ! empty( get_field( 'skiptext', false ) ) ) : ?>
               <div><?php echo get_field( 'skiptext', false ); ?></div>
               <?php endif; ?>
            </a></div>
      </div>
      
      	 <div id="barba-wrapper" class="barba-wrapper" aria-live="polite">
         <div class="barba-container">
      
      <div class="page-wrap home-page hp2">
         <div class="main-wrap">
            <section class="section hero-section">
               <div class="container">
                  <div class="hero-content">
                     <h1 class="h1"><?php echo get_field( 'mainheadtext', false ); ?></h1>
                     <div class="content-block hero-content-block">
                        <div id="w-node-a7122ffa-b900-581b-c978-222387870398-8bd63b0f" class="left-hero-image-clone left-col">
                           <div class="hero-image-column-2 left-hero-column main-ggl _2">
                              <div class="hero-image-box-2 iinn"><img class="image-contain img-100vh" src="<?php echo get_field( 'oblozhka_zhurnala', false ); ?>" alt="" loading="eager"></div>
                           </div>
                        </div>
                        <div class="hero-text-contnent-2">
                           <div class="div-block"></div>
                           <div class="hero-text-box-2 cursor-hover">
                              <div class="dot-link-2 hero-link-button underlined-link">
                                 <div class="link-dot-2 hero-link-dot outline-on-hover"></div>
                                 <div class="hero-link-title">
                                    <div class="text-18 mob-18">Black Square</div>
                                 </div>
                                 <div class="text-18 mob-18"><?php echo get_field( 'mag-date', false ); ?></div>
                              </div>
                              <div class="text-18 tab-16 no-mob"><?php echo get_field( 'mag-descr', false ); ?></div>
                           </div>
                        </div>
                        <div id="w-node-a7122ffa-b900-581b-c978-2223878703a8-8bd63b0f" class="hero-image-column-2 main-ggl">
                           <div class="div-block-3">
                              <div class="code-embed cursor-hover w-embed">
                                 <?php if ( have_rows( 'listalka', false ) ) : ?>
                                 <div id="flipping" >
                                    <?php while ( have_rows( 'listalka', false ) ) : the_row(); ?>
                                    <div class="page-wrapper" page="1" >
                                       <div >
                                          <div class="page p1 odd"  ><img src="<?php echo get_sub_field( 'listalka-img' ); ?>" alt="book" class="book-page__img"></div>
                                       </div>
                                       <div ></div>
                                    </div>
                                    <?php endwhile; ?>
                                 </div>
                                 <?php endif; ?>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="s2-left omob">
                        <p class="text-16 mob-16 scrollobs"><?php echo get_field( 'mag-descr', false ); ?></p>
                        <div class="button-wrap s2-button-wrap scrollobs"><?php $link = get_field( 'tochki_prodazh_opc', 'option' );
                           if ( ! empty( $link ) ) :
                           			$url = $link['url'];
                           			$title = $link['title'];
                           			$target = $link['target'] ? $link['target'] : '_self'; 
                           		?>
                           <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="dot-link big-button w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                           <?php $link = get_field( 'tochki_prodazh_opc_2', 'option' );
                              if ( ! empty( $link ) ) :
                              			$url = $link['url'];
                              			$title = $link['title'];
                              			$target = $link['target'] ? $link['target'] : '_self'; 
                              		?>
                           <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="dot-link big-button ghost-button w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section s2-section">
               <div class="container">
                  <div class="heading-wrap s2-heading-wrap main-s2-heading-wrap">
                     <h2 class="h2 scrollobs"><?php echo get_field( 's2-h2', false ); ?></h2>
                     <div class="s2-heading-line"></div>
                  </div>
                  <div class="content-block s2-content-block">
                     <div class="s2-left">
                        <div class="text-16 mob-16 scrollobs"><?php echo get_field( 's2-p1', false ); ?></div>
                        <div class="button-wrap s2-button-wrap scrollobs no-mob"><?php $link = get_field( 'tochki_prodazh_opc', 'option' );
                           if ( ! empty( $link ) ) :
                           			$url = $link['url'];
                           			$title = $link['title'];
                           			$target = $link['target'] ? $link['target'] : '_self'; 
                           		?>
                           <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="dot-link big-button w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                           <?php $link = get_field( 'tochki_prodazh_opc_2', 'option' );
                              if ( ! empty( $link ) ) :
                              			$url = $link['url'];
                              			$title = $link['title'];
                              			$target = $link['target'] ? $link['target'] : '_self'; 
                              		?>
                           <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="dot-link big-button ghost-button w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                        </div>
                     </div>
                     <div class="s2-right">
                        <div class="s2-right-row scrollobs-line">
                           <div class="text-16 is-opacity-60 mob-16 scrollobs">Сколько раз в год выходит<br>журнал Black Square</div>
                           <div class="text-neue-36 s2-numbers scrollobs"><?php echo get_field( 's2-cyear', false ); ?></div>
                        </div>
                        <div class="s2-right-row scrollobs-line">
                           <div class="text-16 is-opacity-60 mob-16 scrollobs">Формат журнала, мм</div>
                           <div class="text-neue-36 s2-numbers scrollobs"><?php echo get_field( 's2-size', false ); ?></div>
                        </div>
                        <div class="s2-right-row scrollobs-line">
                           <div class="text-16 is-opacity-60 mob-16 scrollobs">Вес, грамм</div>
                           <div class="text-neue-36 s2-numbers scrollobs"><?php echo get_field( 's2-weight', false ); ?></div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section s3-section">
               <div class="container">
                  <div class="content-block scrollobs">
                     <div class="book-polka">
                        <div class="book-slider">
                           <?php $query_args = array( 'posts_per_page' => 5,
                              'post_type' => 'magazine',
                               );
                              $custom_query = new WP_Query( $query_args );
                              
                              	if ( $custom_query->have_posts() ): ?>
                           <div data-query-arg-posts_per_page="5" data-query-arg-post_type="magazine" class="book-slider__container">
                              <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                              <a data-if-exists="true" href="<?php the_permalink(); ?>" class="book-slider__slide book book--3 cursor-hover w-inline-block book-slider__slide--active" style="--root-width: -72px; rotate: y 0deg; translate: -892.804px; transition: 0.6s ease-out;">
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
            <section class="section s4section">
               <div class="container">
                  <div class="heading-wrap">
                     <h2 class="h1 scrollobs"><?php echo get_field( 's3-h2', false ); ?></h2>
                  </div>
                  <div class="content-block s4-content-block">
                     <div class="s4-left">
                        <div class="text-18 s4-text scrollobs"><?php echo get_field( 's3-p1', false ); ?></div>
                        <div class="button-wrap scrollobs"><?php $link = get_field( 's3-a1', false );
                           if ( ! empty( $link ) ) :
                           			$url = $link['url'];
                           			$title = $link['title'];
                           			$target = $link['target'] ? $link['target'] : '_self'; 
                           		?>
                           <a href="<?php echo esc_url( $url ); ?>" class="dot-link underlined-link w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                        </div>
                     </div>
                     <div class="s4-right scrollobs"><img class="image-cover" src="<?php echo get_field( 's3-img1', false ); ?>" width="374" alt="" loading="eager"></div>
                  </div>
               </div>
            </section>
            <section class="section s5-section">
               <div class="container">
                  <div class="content-block s5-content-block scrollobs">
                     <div class="slider team-slider splide splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized" id="splide01" role="region" aria-roledescription="carousel">
                        <div class="splide__track splide__track--slide splide__track--ltr splide__track--draggable" id="splide01-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                           <?php $query_args = array( 'posts_per_page' => 10,
                              'post_type' => 'tgpost',
                               );
                              $custom_query = new WP_Query( $query_args );
                              
                              	if ( $custom_query->have_posts() ): ?>
                           <div data-query-arg-posts_per_page="10" data-query-arg-post_type="tgpost" class="splide__list" id="splide01-list" role="presentation" style="transform: translateX(0px);">
                              <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                              <div class="splide__slide is-active is-visible" id="splide01-slide01" role="group" aria-roledescription="slide" aria-label="1 of 5" style="width: calc(40%);">
                                 <div class="slide-inner s5-slide-inner tg-cursor-hover">
                                    <div class="slider-card-info">
                                       <div class="slider-card-details-row">
                                          <div class="slider-card-details-box">
                                             <div class="slider-card-detail-icon">
                                                <div class="svg w-embed">
                                                   <svg width="100%" style="" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                      <g>
                                                         <path d="M10.0026 7.5C9.33956 7.5 8.70368 7.76339 8.23484 8.23223C7.766 8.70107 7.5026 9.33696 7.5026 10C7.5026 10.663 7.766 11.2989 8.23484 11.7678C8.70368 12.2366 9.33956 12.5 10.0026 12.5C10.6656 12.5 11.3015 12.2366 11.7704 11.7678C12.2392 11.2989 12.5026 10.663 12.5026 10C12.5026 9.33696 12.2392 8.70107 11.7704 8.23223C11.3015 7.76339 10.6656 7.5 10.0026 7.5ZM10.0026 14.1667C8.89754 14.1667 7.83773 13.7277 7.05633 12.9463C6.27492 12.1649 5.83594 11.1051 5.83594 10C5.83594 8.89493 6.27492 7.83512 7.05633 7.05372C7.83773 6.27232 8.89754 5.83333 10.0026 5.83333C11.1077 5.83333 12.1675 6.27232 12.9489 7.05372C13.7303 7.83512 14.1693 8.89493 14.1693 10C14.1693 11.1051 13.7303 12.1649 12.9489 12.9463C12.1675 13.7277 11.1077 14.1667 10.0026 14.1667ZM10.0026 3.75C5.83594 3.75 2.2776 6.34167 0.835938 10C2.2776 13.6583 5.83594 16.25 10.0026 16.25C14.1693 16.25 17.7276 13.6583 19.1693 10C17.7276 6.34167 14.1693 3.75 10.0026 3.75Z" fill="currentColor"></path>
                                                      </g>
                                                   </svg>
                                                </div>
                                             </div>
                                             <?php if ( ! empty( get_field( 'kolichestvo_prosmotrov', false ) ) ) : ?>
                                             <div class="text-16 slider-card-detail-text"><?php echo get_field( 'kolichestvo_prosmotrov', false ); ?></div>
                                             <?php endif; ?>
                                          </div>
                                          <div class="slider-card-details-box no-tab">
                                             <div class="slider-card-detail-icon">
                                                <div class="svg w-embed">
                                                   <svg width="100%" style="" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                      <g>
                                                         <path d="M16.6693 16V5.5C16.6693 4.67275 16.0048 4 15.1878 4H13.7063V2.5H12.2248V4H7.78038V2.5H6.2989V4H4.81742C4.00038 4 3.33594 4.67275 3.33594 5.5V16C3.33594 16.8273 4.00038 17.5 4.81742 17.5H15.1878C16.0048 17.5 16.6693 16.8273 16.6693 16ZM7.78038 14.5H6.2989V13H7.78038V14.5ZM7.78038 11.5H6.2989V10H7.78038V11.5ZM10.7433 14.5H9.26186V13H10.7433V14.5ZM10.7433 11.5H9.26186V10H10.7433V11.5ZM13.7063 14.5H12.2248V13H13.7063V14.5ZM13.7063 11.5H12.2248V10H13.7063V11.5ZM15.1878 7.75H4.81742V6.25H15.1878V7.75Z" fill="currentColor"></path>
                                                      </g>
                                                   </svg>
                                                </div>
                                             </div>
                                             <?php if ( ! empty( get_field( 'kolichestvo_prosmotrov', false ) ) ) : ?>
                                             <div class="text-16 slider-card-detail-text"><?php echo get_field( 'kolichestvo_prosmotrov_data', false ); ?></div>
                                             <?php endif; ?>
                                          </div>
                                       </div>
                                       <div class="text-18 slider-card-title"><?php the_title(); ?></div>
                                    </div>
                                    <div class="slider-card-image"><img class="image-cover" src="<?php the_post_thumbnail_url(); ?>" width="401" alt="" loading="lazy"></div>
                                    <?php $link = get_field( 'tglink', false );
                                       if ( ! empty( $link ) ) :
                                       			$url = $link['url'];
                                       			$title = $link['title'];
                                       			$target = $link['target'] ? $link['target'] : '_self'; 
                                       		?>
                                    <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="link-block w-inline-block"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                                 </div>
                              </div>
                              <?php endwhile; wp_reset_postdata(); ?>
                           </div>
                           <?php endif; ?>
                        </div>
                     </div>
                  </div>
                  <div class="heading-wrap s5-heading-wrap">
                     <div class="tg-icon s5-tg-icon">
                        <div class="svg w-embed">
                           <svg width="100%" style="" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="18" cy="18" r="16.9474" fill="currentColor" stroke="none" stroke-width="2.10526"></circle>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.1881 25.8972C22.4462 26.0812 22.779 26.1272 23.0756 26.0142C23.3722 25.9005 23.5903 25.6455 23.656 25.3365C24.3527 22.0411 26.0427 13.7002 26.6769 10.7026C26.725 10.4766 26.6448 10.2418 26.4684 10.0909C26.292 9.94004 26.0475 9.89647 25.8294 9.97796C22.4679 11.2303 12.1155 15.1397 7.88406 16.7156C7.61549 16.8156 7.44072 17.0754 7.44954 17.3603C7.45916 17.6459 7.64996 17.8936 7.92495 17.9767C9.82259 18.548 12.3135 19.3428 12.3135 19.3428C12.3135 19.3428 13.4776 22.8811 14.0845 24.6804C14.1606 24.9064 14.3362 25.0839 14.5679 25.1452C14.7988 25.2057 15.0457 25.142 15.2181 24.9782C16.1929 24.0519 17.7001 22.6196 17.7001 22.6196C17.7001 22.6196 20.5638 24.7329 22.1881 25.8972ZM13.3613 18.8958L14.7074 23.3644L15.0064 20.5346C15.0064 20.5346 20.2071 15.8134 23.1718 13.1224C23.2584 13.0434 23.2704 12.911 23.1982 12.8182C23.1269 12.7255 22.9954 12.7037 22.8968 12.7666C19.4607 14.9751 13.3613 18.8958 13.3613 18.8958Z" fill="black"></path>
                           </svg>
                        </div>
                     </div>
                     <h2 class="h2 no-mob scrollobs"><?php echo get_field( 's4-h2', false ); ?></h2>
                     <h2 class="h2 only-mob scrollobs"><?php echo get_field( 's4-h2-mob', false ); ?></h2>
                  </div>
               </div>
               <div class="vimeo-cursor-hover">
                  <div data-w-id="7c4a7787-b359-98cf-93ab-3142fc36f4be" class="container video-container rel">
                     <div class="mag-video">
                        <div class="background-video w-background-video w-background-video-atom" data-autoplay="true" data-loop="true" data-wf-ignore="true" >
                           <video id="7c4a7787-b359-98cf-93ab-3142fc36f4c0-video" autoplay="" loop="" muted="" playsinline="" data-wf-ignore="true" data-object-fit="cover">
                           <source src="<?php echo get_field( 's4-f1', false ); ?>" data-wf-ignore="true">
                           </video>
                        </div>
                     </div>
                     <?php $link = get_field( 's4-a1', false );
                        if ( ! empty( $link ) ) :
                        			$url = $link['url'];
                        			$title = $link['title'];
                        			$target = $link['target'] ? $link['target'] : '_self'; 
                        		?>
                     <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="_blank" class="video-block abst w-inline-block" style="transform: translate3d(0px, 0px, 0px) scale3d(0.7, 0.7, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; will-change: transform;"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                  </div>
               </div>
            </section>
            <section class="section s6-section">
               <div class="container">
                  <div class="section-header s6section-header scrollobs">
                     <h2 class="h1"><?php echo get_field( 's5-h1', false ); ?></h2>
                     <a href="#" class="header-lbutton w-inline-block">
                        <div class="h1">Мероприятия</div>
                        <div class="header-button-arrow">
                           <div class="svg w-embed">
                              <svg width="100%" style="" viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M29.3045 2.42114L29.4756 2.25L41.0425 2.25L64.001 25.2084V38.2407L41.0442 61.1974H29.4739L29.3045 61.028L54.4036 35.9289L0 35.9289V27.5078L54.3912 27.5078L29.3045 2.42114Z" fill="currentColor"></path>
                              </svg>
                           </div>
                        </div>
                     </a>
                  </div>
               </div>
               <div class="container events-container">
                  <?php $query_args = array( 'posts_per_page' => 5,
                     'post_type' => 'events',
                      );
                     $custom_query = new WP_Query( $query_args );
                     
                     	if ( $custom_query->have_posts() ): ?>
                  <div data-query-arg-posts_per_page="5" data-query-arg-post_type="events" class="content-block s6-content-block">
                     <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                     <div class="event-row cursor-hover scrollobs-line">
                        <div class="div-block-2">
                           <div class="event-row-left scrollobs-opc">
                              <div class="event-left1">
                                 <?php if ( ! empty( get_field( 'data', false ) ) ) : ?>
                                 <div class="text-neue-36"><?php echo get_field( 'data', false ); ?></div>
                                 <?php endif; ?>
                              </div>
                              <div class="event-left2">
                                 <div class="rel">
                                    <div class="event-title"><?php the_title(); ?></div>
                                    <a href="<?php echo get_field( 'ssylka', false ); ?>" class="abs-link w-inline-block"></a>
									 
									 
                                 </div>
                                 <?php if ( ! empty( get_field( 'content', false ) ) ) : ?>
                                 <div class="text-16"><?php echo get_field( 'content', false ); ?></div>
                                 <?php endif; ?>
                              </div>
                              <div class="event-left3">
                                 <div class="text-16 is-opacity-60"><?php echo get_field( 'place', false ); ?></div>
                                 <div class="text-16"><?php echo get_field( 'stand', false ); ?></div>
                              </div>
                           </div>
                        </div>
                        <?php if ( have_rows( 'card-images', false ) ) : ?>
                        <div class="event-row-right scrollobs-opc">
                           <?php while ( have_rows( 'card-images', false ) ) : the_row(); ?>
                           <div class="event-image-box"><img src="<?php echo get_sub_field( 'card-image' ); ?>" loading="eager" alt="" class="event-image"></div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
						  <a href="<?php echo get_field( 'ssylka', false ); ?>" class="abs-link w-inline-block"></a>
                     </div>
                     <?php endwhile; wp_reset_postdata(); ?>
                  </div>
                  <?php endif; ?>
               </div>
            </section>
            <section class="section s7-section">
               <div class="container">
                  <div class="hero-content">
                     <div class="content-block s7-content-block">
                        <div class="s7-left">
                           <div class="s7-left-top">
                              <div class="text-neue-44 scrollobs"><?php echo get_field( 'h2-s5', false ); ?></div>
                           </div>
                           <div class="s7-image-box from-tab"><img class="image-contain" src="<?php echo get_field( 's5-img', false ); ?>" width="785" alt="" loading="lazy"></div>
                           <div class="s7-left-bottom">
                              <div class="text-18 scrollobs"><?php echo get_field( 's5-p1', false ); ?></div>
                           </div>
                        </div>
                        <div class="s7-right">
                           <div class="s7-image-box"><img class="image-contain scrollobs" src="<?php echo get_field( 's5-img', false ); ?>" width="785" alt="" loading="eager"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section s8-section">
               <div class="container">
                  <h2 class="h1 _34-mob scrollobs"><?php echo get_field( 's6-h1', false ); ?></h2>
                  <div class="button-wrap s8-button-wrap scrollobs"><?php $link = get_field( 's6-a1', false );
                     if ( ! empty( $link ) ) :
                     			$url = $link['url'];
                     			$title = $link['title'];
                     			$target = $link['target'] ? $link['target'] : '_self'; 
                     		?>
                     <a href="<?php echo esc_url( $url ); ?>" class="dot-link underlined-link w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                  </div>
                  <div class="content-block s8-content-block scrollobs">
                     <div class="slider team-slider splide splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized" id="splide02" role="region" aria-roledescription="carousel">
                        <div class="splide__track splide__track--slide splide__track--ltr splide__track--draggable" id="splide02-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                           <?php if ( have_rows( 'profes', false ) ) : ?>
                           <div class="splide__list" id="splide02-list" role="presentation" style="transform: translateX(0px);">
                              <?php while ( have_rows( 'profes', false ) ) : the_row(); ?>
                              <div class="splide__slide is-active is-visible" id="splide02-slide01" role="group" aria-roledescription="slide" aria-label="1 of 7" style="width: calc(40%);">
                                 <div class="slide-inner">
                                    <div class="slider-card-image a"><img src="<?php echo get_sub_field( 'foto' ); ?>" loading="eager" alt="" class="image-cover"></div>
                                    <div class="slider-card-info">
                                       <div class="text-18"><?php echo get_sub_field( 'p-name' ); ?></div>
                                       <div class="text-16 is-opacity-60"><?php echo get_sub_field( 'dolzhnost' ); ?></div>
                                    </div>
                                 </div>
                              </div>
                              <?php endwhile; ?>
                           </div>
                           <?php endif; ?>
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
               
               
              
               
               <?php $link = get_field( 'ssylka_na_telegramm_2', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
                  <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="nav-link cursor-hover"><?php echo esc_html( $title ); ?></a>
                  <?php endif; ?>
               
               
               
               <?php $query_args = array( 'posts_per_page' => 1,
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
            <div data-w-id="c6a75421-3296-aff3-c94d-f3107a546d49" class="cursor-holder" style="will-change: transform; transform: translate3d(44.782vw, 48.37vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
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
               <div class="tg-cursor" style="opacity: 0;">
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
</svg>
				   
				   <svg style="display:none" class="kres" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="white"/>
</svg>

				   
				  

               </div>
            </a>
            <div data-lenis-prevent="" class="mob-menu-line">
               <a href="/" aria-current="page" class="menu-btn w--current">BKSQ</a><?php $link = get_field( 'menyu_o_proekte', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
               <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="menu-btn" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a>
               <?php endif; ?>
               
               
                <?php $link = get_field( 'ssylka_na_telegramm', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
                  <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="menu-btn"><?php echo esc_html( $title ); ?></a>
                  <?php endif; ?>
               
                 <?php $link = get_field( 'ssylka_na_telegramm_2', 'option' );
                  if ( ! empty( $link ) ) :
                  			$url = $link['url'];
                  			$title = $link['title'];
                  			$target = $link['target'] ? $link['target'] : '_self'; 
                  		?>
                  <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="menu-btn"><?php echo esc_html( $title ); ?></a>
                  <?php endif; ?>
               
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
      <div class="hidden">
         <div class="code-embed-3 w-embed">
            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               <circle cx="20.0005" cy="20" r="20" fill="white"></circle>
               <path fill-rule="evenodd" clip-rule="evenodd" d="M24.6534 28.7721C24.9402 28.9765 25.3099 29.0276 25.6395 28.9021C25.9691 28.7757 26.2114 28.4924 26.2844 28.149C27.0585 24.4875 28.9363 15.2198 29.6409 11.8891C29.6943 11.6381 29.6053 11.3772 29.4093 11.2095C29.2133 11.0419 28.9416 10.9935 28.6993 11.084C24.9643 12.4755 13.4616 16.8193 8.76002 18.5702C8.4616 18.6814 8.26741 18.9701 8.27721 19.2866C8.2879 19.604 8.49991 19.8792 8.80545 19.9716C10.9139 20.6063 13.6816 21.4894 13.6816 21.4894C13.6816 21.4894 14.975 25.4208 15.6493 27.4201C15.734 27.6711 15.929 27.8684 16.1865 27.9365C16.443 28.0038 16.7174 27.9329 16.9089 27.7509C17.9921 26.7217 19.6668 25.1303 19.6668 25.1303C19.6668 25.1303 22.8487 27.4784 24.6534 28.7721ZM14.8459 20.9927L16.3415 25.9578L16.6737 22.8136C16.6737 22.8136 22.4523 17.5679 25.7464 14.5779C25.8426 14.49 25.8559 14.343 25.7758 14.2399C25.6965 14.1368 25.5504 14.1126 25.4408 14.1825C21.6229 16.6364 14.8459 20.9927 14.8459 20.9927Z" fill="black"></path>
            </svg>
         </div>
         <div class="logo-dot hidden">
            <div class="svg w-embed">
               <svg width="100%" style="" viewBox="0 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0H0V19H19V0Z" fill="currentColor"></path>
               </svg>
            </div>
         </div>
      </div>
		</div></div>
		
			<div class="perehod-flex">
			<div class="preloader-content">
				<div class="preloader-fugure-prerhod">
					<div class="preloader-fugure_front"></div>
					<div class="preloader-fugure_right"></div>
					<div class="preloader-fugure_left"></div>
					<div class="preloader-fugure_back"></div>
				</div>
			</div>
		</div>
		
		<!-- FOOTER CODE -->
		<?php get_template_part("footer_block", ""); ?>
	</body>
</html>
