<?php
/*
Template name: О проекте Black Square
*/
?>
    <!DOCTYPE html>
<html data-wf-page="6704f17061cf6aa78bd63b26" data-wf-site="6704f17061cf6aa78bd63b0e">
	<?php get_template_part("header_block", ""); ?>
	<body class="body about-body">
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
		
		<div id="barba-wrapper" class="barba-wrapper" aria-live="polite">
         <div class="barba-container about-body">
		
		  <div class="page-wrap">
         <div class="main-wrap">
            <section class="section about-hero-section">
               <div class="container">
                  <div class="about-hero-heading">
                     <div class="about-hero-heading-line"></div>
                     <h1 class="h1"><?php echo get_field( 'head1', false ); ?></h1>
                  </div>
                  <div class="about-hero-content">
                     <div class="about-hero-left scrollobs">
                        <div class="text-16 _20-on1900 _16-mob"><?php echo get_field( 'richpage', false ); ?></div>
                     </div>
                     <div class="about-hero-right">
                        <div class="about-hero-image scrollobs visible"><img class="image-cover" src="<?php echo get_field( 'glavnoe_izobrazhenie', false ); ?>" alt="" loading="eager"></div>
                        <div class="about-establish scrollobs">
                           <?php if ( ! empty( get_field( 'text_under_f_1', false ) ) ) : ?>
                           <div class="text-16 is-opacity-60"><?php echo get_field( 'text_under_f_1', false ); ?></div>
                           <?php endif; ?><?php if ( ! empty( get_field( 'text_under_f_2', false ) ) ) : ?>
                           <div class="text-neue-36 establish-year"><?php echo get_field( 'text_under_f_2', false ); ?></div>
                           <?php endif; ?>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section about-s2-section">
               <div class="container">
                  <div class="heading-wrap about-s2-heading-wrap scrollobs">
                     <h2 class="h2"><?php echo get_field( 'zagolovokcel', false ); ?></h2>
                  </div>
                  <div class="text-16 is-uppercase about-s2-text">На данный мы развиваем<br>следующие направления:</div>
               </div>
            </section>
            <?php if ( have_rows( 'celi_i_napravleniya', false ) ) : ?>
            <section class="section about-s3-section">
               <?php while ( have_rows( 'celi_i_napravleniya', false ) ) : the_row(); ?>
               <div class="about-s3-block about-s3-block1">
                  <div class="container">
                     <div class="content-block about-s3-content-block">
                        <div class="about-s3-left-col scrollobs">
                           <p class="text-neue-18 is-uppercase"><?php echo get_sub_field( 'tekst_sleva' ); ?></p>
                        </div>
                        <div class="about-s3-image-column scrollobs">
                           <p class="text-neue-18 about-s3-number"></p>
                           <div class="about-s3-image"><img class="image-contain" src="<?php echo get_sub_field( 'izobrazhenie_v_centre' ); ?>" alt="" loading="eager"></div>
                        </div>
                        <div class="about-s3-right-col scrollobs">
                           <div class="as4-right-header">
                              <p class="text-neue-18 is-uppercase _16-tab"><?php echo get_sub_field( 'textspravazag' ); ?></p>
                              <p class="text-16 _14-tab _16-mob"><?php echo get_sub_field( 'opisanie_sprava' ); ?></p>
                           </div>
                           <?php if ( have_rows( 'ssylki_i_vypadashki', false ) ) : ?>
                           <div class="dropdown-block">
                              <?php while ( have_rows( 'ssylki_i_vypadashki', false ) ) : the_row(); ?>
                              <div class="dropdown">
                                 <div data-w-id="1ea955d0-274c-24c0-90f3-0d1096e1fe35" class="dropdown-toggle cursor-hover">
                                    <div class="drop-toggle-icon" style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                                       <div class="svg w-embed">
                                          <svg width="100%" style="" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M10 0L10 10L-4.37114e-07 10L10 0Z" fill="currentColor"></path>
                                          </svg>
                                       </div>
                                    </div>
                                    <div>
                                       <div class="text-16 mob-16"><?php echo get_sub_field( 'zagolovok' ); ?></div>
                                    </div>
                                 </div>
                                 <div class="dropdown-list" style="height: 0px;">
                                    <div class="dropdown-list-inner">
                                       <div class="text-16 is-opacity-60 _16-on-mob"><?php echo get_sub_field( 'opisanie' ); ?></div>
                                       <?php $link = get_sub_field( 'link' );
                                          if ( ! empty( $link ) ) :
                                          			$url = $link['url'];
                                          			$title = $link['title'];
                                          			$target = $link['target'] ? $link['target'] : '_self'; 
                                          		?>
                                       <a href="<?php echo esc_url( $url ); ?>" class="dot-link underlined-link w-inline-block" target="<?php echo esc_attr( $target ); ?>">
                                          <div class="link-dot outline-on-hover hidden"></div>
                                          <div class="text-18 _16-tab"><?php echo esc_html( $title ); ?></div>
                                          <img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt="" class="image">
                                       </a>
                                       <?php endif; ?>
                                    </div>
                                 </div>
                              </div>
                              <?php endwhile; ?>
                           </div>
                           <?php endif; ?>
                           <?php if ( have_rows( 'ssylki_i_vypadashki_ss', false ) ) : ?>
                           <div class="dropdown-block">
                              <?php while ( have_rows( 'ssylki_i_vypadashki_ss', false ) ) : the_row(); ?>
                              <div class="dropdown">
                                 <div class="dropdown-toggle cursor-hover">
                                    <?php $link = get_sub_field( 'links' );
                                       if ( ! empty( $link ) ) :
                                       			$url = $link['url'];
                                       			$title = $link['title'];
                                       			$target = $link['target'] ? $link['target'] : '_self'; 
                                       		?>
                                    <a href="<?php echo esc_url( $url ); ?>" class="dot-link underlined-link w-inline-block" target="<?php echo esc_attr( $target ); ?>">
                                       <div class="link-dot outline-on-hover hidden"></div>
                                       <div class="text-18 _16-tab"><?php echo esc_html( $title ); ?></div>
                                       <img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt="" class="image">
                                    </a>
                                    <?php endif; ?>
                                 </div>
                              </div>
                              <?php endwhile; ?>
                           </div>
                           <?php endif; ?>
                        </div>
                     </div>
                  </div>
               </div>
               <?php endwhile; ?>
            </section>
            <?php endif; ?>
            <section class="section about-s4section">
               <div class="container">
                  <div class="heading-wrap scrollobs">
                     <h2 class="h1"><?php echo get_field( 'inic_head', false ); ?></h2>
                  </div>
                  <div class="content-block about-s4-content-block scrollobs">
                     <div class="slider-loop projects-slider splide splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized" id="splide01" role="region" aria-roledescription="carousel">
                        <div class="splide__track splide__track--slide splide__track--ltr splide__track--draggable" id="splide01-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                           <?php if ( have_rows( 'rep_proj', false ) ) : ?>
                           <div class="splide__list" id="splide01-list" role="presentation" style="transform: translateX(0px);">
                              <?php while ( have_rows( 'rep_proj', false ) ) : the_row(); ?>
                              <div class="splide__slide wp-slide is-active is-visible" id="splide01-slide01" role="group" aria-roledescription="slide" aria-label="1 of 13" style="width: calc(83.3333%);">
                                 <div class="slide-inner wp-slide-inner cursor-hover">
                                    <div class="wp-slide-card-image"><img src="<?php echo get_sub_field( 'img' ); ?>" loading="eager" alt="" class="image-cover"></div>
                                    <div class="project-slide-bottom">
                                       <div class="text-18 is-opacity-60"><?php echo get_sub_field( 'data' ); ?></div>
                                       <div class="slider-card-info">
                                          <div class="text-20 mob-18"><?php echo get_sub_field( 'zagolovok' ); ?></div>
                                          <div class="text-18 is-opacity-60"><?php echo get_sub_field( 'descr' ); ?></div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <?php endwhile; ?>
                           </div>
                           <?php endif; ?>
                        </div>
                        <div class="code-embed-4 w-embed">
                           <div class="my-slider-progress">
                              <div class="my-slider-progress-bar" style="width: 7.69231%;"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section about-s5-section">
               <div class="container">
                  <div class="heading-wrap scrollobs">
                     <h2 class="h1"><?php echo get_field( 'osn_zag', false ); ?></h2>
                  </div>
                  <div class="content-block about-s5-content-block scrollobs">
                     <p class="text-16 cons-team-top-text max-w-352"><?php echo get_field( 'osn_descr', false ); ?></p>
                     <div class="team-tabs">
                        <?php if ( have_rows( 'osnovateli', false ) ) : ?>
                        <div class="team-tabs-content">
                           <?php while ( have_rows( 'osnovateli', false ) ) : the_row(); ?>
                           <div class="team-tab-pane active">
                              <div class="team-tab-info">
                                 <div class="team-tab-image"><img class="image-cover a" src="<?php echo get_sub_field( 'izobrazhenie' ); ?>" alt="" loading="eager"></div>
                                 <div class="team-tab-info-bottom">
                                    <div class="team-tab-person">
                                       <div class="text-neue-18 is-uppercase _16-tab"><?php echo get_sub_field( 'imya_i_familiya' ); ?></div>
                                       <div class="text-16 is-opacity-60 _14-tab"><?php echo get_sub_field( 'dolzhnost' ); ?></div>
                                    </div>
                                    <div class="text-18 _14-tab"><?php echo get_sub_field( 'opisanie' ); ?></div>
                                 </div>
                              </div>
                           </div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                        <?php if ( have_rows( 'osnovateli', false ) ) : ?>
                        <div data-lenis-prevent="" class="team-tabs-menu">
                           <?php while ( have_rows( 'osnovateli', false ) ) : the_row(); ?>
                           <div class="team-tab-link active" data-scroll="2027.3573513031006"><img class="image-cover cursor-hover a" src="<?php echo get_sub_field( 'izobrazhenie_mob' ); ?>" alt="" loading="lazy"></div>
                           <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                     </div>
                  </div>
               </div>
            </section>
           <section class="section about-s6-section">
               <div class="container">
                  <div class="heading-wrap about-s6-heading-wrap scrollobs">
                     <?php if ( ! empty( get_field( 's-cont-head', false ) ) ) : ?>
                     <h2 class="h1"><?php echo get_field( 's-cont-head', false ); ?></h2>
                     <?php endif; ?>
                  </div>
                  <div class="content-block about-s6-content-block">
                     <div class="about-s6-image scrollobs"><img src="<?php echo get_field( 's-cont-img', false ); ?>" loading="lazy" alt="" class="image-cover"></div>
                     <div class="about-s6-content scrollobs">
                        <?php if ( ! empty( get_field( 's-cont-p', false ) ) ) : ?>
                        <div class="text-20 _14-tab max-w-300-mob"><?php echo get_field( 's-cont-p', false ); ?></div>
                        <?php endif; ?>
                        <div class="about-s6-contacts-row">
                           <div class="about-s6-contact-box about-s6-contact-box1">
                              <?php if ( ! empty( get_field( 'podpis_1_oj_ssylki', false ) ) ) : ?>
                              <div class="text-14 is-opacity-60 is-uppercase"><?php echo get_field( 'podpis_1_oj_ssylki', false ); ?></div>
                              <?php endif; ?><?php $link = get_field( 'podpis_1_oj_ssylki_ss', false );
                                 if ( ! empty( $link ) ) :
                                 			$url = $link['url'];
                                 			$title = $link['title'];
                                 			$target = $link['target'] ? $link['target'] : '_self'; 
                                 		?>
                              <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="text-neue-44 is-link" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                           </div>
                           <div class="about-s6-contact-box">
                              <?php if ( ! empty( get_field( 'podpis_2_oj_ssylki', false ) ) ) : ?>
                              <div class="text-14 is-opacity-60 is-uppercase"><?php echo get_field( 'podpis_2_oj_ssylki', false ); ?></div>
                              <?php endif; ?><?php $link = get_field( 'podpis_2_oj_ssylki_ss', false );
                                 if ( ! empty( $link ) ) :
                                 			$url = $link['url'];
                                 			$title = $link['title'];
                                 			$target = $link['target'] ? $link['target'] : '_self'; 
                                 		?>
                              <a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="text-neue-44 is-link"><?php echo esc_html( $title ); ?></a><?php endif; ?>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section class="section prefooter-section about-prefooter">
               <div class="container">
                  <div class="content-block mag-telegram-content-block scrollobs">
                     <div class="text-24 _18-tab">Смотрите далее</div>
                     <a href="/b2b" class="prefooter-link cursor-hover w-inline-block">
                        <div class="h1">Бизнес-<br>сопровождение</div>
                        <div class="prefooter-link-icon">
                           <div class="svg w-embed">
                              <svg width="100%" style="" viewBox="0 0 78 79" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M35.7134 3.44387L35.9209 3.23633L50.0201 3.23633L78.0002 31.2164V47.0982L50.0201 75.0782H35.9209L35.7134 74.8707L66.2939 44.2902L0 44.2902V34.0271L66.2966 34.0271L35.7134 3.44387Z" fill="currentColor"></path>
                              </svg>
                           </div>
                        </div>
                     </a>
                  </div>
               </div>
            </section>
            <div class="serv12rem"></div>
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
            <div data-w-id="c6a75421-3296-aff3-c94d-f3107a546d49" class="cursor-holder" style="will-change: transform; transform: translate3d(43.477vw, 48.095vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
               <div class="vimeo-cursor">
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
      
       </div>
      </div>
		
		
		
		
		
		
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
