<?php
/*
Template name: Журнал BKSQ №3(13) «Другие миры‎»‎
*/
?>
    <!DOCTYPE html>
<html data-wf-page="6704f17061cf6aa78bd63b27" data-wf-site="6704f17061cf6aa78bd63b0e">
	<?php get_template_part("header_block", ""); ?>
	<body class="body magazine-body">
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
		<div class="page-wrap">
			<div class="main-wrap">
				<section class="section magazine-hero-section is-mag3-bg">
					<div class="container">
						<div class="hero-content magazine-hero-content">
							<div class="magazine-hero-caption">
								<div class="text-18 mob-18">BKSQ №3      Другие миры</div>
							</div>
							<div class="mag1-hero-heading">
								<h1 class="h1 magazine-h1">Как      мы      перестали понимать мир   — <br>как      нам понимать      мир</h1>
							</div>
						</div>
					</div>
				</section>
				<section class="section magazine-s2-section">
					<div class="container">
						<div class="content-block magazine-s2-content-block">
							<div class="magazine-s2-left-col scrollobs">
								<div class="gap-8 magazine-s2-text-box">
									<p class="text-16 is-opacity-60 _14-tab">Релиз</p>
									<p class="text-16 _14-tab">ноябрь 2024</p>
								</div>
								<div class="gap-8 magazine-s2-text-box">
									<p class="text-16 is-opacity-60 _14-tab">Полосность</p>
									<p class="text-16 _14-tab">289</p>
								</div>
								<div class="gap-8 magazine-s2-text-box">
									<p class="text-16 is-opacity-60 _14-tab">Вес</p>
									<p class="text-16 _14-tab">1440 гр</p>
								</div>
								<div class="gap-8 magazine-s2-text-box">
									<p class="text-16 is-opacity-60 _14-tab">формат</p>
									<p class="text-16 _14-tab">230 х 310 мм</p>
								</div>
								<div class="button-wrap magazine-s2-left-button-wrap"><a href="#tochki-prodazh" class="dot-link magazine-button w-inline-block"><div class="text-16">Точки продаж</div></a>
									<div class="button-wrap n-mob"><a href="#" class="dot-link underlined-link w-inline-block"><div class="text-18">Превью номера</div><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt class="image"></a></div>
								</div>
							</div>
							<div class="magazine-s2-image-column"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63bb6_magazine3.avif" loading="lazy" alt class="image-contain image-cover"></div>
							<div class="magazine-s2-right-col scrollobs">
								<p class="text-neue-44">BKSQ №3</p>
								<p class="text-16 _14-tab">Другие миры: в процессе погружения в мир цифрового искусства и воображаемых вселенных, оказалось, что сквозной линией номера стала философия, или теория, как принято ее называть</p>
								<div class="button-wrap hidden-tab"><a href="#tizer" class="dot-link underlined-link w-inline-block"><div class="text-18">Превью номера</div><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt class="image"></a></div>
								<div class="button-wrap magazine-s2-right-button-wrap"><a href="#" class="dot-link magazine-button w-inline-block"><div class="text-16">Точки продаж</div></a>
									<div class="button-wrap"><a href="#" class="dot-link underlined-link w-inline-block"><div class="text-18">Превью номера</div><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt class="image"></a></div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section class="section magazine-s3-section">
					<div class="container">
						<div class="heading-wrap mag1-s3-heading-wrap">
							<h2 class="h1 magazine-h1 scrollobs">Художники    долгое время старались       изменить мир; может быть, сейчас дело заключается в том,       чтобы <br>объяснить    его</h2>
							<div class="magazine-s3-quote-info-box mag3-s3-quote-info-box-copy scrollobs">
								<div class="ms3-info-line"></div>
								<div class="ms-info-text-box">
									<div class="text-24 _16-tab">Анзор Канкулов</div>
									<div class="text-18 is-opacity-60 _14-tab">Главный редактор Black Square</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="tizer" class="section magazine-s4-section">
					<div class="container">
						<div class="content-block ms4-content-block">
							<div class="ms4-left">
								<div class="ms-4-left-top">
									<div class="mag-s4-capture scrollobs">
										<p class="text-16 _14-tab">100 — 113</p>
										<p class="text-16 _14-tab capture-text">Игорь Самолет</p>
									</div>
									<div class="heading-wrap ms4-heading-wrap scrollobs">
										<h2 class="text-neue-44">Не важно, что ты делаешь — <br>ты делаешь это в исторических обстоятельствах</h2>
									</div>
								</div>
								<div class="ms-4-left-bottom">
									<div class="ms4-text-grid scrollobs">
										<p class="text-16 _14-tab">ЭТОТ НОМЕР Black Square был задуман как выпуск про искусство и технологии. От Юига, Джона Рафмана и Михаила Максимова до Plague и Саши Стайлз, мы хотели рассмотреть, как цифровые технологии, цифровой мир влияют на искусство - точнее, как искусство пытается осмыслить их влияние на общество, использовать их, и как оно само меняется во взаимодействии с программами, алгоритмами и виртуальными реальностями.</p>
										<p id="w-node-_95efbdf8-9de4-0953-a3fa-65e655080c1e-8bd63b27" class="text-16 _14-tab">В ПРОЦЕССЕ того, как мы погружались в мир цифрового искусства и воображаемых вселенных, оказалось, что сквозной линией номера стала философия, или теория, как принято ее называть.<br><br>И, КОНЕЧНО, в этом номере есть герои, творчество и деятельность которых может пересекаться или нет с обозначенными темами и поворотами, но без работ, выставок, личностей Игоря Самолета, Ирины Петраковой или Саймона де Пюри нельзя представить поле современного искусства.</p>
									</div>
									<p class="text-14 is-opacity-60 is-uppercase scrollobs">Из письма главного редактора Black Square, <br>Анзора Канкулова</p>
								</div>
							</div>
							<div class="ms4-right scrollobs">
								<div class="ms4-image-box cursor-hover"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7f_mag3-s4.avif" loading="lazy" alt class="ms4-image"></div>
							</div>
						</div>
					</div>
				</section>
				<section class="section magazine-s5-section">
					<div class="container">
						<div class="content-block ms5-content-block">
							<div class="ms5-box cursor-hover scrollobs">
								<div class="ms5-image-row">
									<div class="ms5-image ms5-image-double"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7b_ms5-3-1.avif" loading="lazy" alt class="image-cover"></div>
								</div>
								<div class="ms5-box-bottom">
									<div class="ms5-box-bottom-left mw-278">
										<p class="text-16 is-opacity-60 is-uppercase">Лейсан Ибатуллина, фотограф + Екатерина Павелко, редактор моды</p>
										<p class="text-16">Съемка Муси Тотибадзе для Black Square</p>
									</div>
									<div class="ms5-box-bottom-right">
										<p class="text-16 _14-tab _2">192 — 207</p>
									</div>
								</div>
							</div>
							<div class="ms5-box cursor-hover scrollobs">
								<div class="ms5-image-row">
									<div class="ms5-image ms5-image-double"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7e_ms5-3-2.avif" loading="lazy" alt class="image-cover"></div>
									<div class="ms5-image ms5-image-double"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b81_ms5-3-3.avif" loading="lazy" alt class="image-cover"></div>
								</div>
								<div class="ms5-box-bottom">
									<div class="ms5-box-bottom-left mw-550">
										<p class="text-16 is-opacity-60 is-uppercase">Арина Окунь</p>
										<p class="text-16 _14-tab">Саймон де Пюри, «умеющий сделать из аукциона саспенс и триллер, сам стал героем фильма» – интервью для BKSQ</p>
									</div>
									<div class="ms5-box-bottom-right">
										<p class="text-16 _14-tab _2">154 — 159</p>
									</div>
								</div>
							</div>
							<div class="ms5-box cursor-hover scrollobs">
								<div class="ms5-image-row">
									<div class="ms5-image"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b79_ms5-3-4.avif" loading="lazy" alt class="image-cover"></div>
									<div class="ms5-image ms5-image-double"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7a_ms5-3-5.avif" loading="lazy" alt class="image-cover"></div>
								</div>
								<div class="ms5-box-bottom">
									<div class="ms5-box-bottom-left mw-433">
										<p class="text-16 is-opacity-60 is-uppercase">Портфолио</p>
										<p class="text-16 _14-tab">Вилли Вандерперр, «Prints, films, a rave and more…»</p>
									</div>
									<div class="ms5-box-bottom-right">
										<p class="text-16 _14-tab _2">246 — 255</p>
									</div>
								</div>
							</div>
							<div class="ms5-box cursor-hover scrollobs">
								<div class="ms5-image-row">
									<div class="ms5-image ms5-image-double"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7d_ms5-3-6.avif" loading="lazy" alt class="image-cover"></div>
									<div class="ms5-image"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7c_ms5-3-7.avif" loading="lazy" alt class="image-cover"></div>
								</div>
								<div class="ms5-box-bottom">
									<div class="ms5-box-bottom-left mw-433">
										<p class="text-16 _14-tab">Вивиан Сассен – снимки, которые живут на грани между искусством и модой, между интимным и «журнальным»</p>
									</div>
									<div class="ms5-box-bottom-right">
										<p class="text-16 _14-tab _2">48 — 53</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section class="section">
					<div class="vimeo-cursor-hover">
						<div data-w-id="3b21dbcf-607c-b553-4500-0e2ad8e6b99e" class="container full-width-container"><a style="-webkit-transform:translate3d(0, 0, 0) scale3d(0.7, 0.7, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 0, 0) scale3d(0.7, 0.7, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 0, 0) scale3d(0.7, 0.7, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 0, 0) scale3d(0.7, 0.7, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)" href="https://vimeo.com/user225032781" target="_blank" class="video-block w-inline-block"><div class="mag-video"><div data-poster-url="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/673f19642ec0cf7e16a9b8ba_IMG_2222 (video-convertercom)-poster-00001.jpg" data-video-urls="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/673f19642ec0cf7e16a9b8ba_IMG_2222 (video-convertercom)-transcode.mp4,https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/673f19642ec0cf7e16a9b8ba_IMG_2222 (video-convertercom)-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" class="background-video w-background-video w-background-video-atom"><video id="b5aaad9e-2f65-0eee-e80f-b1c24c26226c-video" autoplay loop style='background-image:url("https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/673f19642ec0cf7e16a9b8ba_IMG_2222 (video-convertercom)-poster-00001.jpg")' muted playsinline data-wf-ignore="true" data-object-fit="cover"><source src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/673f19642ec0cf7e16a9b8ba_IMG_2222 (video-convertercom)-transcode.mp4" data-wf-ignore="true"></source><source src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/673f19642ec0cf7e16a9b8ba_IMG_2222 (video-convertercom)-transcode.webm" data-wf-ignore="true"></source></video></div></div></a></div>
					</div>
				</section>
				<section id="tochki-prodazh" class="section magazine-s6-section is-mag3-bg">
					<div class="container">
						<div class="heading-wrap ms6-heading-wrap scrollobs">
							<h2 class="h1">Розничные точки<br>BKSQ</h2>
						</div>
						<div class="content-block mag-map-content-block scrollobs">
							<div class="w-embed w-script">
								<section class="map-section">
									<div class="map-section__wrapper">
										<script>
					window.locations = [
						{
							coordinates: [37.601522, 55.727997],
							iconSrc: '/assets/marker.svg',
							title: 'Музей "Гараж"',
							address: 'ул. Крымский Вал, 9 стр. 32',
							city: 'Москва',
							linkToShop:
								'https://shop.garagemca.org/ru/books/magazines-and-newspapers/black-square-12023-43841.html',
							categories: ['Где купить'],
						},
            {
							coordinates: [37.614285, 55.766962],
							iconSrc: '/assets/marker.svg',
							title: 'ММОМА',
							address: 'ул. Петровка, 25',
              
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.601522, 55.727997],
							iconSrc: '/assets/marker.svg',
							title: 'Музей "Гараж"',
							address: 'ул. Крымский Вал, 9 стр. 32',
							additionalInfo: 'По читательскому абонементу',
							city: 'Москва',
							categories: ['Где почитать'],
						},
						{
							coordinates: [37.581164, 55.757111],
							iconSrc: '/assets/marker.svg',
							title: 'Музей "Гараж"',
							address: 'Новинский Бульвар, д. 25',
							city: 'Москва',
							linkToShop:
								'https://shop.garagemca.org/ru/books/magazines-and-newspapers/black-square-12023-43841.html',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.564608, 55.770304],
							iconSrc: '/assets/marker.svg',
							title: 'Центр «Зотов»',
							address: 'Ходынская улица, 2с1',
							city: 'Москва',
							linkToShop: 'https://shop.centrezotov.ru/brands/black-squre',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.607868, 55.789568],
							iconSrc: '/assets/marker.svg',
							title: 'Еврейский музей и центр толерантности',
							address: 'ул. Образцова, 11 стр. 1А',
							city: 'Москва',
							linkToShop:
								'https://www.jewish-museum.ru/museum-shop/catalog/iskusstvo/zhurnal-black-square/?sphrase_id=101278',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.593435, 55.771899],
							iconSrc: '/assets/marker.svg',
							title: 'Книжный магазин «Москва»',
							address: 'ул. Тверская, 8 стр. 1',
							city: 'Москва',
							linkToShop: 'https://www.moscowbooks.ru/book/1174949/',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.591171, 55.763346],
							iconSrc: '/assets/marker.svg',
							title: 'Masters Вookstore',
							address: 'Малый Патриарший пер. 5 стр. 1',
							city: 'Москва',
							linkToShop:
								'https://www.masters-bookstore.ru/tproduct/666665389-159993251481-zhurnal-black-square-1',
							categories: ['Где купить', 'Где почитать'],
						},
						{
							coordinates: [37.62784, 55.737785],
							iconSrc: '/assets/marker.svg',
							title: 'Lebigmag в пространстве «Рихтер»',
							address: 'ул. Пятницкая, 42',
							city: 'Москва',
							linkToShop: 'https://lebigmag.ru/search/?q=black+square',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.640659, 55.761619],
							iconSrc: '/assets/marker.svg',
							title: 'Магазин «Перспектива»',
							address: 'Потаповский пер. 5 стр. 2',
							city: 'Москва',
							linkToShop:
								'https://perspektiva.film/booksandzines/tproduct/378275413-825723720551-zhurnal-black-square-1-2023-novaya-geogr',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.628271, 55.752972],
							iconSrc: '/assets/marker.svg',
							title: 'Lobby Moscow',
							address: 'ул. Варварка, 3',
							city: 'Москва',
							linkToShop:
								'https://lobby.moscow/ru/store/product/black-square-1',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.673007, 55.77235],
							iconSrc: '/assets/marker.svg',
							title: 'Elohovskiy Gallery',
							address: 'Елоховский пр-д, 1 стр. 2',
							city: 'Москва',
							linkToShop:
								'https://elohovskiy.gallery/shop?tfc_sort[512670738]=created:desc&tfc_query[512670738]=black+square&tfc_div=',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.539114, 55.738485],
							iconSrc: '/assets/marker.svg',
							title: 'The Dar Store',
							address: 'ул. Студенческая, 39',
							city: 'Москва',
							linkToShop: 'https://thedar.store/search/?q=black+square',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.609353, 55.751264],
							iconSrc: '/assets/marker.svg',
							title: 'Российская государственная библиотека',
							address: 'ул. Воздвиженка, 3/5',
							additionalInfo: 'По читательскому абонементу',
							city: 'Москва',
							categories: ['Где почитать'],
						},
						{
							coordinates: [37.609586, 55.754568],
							iconSrc: '/assets/marker.svg',
							title: 'Noôdome',
							address: 'Романов пер., д.4, стр.2',
							additionalInfo: 'Вход доступен для членов клуба',
							city: 'Москва',
							categories: ['Где почитать'],
						},
						{
							coordinates: [30.325875, 59.9358],
							iconSrc: '/assets/marker.svg',
							title: 'Магазин «Дом Книги»',
							address: 'Невский проспект, 28',
							linkToShop: 'https://dk-spb.ru/books/240540',
							city: 'Санкт-Петербург',
							categories: ['Где купить'],
						},
						{
							coordinates: [30.284256, 59.965408],
							iconSrc: '/assets/marker.svg',
							title: 'Masters Вookstore',
							address: 'ул. Барочная, 6 стр. 1',
							linkToShop:
								'https://www.masters-bookstore.ru/tproduct/666665389-159993251481-zhurnal-black-square-1',
							city: 'Санкт-Петербург',
							categories: ['Где купить'],
						},
						{
							coordinates: [30.347686, 59.934786],
							iconSrc: '/assets/marker.svg',
							title: 'Подписные издания',
							address: 'Литейный проспект, 57',
							linkToShop:
								'https://www.podpisnie.ru/books/zhurnal-black-square/',
							city: 'Санкт-Петербург',
							categories: ['Где купить'],
						},
						{
							coordinates: [30.285793, 59.965647],
							iconSrc: '/assets/marker.svg',
							title: 'Garage Bookshop',
							address: 'наб. Адмиралтейского канала, 2Т',
							linkToShop:
								'https://shop.garagemca.org/en/books/magazines-and-newspapers/black-square-12023-43841.html',
							city: 'Санкт-Петербург',
							categories: ['Где почитать', 'Где купить'],
						},
						{
							coordinates: [30.285793, 59.965647],
							iconSrc: '/assets/marker.svg',
							title: 'Библиотека Музея "Гараж"',
							address: 'наб. Адмиралтейского канала, 2Т',
							linkToShop:
								'https://shop.garagemca.org/en/books/magazines-and-newspapers/black-square-12023-43841.html',
							city: 'Санкт-Петербург',
							categories: ['Где почитать', 'Где купить'],
						},
						{
							coordinates: [34.768143, 32.067086],
							iconSrc: '/assets/marker.svg',
							title: 'Center for Contemporary Art',
							address: 'Tsadok ha-Cohen St 2a, Tel Aviv-Yafo, Израиль',
							additionalInfo: 'Только оффлайн',
							city: 'Тель-Авив',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.599516, 55.764642],
							iconSrc: '/assets/marker.svg',
							title: 'pop/off/art 2.0',
							address: 'Большой Палашёвский переулок, 9',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [92.83942, 56.009788],
							iconSrc: '/assets/marker.svg',
							title: 'Бакен',
							address: 'пр. Мира, 115А',
							additionalInfo: 'Только оффлайн',
							city: 'Красноярск',
							categories: ['Где купить'],
						},
						{
							coordinates: [30.370863, 59.929078],
							iconSrc: '/assets/marker.svg',
							title: 'L.E.Store Gallery',
							address: 'Невский проспект, 146',
							additionalInfo: 'Только оффлайн',
							city: 'Санкт-Петербург',
							categories: ['Где купить'],
						},
						{
							coordinates: [30.342099, 59.939915],
							iconSrc: '/assets/marker.svg',
							title: 'KGallery Bookcafe',
							address: 'набережная реки Фонтанки, 24',
							additionalInfo: 'Только оффлайн',
							city: 'Санкт-Петербург',
							categories: ['Где купить'],
						},
						{
							coordinates: [49.103683, 55.788338],
							iconSrc: '/assets/marker.svg',
							title: 'Книжный магазин «Смена»',
							address: 'улица Бурхана Шахиди, 7',
							additionalInfo: 'Только оффлайн',
							city: 'Казань',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.612173, 54.191136],
							iconSrc: '/assets/marker.svg',
							title: 'Кластер «Октава»',
							address: 'Центральный переулок, 18',
							additionalInfo: 'Только оффлайн',
							city: 'Тула',
							categories: ['Где купить'],
						},
						{
							coordinates: [54.191136, 37.612173],
							iconSrc: '/assets/marker.svg',
							title: 'ММОМА на Петровке',
							address: 'ул. Петровка, 25',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.635772, 55.757805],
							iconSrc: '/assets/marker.svg',
							title: 'ЦСИ AZ/ART',
							address: 'ул. Маросейка, 11/4 стр. 1',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.600945, 55.766825],
							iconSrc: '/assets/marker.svg',
							title: 'Книжный магазин «Фламмеманн»',
							address: 'ул. Тверская, 23 стр. 1',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.622271, 55.731024],
							iconSrc: '/assets/marker.svg',
							title: 'Lumiere Gallery',
							address: 'ул. Большая полянка, д.61 стр. 1',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.63411, 55.765139],
							iconSrc: '/assets/marker.svg',
							title: 'Sistema Gallery',
							address: 'Бобров пер. 4 стр. 3',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.023633, 55.811801],
							iconSrc: '/assets/marker.svg',
							title: 'TŌMO',
							address: 'MO, дер. Покровское, ул. Центральная, д. 33',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.649139, 55.742904],
							iconSrc: '/assets/marker.svg',
							title: 'Чехов и компания',
							address: 'Гончарная улица, 26к1',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates:  [37.594028, 55.758402],
							iconSrc: '/assets/marker.svg',
							title: 'Пиотровский',
							address: 'Малая Никитская ул., 12, стр. 12',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.61273, 55.742651],
							iconSrc: '/assets/marker.svg',
							title: 'ГЭС-2',
							address: 'Болотная набережная, 15с10',
							additionalInfo: 'Только оффлайн',
							city: 'Москва',
							categories: ['Где купить'],
						},
						{
							coordinates: [37.333811, 55.657213],
							iconSrc: '/assets/marker.svg',
							title: 'Библиотека Дома творчества ',
							address: 'ДСК Мичуринец, поселение Внуковское, ул. Погодина, 4.',
							city: 'Переделкино',
							categories: ['Где почитать'],
						},
						{
							coordinates: [40.447939, 56.418517],
							iconSrc: '/assets/marker.svg',
							title: 'МИРА центр',
							address: 'Кремлёвская улица, 5',
							city: 'Суздаль',
							categories: ['Где почитать'],
						},
						{
							coordinates: [60.591438, 56.844894],
							iconSrc: '/assets/marker.svg',
							title: 'Пиотровский',
							address: 'ул. Бориса Ельцина, д. 3',
							additionalInfo: 'Только оффлайн',
							city: 'Екатеринбург',
							categories: ['Где купить'],
						},
					];
				
										
										</script>
										<form class="filter-form">
<select name="city" data-custom="select">
</select>
											<div class="switcher">
<input type="radio" name="switcher" id="switcher1" class="switcher__checkbox sr-only" value="Где купить" checked> 
<label for="switcher1" class="switcher__label">Где купить</label> 
<input type="radio" name="switcher" id="switcher2" class="switcher__checkbox sr-only" value="Где почитать"> 
<label for="switcher2" class="switcher__label">Где почитать</label></div>
										</form>
										<div id="map" class="map"></div>
									</div>
								</section>
							</div>
						</div>
						<div class="content-block magazine-s6-content-block scrollobs">
							<div class="ms6-left">
								<div class="text-18 mob-18">заказать журнал Black Square в онлайн-магазинах</div>
							</div>
							<div class="ms6-right">
								<div class="ms6-link-wrap"><a href="#" class="ms6-arrow-link w-inline-block"><div class="text-neue-44 h-90">Ozon</div><div class="ms6-link-arrow"><div class="svg w-embed"><svg width="100%" style viewbox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.6522 1.20666L14.7378 1.12109L20.5213 1.12109L32.0005 12.6003V19.1164L20.5221 30.5948H14.7369L14.6522 30.5101L27.1981 17.9643L0 17.9643V13.7537L27.1993 13.7537L14.6522 1.20666Z" fill="currentColor"></path></svg></div></div></a>
									<div class="ms6-link-divider"></div><a href="#" class="ms6-arrow-link w-inline-block"><div class="text-neue-44 h-90">Nuself</div><div class="ms6-link-arrow"><div class="svg w-embed"><svg width="100%" style viewbox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.6522 1.20666L14.7378 1.12109L20.5213 1.12109L32.0005 12.6003V19.1164L20.5221 30.5948H14.7369L14.6522 30.5101L27.1981 17.9643L0 17.9643V13.7537L27.1993 13.7537L14.6522 1.20666Z" fill="currentColor"></path></svg></div></div></a></div>
								<div class="button-wrap"><a href="#" class="dot-link underlined-link viewallpop w-inline-block"><div class="text-18">Посмотреть все</div><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt class="image"></a></div>
							</div>
						</div>
					</div>
				</section>
				<section class="section magazine-s7-section">
					<div class="container">
						<div class="heading-wrap s2-heading-wrap scrollobs">
							<h2 class="h1">Корпоративная покупка журнала BKSQ</h2>
						</div>
						<div class="content-block ms7-content-block scrollobs">
							<div class="ms7-left">
								<p class="text-16 _14-tab x1920-18">Журнал Black Square — коллекционное издание об искусстве. Качественный гид по событиям и явлениям моды, фотографии, кино и арт-рынка идеально подходит не только для домашнего чтения, но и для корпоративного подарка ценным партнерам и сотрудникам,  а также для выкладки <br>в VIP-лаунжах, приемных и переговорных.<br><br>Пристальное исследование культурных явлений доступным языком говорит о сложном и важном, эксклюзивный дизайн отвечает самым высоким эстетическим запросам. Журнал выходит лимитированным тиражом несколько раз в год. </p><a href="mailto:welcome@bksq.art" class="text-18 is-link">welcome@bksq.art</a></div>
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
									<form id="email-form" name="email-form" data-name="Email Form" method="get" class="mag-form" data-wf-page-id="6704f17061cf6aa78bd63b27" data-wf-element-id="213c9fcc-fb22-a40b-3350-0b2eda1d94cb">
										<div class="form-field-wrap">
<label for="name-2" class="field-label">Имя</label>
<input class="text-field w-input" maxlength="256" name="field" data-name="Имя" placeholder type="text" id="name"></div>
										<div id="w-node-_213c9fcc-fb22-a40b-3350-0b2eda1d94d0-8bd63b27" class="form-field-wrap">
<label for="phone-2" class="field-label">Tелефон</label>
<input class="text-field w-input" maxlength="256" name="field" data-name="Телефон" placeholder type="tel" id="phone" required></div>
										<div id="w-node-_213c9fcc-fb22-a40b-3350-0b2eda1d94d4-8bd63b27" class="form-field-wrap">
<label for="email-3" class="field-label">Email</label>
<input class="text-field w-input" maxlength="256" name="email-2" data-name="Email 2" placeholder type="email" id="email-2" required></div>
										<div id="w-node-_213c9fcc-fb22-a40b-3350-0b2eda1d94d8-8bd63b27" class="form-field-wrap">
<label for="releases" class="field-label">Выпуски</label>
											<div class="w-embed">
<select id="releases" name="releases" data-name="releases" required multiple class="hidden-select w-select"> <option value="№1   Новая география">№1 Новая география</option> <option value="№2  Память—Архив—Коллекция">№2 Память—Архив—Коллекция</option> <option selected value="№3  Другие миры">№3 Другие миры</option> 
</select></div>
											<div data-hover="false" data-delay="0" class="form-dropdown w-dropdown">
												<div class="form-dropdown-toggle w-dropdown-toggle">
													<div class="form-drop-toggle-content">
														<div class="text-24 is-drop-placeholder">№1   Новая география</div>
														<div class="form-drop-toggle-icon">
															<div class="svg w-embed">
																<svg width="100%" style viewbox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																	<path d="M10 0L10 10L-4.37114e-07 10L10 0Z" fill="currentColor"></path>
																</svg>
															</div>
														</div>
													</div>
												</div>
												<nav class="form-drop-list w-dropdown-list">
													<div class="form-drop-list-content">
														<div class="form-drop-link is-active1">
															<div class="text-18 minw-36">№1   Новая география</div>
														</div>
														<div class="form-drop-link">
															<div class="text-18 minw-36">№2  Память—Архив—Коллекция</div>
														</div>
														<div class="form-drop-link">
															<div class="text-18 minw-36">№3  Другие миры</div>
														</div>
													</div>
												</nav>
											</div>
										</div>
										<div id="w-node-_213c9fcc-fb22-a40b-3350-0b2eda1d94ee-8bd63b27" class="form-field-wrap numeric">
<label for="quantity" class="field-label">Кол-во экземпляров</label>
<input class="text-field num w-input" maxlength="256" name="field" inputmode="numeric" data-name="Кол-во экземпляров" placeholder type="number" id="quantity"></div>
										<div id="w-node-_213c9fcc-fb22-a40b-3350-0b2eda1d94f2-8bd63b27" class="form-field-wrap">
<label for="comment-2" class="field-label">Комментарий</label>
<textarea class="text-area w-input" data-lenis-prevent maxlength="5000" name="field" data-name="Комментарий" placeholder id="comment"></textarea></div>
										<div id="w-node-_213c9fcc-fb22-a40b-3350-0b2eda1d94f6-8bd63b27" class="form-field-wrap">
<label class="w-checkbox checkbox-field"><div class="w-checkbox-input w-checkbox-input--inputType-custom checkbox" for="policy"></div>
<input type="checkbox" name id="policy" data-name="Политика" required style="opacity:0;position:absolute;z-index:-1"><span class="text-16 policy-label w-form-label" for="policy">Нажимая кнопку "Оставить заявку", вы даете свое согласие на обработку изложенных в настоящей форме персональных данных на условиях <a href="#" class="text-link">Политики обработки персональных данных</a></span></label></div>
										<div class="submit-wrap">
<input type="submit" data-wait="Оставить заявку" class="submit-button w-button" value="Оставить заявку"><a href="#" class="submit-button dot-link w-inline-block"><div class="text-18 mob-18">Оставить заявку</div></a></div>
									</form>
									<div class="w-form-done">
										<div>Спасибо! Ваша заявка получена!</div>
									</div>
									<div class="w-form-fail">
										<div>Oops! Something went wrong while submitting the form.</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section class="section s3-section">
					<div class="container">
						<div class="content-block scrollobs">
							<div class="book-polka w-embed">
								<div class="book-slider">
									<div class="book-slider__container"><a href="/magazine-1" class="book-slider__slide book book--3 cursor-hover" style="background-image:url(https://cdn.prod.website-files.com/66d1698fdc27186621477475/66ed75a656475b6caeaec675_g3.avif)"> <div class="book__root" style="background-image:url(https://cdn.prod.website-files.com/66d1698fdc27186621477475/66ed7242b04f9cbfa6c6ced4_Frame 157.avif)"></div> <div class="book_shadow"></div></a> <a href="/magazine-2" class="book-slider__slide book book--2 cursor-hover" style="background-image:url(https://cdn.prod.website-files.com/66d1698fdc27186621477475/66ed75a6a958285f28a7a231_g2.avif)"> <div class="book__root" style="background-image:url(https://cdn.prod.website-files.com/66d1698fdc27186621477475/66ed72429aa01594e74e69d1_Frame 34271h.avif)"></div> <div class="book_shadow"></div> </a> <a href="/magazine-3" class="book-slider__slide book book--1 cursor-hover" style="background-image:url(https://cdn.prod.website-files.com/66d1698fdc27186621477475/66ed75a6a958285f28a7a251_g1.avif)"> <div class="book__root" style="background-image:url(https://cdn.prod.website-files.com/66d1698fdc27186621477475/66ed7242823d0a6786f6cf21_Frame 34271.avif)"></div> <div class="book_shadow"></div> </a></div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section class="section prefooter-section">
					<div class="container">
						<div class="content-block mag-telegram-content-block scrollobs">
							<div class="text-24 _18-tab">Смотрите далее</div><a href="https://t.me/bksqart" target="_blank" class="prefooter-link cursor-hover w-inline-block"><div class="h1">Телеграм</div><div class="prefooter-link-icon"><div class="svg w-embed"><svg width="100%" style viewbox="0 0 78 79" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M35.7134 3.44387L35.9209 3.23633L50.0201 3.23633L78.0002 31.2164V47.0982L50.0201 75.0782H35.9209L35.7134 74.8707L66.2939 44.2902L0 44.2902V34.0271L66.2966 34.0271L35.7134 3.44387Z" fill="currentColor"></path></svg></div></div></a></div>
					</div>
				</section>
			</div>
			<div class="div-block-5">
				<div class="div-block-6">
					<div class="div-block-7">
						<div class="p-36-31">Релиз журнала Black Square №3 «Другие миры‎»‎ в ноябре 2024 года</div>
						<div class="op05">«Этот номер журнала Black Square был задуман как выпуск про искусство и технологии. <…> В процессе того, как мы погружались в мир цифрового искусства и воображаемых вселенных, оказалось, что сквозной линией номера стала философия, или теория, как принято ее называть‎», — из письма главного редактора Анзора Канкулова</div>
					</div>
					<div class="button-wrap"><a href="/magazine2" class="dot-link underlined-link rev w-inline-block"><div class="text-18">Выпуск №2</div><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63bc8_Arrow.svg" loading="lazy" alt class="image rev"></a></div>
				</div>
			</div>
			<section class="section footer-section">
				<div class="container footer-container">
					<div class="footer-content">
						<div class="footer-left">
							<div class="footer-left-top">
								<div class="text-14 is-opacity-60">контакты</div>
								<div data-acf-context="option" data-acf="llc_ooo" class="text-14">ООО "Артмедиа Групп"</div>
								<div data-acf-context="option" data-acf="adress_opc" class="text-14">119333, Москва, <br>Ленинский проспект, <br>д.60/2, помещение XXIV</div><a data-acf-context="option" data-acf="email_opc" href="mailto:info@bksq.art" class="text-14 is-footer-link1">info@bksq.art</a></div><a data-if-exists="true" data-acf-link="tochki_prodazh_opc" data-acf-context="option" href="/magazine-3#tochki-prodazh" class="footer-link-block w-inline-block"><div>Точки продаж</div></a><a data-acf-context="option" data-acf="tochki_prodazh_opc_2" href="/magazine-2?magazineAction=read#tochki-prodazh" class="footer-link-block w-inline-block"><div class="no-tab">Где почитать</div><div class="from-tab">Почитать</div></a></div>
						<div class="footer-right">
							<div class="footer-title-wrap">
								<div class="tg-icon footer-tg-icon">
									<div class="svg w-embed">
										<svg width="100%" style viewbox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
											<circle cx="18" cy="18" r="16.9474" fill="currentColor" stroke="none" stroke-width="2.10526"></circle>
											<path fill-rule="evenodd" clip-rule="evenodd" d="M22.1881 25.8972C22.4462 26.0812 22.779 26.1272 23.0756 26.0142C23.3722 25.9005 23.5903 25.6455 23.656 25.3365C24.3527 22.0411 26.0427 13.7002 26.6769 10.7026C26.725 10.4766 26.6448 10.2418 26.4684 10.0909C26.292 9.94004 26.0475 9.89647 25.8294 9.97796C22.4679 11.2303 12.1155 15.1397 7.88406 16.7156C7.61549 16.8156 7.44072 17.0754 7.44954 17.3603C7.45916 17.6459 7.64996 17.8936 7.92495 17.9767C9.82259 18.548 12.3135 19.3428 12.3135 19.3428C12.3135 19.3428 13.4776 22.8811 14.0845 24.6804C14.1606 24.9064 14.3362 25.0839 14.5679 25.1452C14.7988 25.2057 15.0457 25.142 15.2181 24.9782C16.1929 24.0519 17.7001 22.6196 17.7001 22.6196C17.7001 22.6196 20.5638 24.7329 22.1881 25.8972ZM13.3613 18.8958L14.7074 23.3644L15.0064 20.5346C15.0064 20.5346 20.2071 15.8134 23.1718 13.1224C23.2584 13.0434 23.2704 12.911 23.1982 12.8182C23.1269 12.7255 22.9954 12.7037 22.8968 12.7666C19.4607 14.9751 13.3613 18.8958 13.3613 18.8958Z" fill="black"></path>
										</svg>
									</div>
								</div>
								<div class="text-neue-44 footer-heading"><a href="https://t.me/bksqart" data-acf-context="option" data-acf=" ssylka_na_telegramm" target="_blank" class="title-link cursor-hover">BKSQ                 <span class="from-tab">     </span>Telegram</a> культура, искусство, мода, <span class="no-wrap">арт-рынок,</span> <span class="no-wrap-mob">герои, архивы</span></div>
							</div>
							<div class="footer-right-bottom"><a data-acf-context="option" data-acf-file="policy_opc" data-output-attribute="href" href="/policy.pdf" target="_blank" class="text-16 is-footer-link2">Политика обработки персональных данных</a><a href="#" class="text-16 is-footer-link2 show-coocky">Использование cookie-файлов</a>
								<p data-acf-context="option" data-acf="art_opc" class="text-16 is-opacity-40">© ООО "Артмедиа Групп", 2024</p>
								<p class="text-16"><span class="is-opacity-40">Сделано в</span> <a href="https://cpeople.ru/" target="_blank" class="footer-link3">CreativePeople</a></p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div class="nav-top">
				<div class="container nav-container">
					<div class="div-block-4"><a href="/" class="brand cursor-hover w-inline-block"><div>Black square</div></a></div>
					<div class="div-block-4 center"><a data-if-exists="true" data-acf-link=" ssylka_na_telegramm" data-acf-context="option" href="https://t.me/bksqart" target="_blank" class="nav-link cursor-hover">Телеграм</a></div>
					<div class="div-block-4 r"><a data-if-exists="true" data-acf-link="menyu_biznes_soprovozhzhenie" data-acf-context="option" href="/b2b" class="nav-link cursor-hover">БИЗНЕС-СОПРОВОЖДЕНИЕ</a></div>
				</div>
			</div>
			<div class="nav-bottom">
				<div class="container nav-container"><a data-if-exists="true" data-acf-link="menyu_o_proekte" data-acf-context="option" href="/about" class="nav-link cursor-hover">о проекте</a><a href="#" class="nav-link cursor-hover hidden">афиша</a>
					<div data-query-arg-posts_per_page="1" data-wp="wp_query" data-query-arg-post_type="magazine"><a data-wp="post_link" href="/magazine2" class="nav-link cursor-hover w-inline-block"><div>журнал</div></a></div>
				</div>
			</div>
			<div class="cursor-wrap">
				<div data-w-id="c6a75421-3296-aff3-c94d-f3107a546d49" class="cursor-holder">
					<div class="vimeo-cursor">
						<div>Vimeo</div>
						<div class="vimeo-button-icon">
							<div class="svg w-embed">
								<svg width="100%" style viewbox="0 0 46 46" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M11.4749 13.4965L11.4749 13.3767L15.5655 9.28601H31.7987L36.406 13.8933L36.406 30.1276L32.3165 34.2172H32.1955L32.1955 16.4743L12.9638 35.706L9.98654 32.7287L29.2187 13.4965L11.4749 13.4965Z" fill="currentColor"></path>
								</svg>
							</div>
						</div>
					</div>
					<div class="tg-cursor">
						<div>Telegram</div>
						<div class="vimeo-button-icon">
							<div class="svg w-embed">
								<svg width="100%" style viewbox="0 0 46 46" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M11.4749 13.4965L11.4749 13.3767L15.5655 9.28601H31.7987L36.406 13.8933L36.406 30.1276L32.3165 34.2172H32.1955L32.1955 16.4743L12.9638 35.706L9.98654 32.7287L29.2187 13.4965L11.4749 13.4965Z" fill="currentColor"></path>
								</svg>
							</div>
						</div>
					</div>
					<div class="cube-cursor">
						<div class="svg w-embed">
							<svg width="100%" style viewbox="0 0 13 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
							<p class="text-16"><span class="is-opacity-60">Согласен c условиями</span> <a href="#" data-acf-context="option" data-acf=" policy_opc" target="_blank" class="cookie-link">Политики обработки персональных данных </a><span class="is-opacity-60">и предоставляю согласие на использование cookie-файлов.<br>Если вы не согласны на использование cookie-файлов, поменяйте настройки браузера.</span></p>
						</div>
						<div class="button-wrap cookies-button-wrap"><a id="accept" href="#" class="dot-link cookies-button w-button">Принять</a><a href="#" class="dot-link cookies-button-decline decline w-button">Отклонить</a></div>
					</div>
				</div>
			</div>
			<div class="mobmenu"><a data-lenis-toggle href="#" class="mob-btn w-inline-block"><div class="code-embed-2 w-embed"><svg width="100%" height="100%" viewbox="0 0 375 43" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1257_5805)"><path fill-rule="evenodd" clip-rule="evenodd" d="M197.418 8.03889C199.811 10.553 202.725 13 206.196 13H367C371.418 13 375 16.5817 375 21V33C375 37.4183 371.418 41 367 41H8C3.58172 41 0 37.4183 0 33V21C0 16.5817 3.58172 13 8 13H169.804C173.275 13 176.189 10.553 178.582 8.03889C180.95 5.55081 184.294 4 188 4C191.706 4 195.05 5.55081 197.418 8.03889Z" fill="black"></path><rect width="375" height="34" transform="translate(0 13)"></rect><path d="M183 14L187.071 9.92893L191.142 14H183Z" fill="white"></path><path d="M183 16L187.071 11.9289L191.142 16H183Z" fill="black"></path></g><defs><clippath id="clip0_1257_5805"><rect width="375" height="43" fill="white"></rect></clippath></defs></svg></div></a>
				<div data-lenis-prevent class="mob-menu-line"><a href="/" class="menu-btn">BKSQ</a><a data-if-exists="true" data-acf-link="menyu_o_proekte" data-acf-context="option" href="/about" class="menu-btn">О проекте</a>
					<div data-query-arg-posts_per_page="1" data-wp="wp_query" data-query-arg-post_type="magazine"><a data-wp="post_title" href="#" class="w-inline-block"></a></div><a data-if-exists="true" data-acf-link="menyu_biznes_soprovozhzhenie" data-acf-context="option" href="/b2b" class="menu-btn">Бизнес-сопровождение</a></div>
			</div>
			<div class="code-embed-5 w-embed">
				<style>
:root {
    
    --maincolor: #ce2da8;
}

.switcher__checkbox:checked+.switcher__label,
.custom-select__option--value{
    background-color: var(--maincolor);
}
				
				</style>
			</div>
		</div>
		<div class="popup-wrapper see-all-popup-wrapper">
			<div data-lenis-start class="popup-bg-overlay"></div>
			<div data-lenis-prevent class="see-all-popup">
				<div data-lenis-start class="close-popup">
					<div class="svg w-embed">
						<svg width="100%" style viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
							<rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
						</svg>
					</div>
				</div>
				<div class="see-all-popup-inner">
					<div class="text-18 mob-18 isuppercase">Журнал BKSQ в онлайн-магазинах</div>
					<div class="see-all-grid"><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb889d-8bd63b27" href="https://www.respublica.ru/knigi/zhurnaly-i-gazety/1457734-zhurnal-black-square-2023-1-novaya-geografiya-novaya-logistika" target="_blank" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/67124a0e85200f17de634535_Frame201321315904.svg" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb889f-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b4e_all-1.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88a1-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b5f_all-14.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88a3-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b58_all-6.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88a5-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b5e_all-12.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88a7-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b5a_all-7.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88a9-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b51_all-2.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88ab-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b5c_all-8.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88ad-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b4f_all-3.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88af-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b60_all-9.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88b1-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b52_all-4.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88b3-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b59_all-10.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88b5-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b50_all-5.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88b7-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b5d_all-11.avif" loading="lazy" alt class="image-contain"></a><a id="w-node-a8dc1ccc-0a4c-5a2a-1cec-4c3367eb88b9-8bd63b27" href="#" class="see-all-box w-inline-block"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b5b_all-13.avif" loading="lazy" alt class="image-contain"></a></div>
				</div>
			</div>
		</div>
		<div class="popup-wrapper mag1-popup-wrapper mag">
			<div class="popup-bg-overlay"></div>
			<div class="mag-popup">
				<div class="close-popup mag-close-popup">
					<div class="svg w-embed">
						<svg width="100%" style viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
							<rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
						</svg>
					</div>
				</div>
				<div class="mag-popup-inner">
					<div class="mag-image-row single-image-row">
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7b_ms5-3-1.avif" loading="lazy" alt class="image-cover"></div>
					</div>
					<div class="mag-popup-bottom">
						<p class="text-18 is-opacity-60 is-uppercase">Лейсан Ибатуллина, фотограф + Екатерина Павелко, редактор моды</p>
						<p class="text-16 _14-tab">Съемка Муси Тотибадзе для Black Square</p>
					</div>
				</div>
			</div>
		</div>
		<div class="popup-wrapper mag2-popup-wrapper mag">
			<div class="popup-bg-overlay"></div>
			<div class="mag-popup">
				<div class="close-popup mag-close-popup">
					<div class="svg w-embed">
						<svg width="100%" style viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
							<rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
						</svg>
					</div>
				</div>
				<div class="mag-popup-inner">
					<div class="mag-image-row">
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7e_ms5-3-2.avif" loading="lazy" alt class="image-cover"></div>
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b81_ms5-3-3.avif" loading="lazy" alt class="image-cover"></div>
					</div>
					<div class="mag-popup-bottom">
						<p class="text-18 is-opacity-60 is-uppercase">Арина Окунь</p>
						<p class="text-16 _14-tab">Саймон де Пюри, «умеющий сделать из аукциона саспенс и триллер, <br>сам стал героем фильма» – интервью для BKSQ</p>
					</div>
				</div>
			</div>
		</div>
		<div class="popup-wrapper mag3-popup-wrapper mag">
			<div class="popup-bg-overlay"></div>
			<div class="mag-popup">
				<div class="close-popup mag-close-popup">
					<div class="svg w-embed">
						<svg width="100%" style viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
							<rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
						</svg>
					</div>
				</div>
				<div class="mag-popup-inner">
					<div class="mag-image-row">
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b79_ms5-3-4.avif" loading="lazy" alt class="image-cover"></div>
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7a_ms5-3-5.avif" loading="lazy" alt class="image-cover"></div>
					</div>
					<div class="mag-popup-bottom">
						<p class="text-18 is-opacity-60 is-uppercase">Портфолио</p>
						<p class="text-16 _14-tab">Вилли Вандерперр, «Prints, films, a rave and more…»</p>
					</div>
				</div>
			</div>
		</div>
		<div class="popup-wrapper mag4-popup-wrapper mag">
			<div class="popup-bg-overlay"></div>
			<div class="mag-popup">
				<div class="close-popup mag-close-popup">
					<div class="svg w-embed">
						<svg width="100%" style viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
							<rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
						</svg>
					</div>
				</div>
				<div class="mag-popup-inner">
					<div class="mag-image-row">
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7d_ms5-3-6.avif" loading="lazy" alt class="image-cover"></div>
						<div class="mag-image-box"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7c_ms5-3-7.avif" loading="lazy" alt class="image-cover"></div>
					</div>
					<div class="mag-popup-bottom">
						<p class="text-16 _14-tab">Вивиан Сассен – снимки, которые живут на грани между <br>искусством и модой, между интимным и «журнальным»</p>
					</div>
				</div>
			</div>
		</div>
		<div class="popup-wrapper mag5-popup-wrapper mag">
			<div class="popup-bg-overlay"></div>
			<div class="mag-popup">
				<div data-lenis-start class="close-popup mag-close-popup">
					<div class="svg w-embed">
						<svg width="100%" style viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect y="0.71875" width="1.01533" height="38.5825" transform="rotate(-45 0 0.71875)" fill="black"></rect>
							<rect x="0.71875" y="28" width="1.01533" height="38.5825" transform="rotate(-135 0.71875 28)" fill="black"></rect>
						</svg>
					</div>
				</div>
				<div class="mag-popup-inner">
					<div class="mag-image-row single-image-row">
						<div class="mag-image-box maxh-450"><img src="<?php echo get_template_directory_uri() ?>/images/6704f17061cf6aa78bd63b7f_mag3-s4.avif" loading="lazy" alt class="image-cover"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- FOOTER CODE -->
		<?php get_template_part("footer_block", ""); ?>
	</body>
</html>
