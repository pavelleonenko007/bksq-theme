<?php
	/*
	Template name: single events
	*/
?>
<!DOCTYPE html>
<html data-wf-page="67b47fa42e4275aa6ac3162a" data-wf-site="6704f17061cf6aa78bd63b0e">
	<?php get_template_part( 'header_block', '' ); ?>
	<body class="body">
		<?php
		if ( function_exists( 'get_field' ) ) {
			echo get_field( 'body_code', 'option' ); }
		?>
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
			<div class="barba-container afisha-body" data-namespace="single-event">
				<div class="page-wrap afisha-page hp2">
					<div class="main-wrap events-single">
						<div class="popupin">
							<div class="new-vert vert-bottom new-top-block back-btn-bloack">
								<div class="new-div-104"></div>
								<a href="/afisha" class="new-back-btn w-inline-block">
									<div class="new-scg17 w-embed">
										<svg width="100%" height="100%" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd" d="M9.67486 15.3986L9.63207 15.4414L6.74035 15.4414L1.00031 9.70137L1.00031 6.44417L6.73991 0.704566L9.6325 0.704566L9.67485 0.746916L3.40203 7.01974L17 7.01974L17 9.125L3.40124 9.125L9.67486 15.3986Z" fill="#282828"></path>
										</svg>
									</div>
									<div>Вернуться назад</div>
								</a>
								<div class="new-div-104"></div>
							</div>
							<div class="new-vert vert-bottom new-top-block">
								<div class="new-horiz">
									<img src="<?php echo get_field( 'ikonka_dlya_vida_aktivnosti1', false ); ?>" loading="lazy" alt="" class="newicon48"><?php if ( ! empty( get_field( 'vid_aktivnosti1', false ) ) ) : ?>
									<div class="new-p-18-21"><?php echo get_field( 'vid_aktivnosti1', false ); ?></div>
									<?php endif; ?>
								</div>
								<h1 class="new-h1-72"><?php the_title(); ?></h1>
							</div>
							<div class="new-div-104"></div>
							<div class="new-divider"></div>
							<div class="new-div-104"></div>
							<div class="new-vert event-line">
								<div class="new-line-event-spleet">
									<?php if ( ! empty( get_field( 'otzyv_kritika1', false ) ) ) : ?>
									<div class="new-p-36-32 mmax638"><?php echo get_field( 'otzyv_kritika1', false ); ?></div>
									<?php endif; ?><img src="<?php echo get_field( 'foto_kritika1', false ); ?>" loading="lazy" alt="" class="new-img-171-171">
								</div>
								<div class="new-vert-6">
									<?php if ( ! empty( get_field( 'podpis_dlya_kritika1', false ) ) ) : ?>
									<div class="new-p-16-19"><?php echo get_field( 'podpis_dlya_kritika1', false ); ?></div>
									<?php endif; ?><?php if ( ! empty( get_field( 'imya_kritika1', false ) ) ) : ?>
									<div class="new-p-20-24"><?php echo get_field( 'imya_kritika1', false ); ?></div>
									<?php endif; ?>
								</div>
								<img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/67b46d9fe17c2fb46ebdacf4_Frame%201321316681.jpg" loading="lazy" alt="" class="new-img-171-171 non">
							</div>
							<div class="new-div-104"></div>
							<img class="img-fw" src="<?php the_post_thumbnail_url(); ?>" alt="" loading="lazy">
							<div class="new-div-104"></div>
							<div class="new-vert">
								<div class="new-horiz-spleet">
									<?php if ( ! empty( get_field( 'content', false ) ) ) : ?>
									<div class="new-p-20-24 mmax545"><?php echo get_field( 'content', false ); ?></div>
									<?php endif; ?>
									<div class="new-vert-24">
										<div class="new-p-16-19">Особенности</div>
										<?php if ( ! empty( get_field( 'osobennosti1', false ) ) ) : ?>
										<div class="new-p-16-19 colorer"><?php echo get_field( 'osobennosti1', false ); ?></div>
										<?php endif; ?>
									</div>
								</div>
							</div>
							<div class="new-div-104"></div>
							<div class="new-vert">
								<div class="new-horiz-spleet vom">
									<div class="new-info-line">
										<div class="new-vert-24 mmax265">
											<div class="new-p-18-21 color">Дата</div>
											<div class="new-vert-4">
												<div class="new-p-18-21 upper">
												<?php
												if ( ! empty( get_field( 'start_date', false ) ) ) :
													?>
													<span><?php echo get_field( 'start_date', false ); ?></span><?php endif; ?> — 
													<?php
													if ( ! empty( get_field( 'end_date', false ) ) ) :
														?>
													<span><?php echo get_field( 'end_date', false ); ?></span><?php endif; ?></div>
												<?php if ( ! empty( get_field( 'time_or_interval', false ) ) ) : ?>
												<div class="new-p-16-19"><?php echo get_field( 'time_or_interval', false ); ?></div>
												<?php endif; ?>
											</div>
										</div>
										<div class="new-vert-24 mmax265">
											<div class="new-p-18-21 color">Место</div>
											<div class="new-vert-4">
												<?php if ( ! empty( get_field( 'full_address', false ) ) ) : ?>
												<div class="new-p-18-21 upper"><?php echo get_field( 'full_address', false ); ?></div>
												<?php endif; ?>
											</div>
										</div>
									</div>
									<?php
									$link = get_field( 'ccylka_na_meropriyatie', false );
									if ( ! empty( $link ) ) :
												$url    = $link['url'];
												$title  = $link['title'];
												$target = $link['target'] ? $link['target'] : '_self';
										?>
									<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="new-link-rounded no-barba"><?php echo esc_html( $title ); ?></a><?php endif; ?>
								</div>
							</div>
							<div class="new-divider _2"></div>
							<div class="new-vert">
								<div class="new-soc-share">
									<a href="#" data-js-copy-button data-copy-text="<?php the_permalink(); ?>" class="new-share-btn w-inline-block">
										<div class="new-sh-ico w-embed">
											<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g opacity="0.6">
													<path d="M31.9986 29.0026C31.4599 29.0024 30.9267 29.1114 30.4312 29.323C29.9358 29.5347 29.4884 29.8445 29.1161 30.2339L19.8661 25.0295C20.0453 24.3566 20.0453 23.6486 19.8661 22.9757L29.1161 17.7714C29.7897 18.4697 30.6947 18.8985 31.6618 18.9774C32.6288 19.0563 33.5914 18.78 34.3693 18.2001C35.1472 17.6202 35.687 16.7766 35.8875 15.8273C36.088 14.878 35.9356 13.8881 35.4587 13.0432C34.9818 12.1982 34.2132 11.5561 33.2969 11.2372C32.3805 10.9183 31.3793 10.9444 30.4809 11.3106C29.5824 11.6769 28.8483 12.3582 28.4161 13.2268C27.9839 14.0955 27.8832 15.0919 28.133 16.0295L18.883 21.2339C18.3304 20.6578 17.6182 20.2601 16.8378 20.0922C16.0574 19.9242 15.2447 19.9936 14.504 20.2913C13.7634 20.5891 13.1288 21.1016 12.6819 21.763C12.2349 22.4244 11.9961 23.2044 11.9961 24.0026C11.9961 24.8009 12.2349 25.5808 12.6819 26.2422C13.1288 26.9036 13.7634 27.4162 14.504 27.7139C15.2447 28.0117 16.0574 28.081 16.8378 27.9131C17.6182 27.7451 18.3304 27.3475 18.883 26.7714L28.133 31.9757C27.9185 32.7832 27.9622 33.6375 28.258 34.4188C28.5538 35.2001 29.0867 35.8692 29.7821 36.3322C30.4775 36.7951 31.3004 37.0288 32.1353 37.0003C32.9703 36.9718 33.7753 36.6826 34.4375 36.1733C35.0997 35.664 35.5859 34.9601 35.8277 34.1604C36.0695 33.3608 36.0549 32.5055 35.7859 31.7146C35.5168 30.9237 35.0069 30.2368 34.3277 29.7504C33.6485 29.2641 32.834 29.0025 31.9986 29.0026Z" fill="#282828"></path>
												</g>
											</svg>
										</div>
									</a>
									<!-- <a href="#" class="new-share-btn w-inline-block">
										<div class="new-sh-ico w-embed">
											<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g opacity="0.6">
													<path d="M36.672 32.5073H33.6293C32.4787 32.5073 32.132 31.5753 30.0693 29.5113C28.2667 27.7739 27.5053 27.5579 27.0493 27.5579C26.4187 27.5579 26.2467 27.7313 26.2467 28.5993V31.3353C26.2467 32.0753 26.0067 32.5086 24.0733 32.5086C22.1977 32.3826 20.3789 31.8128 18.7666 30.8462C17.1544 29.8795 15.7948 28.5436 14.8 26.9486C12.4387 24.0081 10.7952 20.5577 10 16.8713C10 16.4153 10.1733 16.0019 11.0427 16.0019H14.0827C14.864 16.0019 15.1453 16.3499 15.452 17.1539C16.928 21.4979 19.4467 25.2766 20.4693 25.2766C20.8613 25.2766 21.032 25.1033 21.032 24.1259V19.6513C20.9027 17.6099 19.8187 17.4379 19.8187 16.6993C19.8324 16.5044 19.9215 16.3225 20.0672 16.1923C20.2128 16.0621 20.4035 15.9938 20.5987 16.0019H25.3773C26.0307 16.0019 26.2467 16.3273 26.2467 17.1086V23.1486C26.2467 23.8006 26.5267 24.0166 26.724 24.0166C27.116 24.0166 27.4173 23.8006 28.136 23.0833C29.6759 21.2042 30.9343 19.1112 31.872 16.8699C31.9675 16.6006 32.1487 16.3699 32.3879 16.2134C32.627 16.0569 32.9109 15.983 33.196 16.0033H36.2373C37.1493 16.0033 37.3427 16.4593 37.1493 17.1099C36.0429 19.5877 34.6742 21.9398 33.0667 24.1259C32.7387 24.6259 32.608 24.8859 33.0667 25.4726C33.368 25.9286 34.4347 26.8193 35.1507 27.6659C36.1933 28.7059 37.0587 29.9086 37.7133 31.2259C37.9747 32.0739 37.54 32.5073 36.672 32.5073Z" fill="#282828"></path>
												</g>
											</svg>
										</div>
									</a> -->
									<?php $tg_link = esc_url('https://telegram.me/share/url?url='. get_the_permalink() .'&text=' . get_the_title()); ?>
									<a href="<?php echo $tg_link; ?>" class="new-share-btn w-inline-block" target="_blank">
										<div class="new-sh-ico w-embed">
											<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g opacity="0.6">
													<path d="M35.6135 12.8779C35.6135 12.8779 38.2035 11.8679 37.9869 14.3206C37.9155 15.3306 37.2682 18.8659 36.7642 22.6892L35.0375 34.0159C35.0375 34.0159 34.8935 35.6752 33.5982 35.9639C32.3035 36.2519 30.3609 34.9539 30.0009 34.6652C29.7129 34.4486 24.6049 31.2019 22.8062 29.6152C22.3022 29.1819 21.7262 28.3166 22.8782 27.3066L30.4329 20.0919C31.2962 19.2252 32.1595 17.2052 28.5622 19.6586L18.4889 26.5119C18.4889 26.5119 17.3375 27.2339 15.1795 26.5846L10.5022 25.1412C10.5022 25.1412 8.77553 24.0592 11.7255 22.9772C18.9209 19.5866 27.7709 16.1239 35.6129 12.8772" fill="#282828"></path>
												</g>
											</svg>
										</div>
									</a>
								</div>
							</div>
							<div class="new-div-208"></div>
							<div class="new-vert gg93">
								<div class="new-p-72-64">Смотрите также</div>
								<?php
									$query_args = array(
										'post__not_in'   => array( get_the_ID() ),
										'post_type'      => 'events',
										'posts_per_page' => 3,
										'meta_query' => array(
											array(
												'key'   => 'afisha',
												'value' => '1',
											),
										),
									);

									$custom_query = new WP_Query( $query_args );

									if ( $custom_query->have_posts() ) :
										?>
								<div data-query-arg-post__not_in="array( get_the_ID() )" data-query-arg-post_type="events" data-query-arg-posts_per_page="3" class="new-grid">
										<?php
										while ( $custom_query->have_posts() ) :
											$custom_query->the_post();
											?>
									<a href="<?php the_permalink(); ?>" class="new-link-afisha w-inline-block">
										<div class="new-horiz gg12">
											<img src="https://cdn.prod.website-files.com/6704f17061cf6aa78bd63b0e/67b47ad9500500b95e543cdb_heroicons_map-pin-16-solid.svg" loading="lazy" alt="" class="new-icon-20"><?php if ( ! empty( get_field( 'full_address', false ) ) ) : ?>
											<div class="new-p-16-19"><?php echo get_field( 'full_address', false ); ?></div>
											<?php endif; ?>
										</div>
										<img class="new-img-item" src="<?php the_post_thumbnail_url(); ?>" alt="" loading="lazy">
										<div class="new-vert gg8">
											<?php if ( ! empty( get_field( 'time_or_interval', false ) ) ) : ?>
											<div class="new-p-16-19 colorer"><?php echo get_field( 'time_or_interval', false ); ?></div>
											<?php endif; ?>
											<div class="new-p-18-21 upper"><?php the_title(); ?></div>
										</div>
									</a>
											<?php
									endwhile;
										wp_reset_postdata();
										?>
								</div>
								<?php endif; ?>
							</div>
							<div class="new-div-104"></div>
						</div>
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
									<?php
									$link = get_field( 'tochki_prodazh_opc', 'option' );
									if ( ! empty( $link ) ) :
												$url    = $link['url'];
												$title  = $link['title'];
												$target = $link['target'] ? $link['target'] : '_self';
										?>
									<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="footer-link-block w-inline-block" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
									<?php
									$link = get_field( 'tochki_prodazh_opc_2', 'option' );
									if ( ! empty( $link ) ) :
												$url    = $link['url'];
												$title  = $link['title'];
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
										<div class="text-neue-44 footer-heading">
										<?php
										$link = get_field( 'ssylka_na_telegramm', 'option' );
										if ( ! empty( $link ) ) :
													$url    = $link['url'];
													$title  = $link['title'];
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
							<div class="div-block-4 center">
							<?php
							$link = get_field( 'ssylka_na_telegramm', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
								<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="nav-link cursor-hover"><?php echo esc_html( $title ); ?></a><?php endif; ?>
							</div>
							<div class="div-block-4 r">
							<?php
							$link = get_field( 'menyu_biznes_soprovozhzhenie', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
								<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="nav-link cursor-hover" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
							</div>
						</div>
					</div>
					<div class="nav-bottom">
						<div class="container nav-container">
							<?php
							$link = get_field( 'menyu_o_proekte', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
							<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="nav-link cursor-hover" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a><?php endif; ?>
							<?php
							$link = get_field( 'ssylka_na_telegramm_2', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
							<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="nav-link cursor-hover"><?php echo esc_html( $title ); ?></a>
							<?php endif; ?>
							<?php
							$query_args       = array(
								'posts_per_page' => 1,
								'post_type'      => 'magazine',
							);
								$custom_query = new WP_Query( $query_args );

							if ( $custom_query->have_posts() ) :
								?>
							<div data-query-arg-posts_per_page="1" data-query-arg-post_type="magazine">
								<?php
								while ( $custom_query->have_posts() ) :
									$custom_query->the_post();
									?>
								<a href="<?php the_permalink(); ?>" class="nav-link cursor-hover w-inline-block">
									<?php if ( ! empty( get_field( 'zhur_opc', 'option' ) ) ) : ?>
									<div><?php echo get_field( 'zhur_opc', 'option' ); ?></div>
									<?php endif; ?>
								</a>
									<?php
								endwhile;
								wp_reset_postdata();
								?>
							</div>
							<?php endif; ?>
						</div>
					</div>
					<div class="cursor-wrap">
						<div data-w-id="c6a75421-3296-aff3-c94d-f3107a546d49" class="cursor-holder" style="will-change: transform; transform: translate3d(46.914vw, 48.022vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
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
							<a href="/" aria-current="page" class="menu-btn w--current">BKSQ</a>
							<?php
							$link = get_field( 'menyu_o_proekte', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
							<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" class="menu-btn" target="<?php echo esc_attr( $target ); ?>"><?php echo esc_html( $title ); ?></a>
							<?php endif; ?>
							<?php
							$link = get_field( 'ssylka_na_telegramm', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
							<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="menu-btn"><?php echo esc_html( $title ); ?></a>
							<?php endif; ?>
							<?php
							$link = get_field( 'ssylka_na_telegramm_2', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self';
								?>
							<a data-if-exists="true" href="<?php echo esc_url( $url ); ?>" target="<?php echo esc_attr( $target ); ?>" class="menu-btn"><?php echo esc_html( $title ); ?></a>
							<?php endif; ?>
							<?php
							$query_args       = array(
								'posts_per_page' => 1,
								'post_type'      => 'magazine',
							);
								$custom_query = new WP_Query( $query_args );

							if ( $custom_query->have_posts() ) :
								?>
							<div data-query-arg-posts_per_page="1" data-query-arg-post_type="magazine">
								<?php
								while ( $custom_query->have_posts() ) :
									$custom_query->the_post();
									?>
								<a href="<?php the_permalink(); ?>" class="w-inline-block">
									<div>Журнал</div>
								</a>
									<?php
								endwhile;
								wp_reset_postdata();
								?>
							</div>
							<?php endif; ?>
							<?php
							$link = get_field( 'menyu_biznes_soprovozhzhenie', 'option' );
							if ( ! empty( $link ) ) :
										$url    = $link['url'];
										$title  = $link['title'];
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
		<?php get_template_part( 'footer_block', '' ); ?>
		<script type="text/javascript" src="<?php bloginfo( 'template_url' ); ?>/js/afisha-single.js?ver=1742903617"></script>
	</body>
</html>
