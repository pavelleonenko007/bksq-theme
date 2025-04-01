<?php
/**
 * Template name: Afisha
 *
 * @package 0.0.1
 */

defined( 'ABSPATH' ) || exit; ?>
<!DOCTYPE html>
<html data-wf-page="679b621de9985efb7f6e92fa" data-wf-site="6704f17061cf6aa78bd63b0e">
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
		<div id="barba-wrapper" class="barba-wrapper">
			<div class="barba-container afisha-body">
				<div class="page-wrap afisha-page hp2">
					<div class="main-wrap">
						<section class="section about-hero-section afisha-page">
							<div class="container">
								<div class="about-hero-content afisha-p">
									<div class="aficha-left">
										<div class="vert g32">
											<h1 data-acf="head1" class="h1 new-h1">Афиша</h1>
											<div class="event-title mmax468">Современная культурная повестка, <br>выбор качественных событий и их осмысление — один из главных <br>интересов проекта Black Square. </div>
										</div>
										<div class="about-hero-left scrollobs no-bott _2">
											<div data-acf="richpage" class="text-16 _20-on1900 _16-mob">Этот принцип отражается в создании журнала, развитии телеграм-канала и в других направлениях деятельности BKSQ. <br><br>Для вашего самостоятельного знакомства с избранными событиями мы собрали афишу выставок, театральных, музыкальных, кинособытий и других культурных направлений, отобранных экспертами,  которым можно доверять.</div>
										</div>
									</div>
									<div class="about-hero-right afisha-mimimg">
										<div class="about-hero-image scrollobs no-bott"><img class="image-cover" src="<?php echo get_template_directory_uri(); ?>/images/679b632bc8c7eafe301cefb1_Frame201321315861.webp" alt data-acf-image="glavnoe_izobrazhenie" loading="eager"></div>
										<div class="about-hero-left scrollobs no-bott _3">
											<div data-acf="richpage" class="text-16 _20-on1900 _16-mob">Этот принцип отражается в создании журнала, развитии телеграм-канала и в других направлениях деятельности BKSQ. <br><br>Для вашего самостоятельного знакомства с избранными событиями мы собрали афишу выставок, театральных, музыкальных, кинособытий и других культурных направлений, отобранных экспертами,  которым можно доверять.</div>
										</div>
									</div>
								</div>
							</div>
						</section>
						<section class="section cons-s5-section">
							<div class="container">
								<div class="afisha-core">
									<div id="w-node-c123c37c-ac59-59d2-a760-18095e4a397b-7f6e92fa" class="filter-core">
										<div class="div-block-11">
											<div class="text-block">Фильтры</div>
											<div class="swiher-mom n-pc">
												<div class="swicher-keeper">
													<a href="#" class="sw-btn list-bbtn active w-inline-block">
														<div class="code-embed-6 w-embed">
															<svg width="100%" height="100%" viewbox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M20 6H5V8.6H20V6ZM20 11.2H5V13.8H20V11.2ZM5 16.4H15V19H5V16.4Z" fill="#EBDBD3"></path>
															</svg>
														</div>
													</a>
													<a href="#" class="sw-btn map-bbtn w-inline-block">
														<div class="code-embed-6 w-embed">
															<svg width="100%" height="100%" viewbox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9007 20.793L11.9046 20.797L11.9072 20.7996C12.0778 20.9296 12.286 21 12.5 21C12.714 21 12.9222 20.9296 13.0928 20.7996L13.0954 20.797L13.0993 20.793L13.1149 20.7813C13.1986 20.7163 13.2809 20.6495 13.3619 20.5812C14.3311 19.7592 15.2216 18.8476 16.0217 17.8584C17.453 16.0772 19 13.4878 19 10.5388C19 8.80463 18.3152 7.14145 17.0962 5.91518C15.8772 4.68891 14.2239 4 12.5 4C10.7761 4 9.12279 4.68891 7.90381 5.91518C6.68482 7.14145 6 8.80463 6 10.5388C6 13.4878 7.547 16.0772 8.9796 17.8584C9.77966 18.8476 10.6702 19.7592 11.6394 20.5812L11.8851 20.7813L11.9007 20.793ZM12.5 12.5005C12.7561 12.5005 13.0096 12.4497 13.2462 12.3512C13.4828 12.2526 13.6978 12.1081 13.8789 11.9259C14.0599 11.7438 14.2036 11.5275 14.3016 11.2895C14.3996 11.0515 14.45 10.7964 14.45 10.5388C14.45 10.2812 14.3996 10.0261 14.3016 9.78814C14.2036 9.55014 14.0599 9.33389 13.8789 9.15174C13.6978 8.96958 13.4828 8.82509 13.2462 8.7265C13.0096 8.62792 12.7561 8.57718 12.5 8.57718C11.9828 8.57718 11.4868 8.78386 11.1211 9.15174C10.7554 9.51962 10.55 10.0186 10.55 10.5388C10.55 11.0591 10.7554 11.558 11.1211 11.9259C11.4868 12.2938 11.9828 12.5005 12.5 12.5005Z" fill="black"></path>
															</svg>
														</div>
													</a>
												</div>
											</div>
										</div>
										<form id="afishaFilterForm" class="form-2 afisha-form" data-js-afisha-filter-form>
											<div class="div-block-10 afisha-form__buttons">
												<?php
												$today_config = array(
													'controlSelector' => '#afishaFilterFormDateControl',
													'value' => wp_date( 'Y-m-d' ),
												);
												?>
												<button 
													type="button" 
													class="button button--outline"
													data-js-afisha-filter-form-preselected-button="<?php echo esc_attr( wp_json_encode( $today_config ) ); ?>"
												>
													Сегодня
												</button>
												<?php
												$yesterday_config = array(
													'controlSelector' => '#afishaFilterFormDateControl',
													'value' => wp_date( 'Y-m-d', strtotime( '+1 day' ) ),
												);
												?>
												<button 
													type="button" 
													class="button button--outline"
													data-js-afisha-filter-form-preselected-button="<?php echo esc_attr( wp_json_encode( $yesterday_config ) ); ?>"
												>
													Завтра
												</button>
												<?php
												$out_of_time_config = array(
													'controlSelector' => '#afishaFilterFormDateControl',
													'value' => 'Вечное',
												);
												?>
												<button 
													type="button" 
													class="button button--outline"
													data-js-afisha-filter-form-preselected-button="<?php echo esc_attr( wp_json_encode( $out_of_time_config ) ); ?>"
												>
													Вечное
												</button>
												<?php
												$upcoming_weekends        = array_values( bksq_get_upcoming_weekends() );
												$upcoming_weekends_config = array(
													'controlSelector' => '#afishaFilterFormDateControl',
													'value' => implode( ',', $upcoming_weekends ),
												);
												?>
												<button 
													type="button" 
													class="button button--outline"
													data-js-afisha-filter-form-preselected-button="<?php echo esc_attr( wp_json_encode( $upcoming_weekends_config ) ); ?>"
												>
													Выходные
												</button>
												<?php
												$festival_config = array(
													'controlSelector' => '#afishaFilterFormActivityControl',
													'value' => 'festival',
												);
												?>
												<button 
													type="button" 
													class="button button--outline"
													data-js-afisha-filter-form-preselected-button="<?php echo esc_attr( wp_json_encode( $festival_config ) ); ?>"
												>
													Фестиваль
												</button>
												<?php
												$location_config = array(
													'controlSelector' => '#afishaFilterFormCityControl',
													'action' => 'getUserCity',
												);
												?>
												<button 
													type="button" 
													class="button button--outline"
													data-js-afisha-filter-form-preselected-button="<?php echo esc_attr( wp_json_encode( $location_config ) ); ?>"
												>
													Рядом со мной
												</button>
											</div>
											<div class="vert g32 afisha-form__fields">
												<div class="afisha-form__field field">
													<input 
														id="afishaFilterFormDateControl"
														type="text" 
														class="field__control" 
														placeholder="Дата"
														name="date"
													>
												</div>
												<?php
												$cities = bksq_get_all_event_cities();
												if ( ! empty( $cities ) && count( $cities ) > 1 ) :
													?>
													<div class="afisha-form__field field">
														<select 
															name="city" 
															id="afishaFilterFormCityControl" class="field__select"
															data-js-custom-select
														>
															<option value="">Город</option>
															<?php foreach ( $cities as $city ) : ?>
																<option value="<?php echo esc_attr( $city ); ?>"><?php echo esc_html( $city ); ?></option>
															<?php endforeach; ?>
														</select>
													</div>
												<?php endif; ?>
												<?php
												$activities = get_terms(
													array(
														'taxonomy'   => 'activity',
														'hide_empty' => false,
													)
												);

												$activities_hierarchy = array();

												foreach ( $activities as $activity ) {
													$parent_id = $activity->parent; // Get the parent ID of the current activity
													if ( ! isset( $activities_hierarchy[ $parent_id ] ) ) {
														$activities_hierarchy[ $parent_id ] = array();
													}
													$activities_hierarchy[ $parent_id ][] = $activity; // Add the activity to its parent's array
												}

												// Function to recursively build the hierarchy
												function build_activity_tree( $activities, $parent_id = 0 ) {
													$branch = array();
													if ( isset( $activities[ $parent_id ] ) ) {
														foreach ( $activities[ $parent_id ] as $activity ) {
															$children = build_activity_tree( $activities, $activity->term_id );
															if ( $children ) {
																$activity->children = $children; // Add children to the activity
															}
															$branch[] = $activity; // Add the activity to the branch
														}
													}
													return $branch;
												}

												$activity_tree = build_activity_tree( $activities_hierarchy );

												if ( ! empty( $activity_tree ) ) :
													?>
													<div class="afisha-form__field field">
														<select 
															name="activity" 
															id="afishaFilterFormActivityControl" class="field__select"
															data-js-custom-select
														>
															<option value="">Вид активности</option>
															<?php foreach ( $activity_tree as $activity_item ) : ?>
																<?php if ( isset( $activity_item->children ) ) : ?>
																	<optgroup label="<?php echo esc_attr( $activity_item->name ); ?>">
																		<?php foreach ( $activity_item->children as $child_item ) : ?>
																			<option value="<?php echo esc_attr( $child_item->slug ); ?>"><?php echo esc_attr( $child_item->name ); ?></option>
																		<?php endforeach; ?>
																	</optgroup>
																<?php endif; ?>
															<?php endforeach; ?>
														</select>
													</div>
												<?php endif; ?>
											</div>
											<button 
												type="reset" 
												class="rest-filter-btn w-inline-block"
												data-js-afisha-filter-form-reset-button
											>
												<img src="<?php echo get_template_directory_uri(); ?>/images/67b5d1a56230e560fbb0ef7d_Frame201321316448.svg" loading="lazy" alt class="new-icon-13">
												<div>Сбросить фильтр</div>
											</button>
											<input type="hidden" name="page" value="1">
											<input type="hidden" name="action" value="filter_afisha_posts">
											<?php wp_nonce_field( 'filter_afisha_posts', '_filter_afisha_posts_nonce', false ); ?>
										</form>
									</div>
									<div id="w-node-faef31bf-9f98-3765-addc-c62922905856-7f6e92fa" class="r-afisha">
										<div id="w-node-_01ba2335-7220-60b3-7747-8ae010561daf-7f6e92fa" class="afisha-list">
											<div id="w-node-e435ccf6-9045-8eb7-9de9-5a13b181bdd4-7f6e92fa" class="resoult-afisha">
												<?php
												$event_blocks = bksq_get_events_by_months();

												$out_of_time_args  = array(
													'post_type' => 'events',
													'posts_per_page' => -1,
													'meta_query' => array(
														array(
															'key' => 'is_out_of_time',
															'value' => '1',
														),
													),
												);
												$out_of_time_query = new WP_Query( $out_of_time_args );
												if ( ! empty( $event_blocks['data'] ) ) :
													?>
													<div id="w-node-c8196337-e5d6-dc97-d79a-b4ebf53b8ad1-7f6e92fa" class="text-core" data-js-afisha-filter-form-content>
														<?php
														foreach ( $event_blocks['data'] as $date => $event_block ) :
															?>
															<div class="month-core">
																<div class="vert g20 month-line">
																	<div class="new-p-18-21 black"><?php echo esc_html( date_i18n( 'F', strtotime( $date ) ) ); ?></div>
																</div>
																<div class="month-core-events">
																	<?php
																	foreach ( $event_block as $post ) :
																		setup_postdata( $post );
																		get_template_part( 'component-afisha-item' );
																	endforeach;
																	wp_reset_postdata();
																	?>
																</div>
															</div>
														<?php endforeach; ?>
													</div>
												<?php endif; ?>
												<?php if ( $out_of_time_query->have_posts() ) : ?>
													<div 	id="w-node-c8196337-e5d6-dc97-d79a-b4ebf53b8ad1-7f6e92fa" 
														class="text-core" 	data-js-afisha-filter-form-out-of-time-content
													>
														<div class="month-core">
															<div class="vert g20 month-line">
																<div class="new-p-18-21 black">Вечное</div>
															</div>
															<div class="month-core-events">
																<?php
																while ( $out_of_time_query->have_posts() ) :
																	$out_of_time_query->the_post();
																	get_template_part( 'component-afisha-item' );
																endwhile;
																wp_reset_postdata();
																?>
															</div>
														</div>
													</div>
												<?php endif; ?>
												<?php if ( ceil( $event_blocks['totalCount'] / 2 ) > 1 ) : ?>
													<button 
														type="button" 
														class="load-more w-inline-block" 
														data-js-afisha-filter-form-more-button
														data-max-pages="<?php echo esc_attr( ceil( $event_blocks['totalCount'] / 2 ) ); ?>">
														<div>Показать еще</div>
													</button>
												<?php endif; ?>
											</div>
											<div class="error-afisha">
												<div class="vert g24 m-center">
													<div class="new-p-18-21 upper">К сожалению, по вашему запросу ничего не нашлось</div>
													<div class="new-p-16-19">Попробуйте изменить критерии фильтрации или уменьшить количество условий, чтобы увеличить вероятность нахождения нужного результата.</div>
												</div>
												<button type="reset" data-js-afisha-filter-form-reset-button form="afishaFilterForm" class="rest-filter-btn w-inline-block">
													<img src="<?php echo get_template_directory_uri(); ?>/images/67b5d1a56230e560fbb0ef7d_Frame201321316448.svg" loading="lazy" alt class="new-icon-13">
													<div>Сбросить фильтр</div>
												</button>
											</div>
										</div>
										<div id="w-node-_9cc8f404-d512-e012-a171-5ebb35845310-7f6e92fa" class="afisha-map-list" data-js-yandex-map>
											<div class="error-afisha">
												<div class="vert g24">
													<div class="new-p-18-21 upper">К сожалению, по вашему запросу ничего не нашлось</div>
													<div class="new-p-16-19">Попробуйте изменить критерии фильтрации или уменьшить количество условий, чтобы увеличить вероятность нахождения нужного результата.</div>
												</div>
												<button type="reset" form="afishaFilterForm" class="rest-filter-btn w-inline-block">
													<img src="<?php echo get_template_directory_uri(); ?>/images/67b5d1a56230e560fbb0ef7d_Frame201321316448.svg" loading="lazy" alt class="new-icon-13">
													<div>Сбросить фильтр</div>
												</button>
											</div>
										</div>
										<div id="w-node-f8dd54e0-43b1-8fde-c2a8-6168124f7b06-7f6e92fa" class="swiher-mom n-tab">
											<div class="swicher-keeper">
												<a href="#" class="sw-btn list-bbtn active w-inline-block">
													<div class="code-embed-6 w-embed">
														<svg width="100%" height="100%" viewbox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M20 6H5V8.6H20V6ZM20 11.2H5V13.8H20V11.2ZM5 16.4H15V19H5V16.4Z" fill="#EBDBD3"></path>
														</svg>
													</div>
												</a>
												<a href="#" class="sw-btn map-bbtn w-inline-block">
													<div class="code-embed-6 w-embed">
														<svg width="100%" height="100%" viewbox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9007 20.793L11.9046 20.797L11.9072 20.7996C12.0778 20.9296 12.286 21 12.5 21C12.714 21 12.9222 20.9296 13.0928 20.7996L13.0954 20.797L13.0993 20.793L13.1149 20.7813C13.1986 20.7163 13.2809 20.6495 13.3619 20.5812C14.3311 19.7592 15.2216 18.8476 16.0217 17.8584C17.453 16.0772 19 13.4878 19 10.5388C19 8.80463 18.3152 7.14145 17.0962 5.91518C15.8772 4.68891 14.2239 4 12.5 4C10.7761 4 9.12279 4.68891 7.90381 5.91518C6.68482 7.14145 6 8.80463 6 10.5388C6 13.4878 7.547 16.0772 8.9796 17.8584C9.77966 18.8476 10.6702 19.7592 11.6394 20.5812L11.8851 20.7813L11.9007 20.793ZM12.5 12.5005C12.7561 12.5005 13.0096 12.4497 13.2462 12.3512C13.4828 12.2526 13.6978 12.1081 13.8789 11.9259C14.0599 11.7438 14.2036 11.5275 14.3016 11.2895C14.3996 11.0515 14.45 10.7964 14.45 10.5388C14.45 10.2812 14.3996 10.0261 14.3016 9.78814C14.2036 9.55014 14.0599 9.33389 13.8789 9.15174C13.6978 8.96958 13.4828 8.82509 13.2462 8.7265C13.0096 8.62792 12.7561 8.57718 12.5 8.57718C11.9828 8.57718 11.4868 8.78386 11.1211 9.15174C10.7554 9.51962 10.55 10.0186 10.55 10.5388C10.55 11.0591 10.7554 11.558 11.1211 11.9259C11.4868 12.2938 11.9828 12.5005 12.5 12.5005Z" fill="black"></path>
														</svg>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
						<section class="section cons-s5-section">
							<div class="container">
								<div class="heading-wrap cons-s6-heading-wrap scrollobs">
									<h2 data-acf="zagolovokfreand" class="h1">Консультанты     <br>и друзья      BKSQ</h2>
								</div>
								<div class="content-block cons-s6-content-block">
									<div data-acf-repeater="pov-freands" class="scrollobs">
										<div class="cons-s6-left active">
											<div data-if-exists="true" data-acf="nabtext" class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd3a096139f06c918c7_Rectangle20196.avif" loading="lazy" data-acf-image="img" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd36fdd84e4b39b1a96_Rectangle20199.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6704f17061cf6aa78bd63ba2_consultant1.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd38cda778c4b0c1c4a_Rectangle20197.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7b04701cc4cbd386f9_D0A0D0BED0BCD0B0D0BD20D0A1D0B0D0BAD0B8D0BD.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd3b1de3ff9a2d2a767_Rectangle20198.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd3909b7c45a7626621_Rectangle20203.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd326fd2aa62b76dc18_Rectangle20200.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/67080079fd16573cf02681bc_D09DD0B8D0BAD0B8D182D0B020D09DD0B5D187D0B0D0B5D0B2..avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd38897da09135da61c_Rectangle20201.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707fdd31e2d24387329eb84_Rectangle20202.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805d02f8d4762d8445e62_Rectangle20204.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805d9404bdc1c35b7bad2_Rectangle20205.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805cf529448dc6273b4de_Rectangle20211.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7ccd10dc607ce7012a_D09FD0BED0BBD0B8D0BDD0B020D09FD180D0BED0B7D0BED180D0BED0B2D0B0.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7b873e543b5a684404_D0A1D0B5D180D0B3D0B5D0B8CC8620D0A5D0B0D187D0B0D182D183D180D0BED0B2.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7b9e29f2163ff29c10_D09BD18ED0B4D0BCD0B8D0BBD0B020D090D0BBD18FD0B1D18CD0B5D0B2D0B0.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7bc0f0bbf52f69395b_D094D0B0D0BDD0B8D0BBD0B020D091D183D0BBD0B0D182D0BED0B2.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7c26fd2aa62b786371_D0A1D0B0D188D0B020D0A7D0B0D0B8CC86D0BAD0B0.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805d04166c57aa0bb0a6c_Rectangle20206.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805cf7397a0b751b30da4_Rectangle20207.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670809d39522109598d1f4b7_Rectangle20212.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7c0d269133a55aa8eb_D09DD0B8D0BAD0B8D182D0B020D09CD0B0D0BBD18CD186D0B5D0B2.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805cf141e3011c4115740_Rectangle20210.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7ccb868dc030787d4e_D09ED0BAD181D0B0D0BDD0B020D092D0B0D181D18FD0BAD0B8D0BDD0B020.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805d01014b7ea16aa3117_Rectangle20209.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/670805d069a199e58643a785_Rectangle20208.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/67080c017a4e6f77ee594c73_Rectangle20213.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7b1b3ea0e478456bae_D090D0BBD0B5D0BAD181D0B5D0B8CC8620D09CD183D0BDD0B8D0BFD0BED0B2.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/67080cb079b8000de0ea6563_Rectangle20219.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7c2a724f1bf07d14ae_D0ADD0B4D183D0B0D180D0B420D09BD183D0BAD0BED18FD0BDD0BED0B2.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/67080d587dd2d8344809f445_Rectangle20214.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/67080dfeffcc3f0d156ca8c2_Rectangle20215.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/6707ff7c04701cc4cbd3871b_D09FD0BED0BBD0B8D0BDD0B020D0ADD0B2D0B8D0BDD0B0.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
										<div class="cons-s6-left">
											<div class="text-16 _18-on-1600">Деятельность Black Square, в том числе издание коллекционного журнала, сформировала пул специалистов и друзей, к которым мы обращаемся <br>за консультациями, исследованиями и осуществлением совместных инициатив</div>
											<div class="consultant-images-block">
												<div class="consultamt-image"><img src="<?php echo get_template_directory_uri(); ?>/images/67122668ec734bf960eeca87_D092D0BBD0B0D0B4D0B8D0BCD0B8D18020D090D0B2D0B4D0B5D0B5D0B2.avif" loading="lazy" alt class="image-cover"></div>
											</div>
										</div>
									</div>
									<div class="cons-s6-right">
										<div data-acf-repeater="pov-freands" class="consultants-grid">
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p data-acf="imya_i_familiya" class="text-neue-18 is-uppercase _16-tab">Саша Мадемуазель</p>
													<p data-acf="desck" class="text-16 is-opacity-60 _14-tab">Фотодиректор журнала BKSQ, фотограф, <br>продюсер, автор тг-канала «я так вижу»</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Анна Свергун</p>
													<p class="text-16 is-opacity-60 _14-tab">Основатель <br>и руководитель агентства ArtPR</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Марго Макарова</p>
													<p class="text-16 is-opacity-60 _14-tab">Художник, куратор, сооснователь проекта newnow</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Уля Савич</p>
													<p class="text-16 is-opacity-60 _14-tab">Художник, куратор, сооснователь проекта newnow</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Роман Сакин</p>
													<p class="text-16 is-opacity-60 _14-tab">Художник, резидент галереи XL, создал инсталляцию для Black Square на Cosmoscow 2024</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Дмитрий Булатов</p>
													<p class="text-16 is-opacity-60 _14-tab">Художник, теоретик искусства и организатор проектов в области Art&Science, для журнала BKSQ #3 написал эссе о когнитивной экологии</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Игорь Кузьмичёв</p>
													<p class="text-16 is-opacity-60 _14-tab">Историк, исследователь ленинградской культуры, автор тг-канала «Здесь был Майк»</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Александра Генералова</p>
													<p class="text-16 is-opacity-60 _14-tab">Журналист, куратор, продюсер Befree и эксперт по difital-art, написала манифест про цифровое искусство для журнала BKSQ #3</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Никита Нечаев</p>
													<p class="text-16 is-opacity-60 _14-tab">Куратор исследований программы Garage Digital Музея «Гараж» рассказал о Михаиле Максимове для журнала BKSQ #3</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Максимилиан Неаполитанский</p>
													<p class="text-16 is-opacity-60 _14-tab">Исследователь философии, автор книги-эксплейнера «В чем истина?» (МИФ, 2024), написал эссе про современную философию для журнала BKSQ #3</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Софья Каем</p>
													<p class="text-16 is-opacity-60 _14-tab">Графический и диджитал-дизайнер, арт-директор, преподаватель НИУ ВШЭ, основатель бренда KAEM.objects<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Екатерина Павелко</p>
													<p class="text-16 is-opacity-60 _14-tab">Куратор бакалаврской программы «Мода» в Школе дизайна НИУ ВШЭ, редактор моды, стилист, отвечала за стиль в съемке «Фея» с Мусей Тотибадзе для журнала BKSQ #3</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Надя Зеленова</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилист, отвечала за стиль в съемке «Ода к вазе» для журнала BKSQ #3<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Эльмира Тулебаева</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилист, стилизовала съемку «Les sous-titres» для журнала BKSQ #3<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Полина Прозорова</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилист, художник по костюму, стилизовала съемку «Дорога» для журнала BKSQ #3</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Сергей Хачатуров</p>
													<p class="text-16 is-opacity-60 _14-tab">Искусствовед, критик и куратор, для журнала BKSQ #2 говорил с Сергеем Подстаницким и писал о выставке Егора Кошелева</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Людмила Алябьева</p>
													<p class="text-16 is-opacity-60 _14-tab">Историк моды, для журнала BKSQ #2 обсудила с Ольгой Вайнштейн коллекционирование одежды</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Данила Булатов</p>
													<p class="text-16 is-opacity-60 _14-tab">Искусствовед, специалист по истории искусства XX века, написал материал об Ансельме Кифере и фильме Вима Вендерса «Ансельм» для журнала BKSQ #2</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Саша Чайка</p>
													<p class="text-16 is-opacity-60 _14-tab">Фотохудожница, сняла для журнала BKSQ #2 серию «Memory game» в Тбилиси</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Андрей Бухарин</p>
													<p class="text-16 is-opacity-60 _14-tab">Музыкальный критик, создатель журнала «Ом», написал для журнала BKSQ #2 о коллекционерах CD-дисков<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Миша и Китти</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилисты, стилизовали съемку «Цветок тайны» с Сашей Сулим для  журнала BKSQ #2</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Юлия Столярова</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилист, отвечала за стиль в съемке «Memory Game» для журнала BKSQ#2</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Никита Мальцев</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилист, отвечал за стиль в съемке «Memory Game» для журнала BKSQ #2</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Яна Гусева</p>
													<p class="text-16 is-opacity-60 _14-tab">Арт-директор, член команды брендингового агентства Depot и Британской высшей школы дизайна</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Оксана Васякина</p>
													<p class="text-16 is-opacity-60 _14-tab">Российская поэтесса и прозаик, автор эссе о путешествиях для журнала BKSQ #1</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Кирилл Маевский</p>
													<p class="text-16 is-opacity-60 _14-tab">Куратор, издатель, сооснователь и программный директор Центра современной культуры «Смена», исполнительный директор издательства Ad Marginem, автор журнала BKSQ<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Полина Рукавичкина</p>
													<p class="text-16 is-opacity-60 _14-tab">Художница и фотограф, снимала студию «Тихая» для журнала BKSQ #1, Николая Бахарева для журнала BKSQ #2 и Игоря Самолета для журнала BKSQ #3</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Илья Батраков</p>
													<p class="text-16 is-opacity-60 _14-tab">Художник, фотограф, снимал для журнала BKSQ #1 Владимира Овчаренко</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Алексей Мунипов</p>
													<p class="text-16 is-opacity-60 _14-tab">Музыкальный критик, куратор, для журнала BKSQ #1 брал интервью у Булата Халилова</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Татьяна Столяр</p>
													<p class="text-16 is-opacity-60 _14-tab">Журналистка, писательница, соавтор тг-канала «Антиглянец», брала интервью у Алины Пинской для журнала BKSQ #1</p>
												</div>
											</div>
											<div class="consultant-box scrollobs none">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Эдуард Лукоянов</p>
													<p class="text-16 is-opacity-60 _14-tab">Книжный журналист, поэт, прозаик, написал о Вернере Херцоге для журнала BKSQ #1 </p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Ася Пилова</p>
													<p class="text-16 is-opacity-60 _14-tab">Фриланс стилист и художник по костюму, стилизовала съемку «Принцип вненаходимости» для журнала BKSQ #1 и «Антироман» для журнала BKSQ #2<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Polina Nomore</p>
													<p class="text-16 is-opacity-60 _14-tab">Celebrity-стилист и эксперт в мире моды, стилизовала съемку «Границы кадра» с Марией Миногаровой для журнала BKSQ #1<br></p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Полина Эвина</p>
													<p class="text-16 is-opacity-60 _14-tab">Стилист, работала над проектом «Kazakh New Wave» для журнала BKSQ #1</p>
												</div>
											</div>
											<div class="consultant-box scrollobs">
												<div class="consultant-box-inner">
													<p class="text-neue-18 is-uppercase _16-tab">Владимир Авдеев</p>
													<p class="text-16 is-opacity-60 _14-tab">Коллекционер, меценат, артист Большого театра 2002-2010, консультант проекта BKSQ</p>
												</div>
											</div>
										</div>
										<div class="button-wrap show-more scrollobs">
											<a href="#" class="dot-link underlined-link _2 w-inline-block">
												<div class="text-18 _16-tab">Показать еще</div>
											</a>
										</div>
									</div>
								</div>
							</div>
						</section>
						<?php
						$passed_event_args = array(
							'post_type'      => 'events',
							'posts_per_page' => 18,
							'meta_key'       => 'end_date',
							'meta_type'      => 'DATE',
							'orderby'        => 'meta_value',
							'order'          => 'ASC',
							'meta_query'     => array(
								array(
									'key'   => 'in_archive',
									'value' => '1',
								),
							),
						);

						$passed_event_query = new WP_Query( $passed_event_args );

						if ( $passed_event_query->have_posts() ) :
							?>
							<section class="section cons-s5-section">
								<div class="container archev">
									<div class="heading-wrap cons-s6-heading-wrap scrollobs">
										<h2 data-acf="zagolovokfreand" class="h1">Прошедшие мероприятия</h2>
									</div>
									<div class="new-events">
										<div class="events-core">
											<?php
											while ( $passed_event_query->have_posts() ) :
												$passed_event_query->the_post();
												?>
												<?php get_template_part( 'component-passed-event' ); ?>
												<?php
											endwhile;
											wp_reset_postdata();
											?>
										</div>
										<a href="#" class="load-more w-inline-block">
											<div>Показать еще</div>
										</a>
									</div>
								</div>
							</section>
						<?php endif; ?>
						<section class="section prefooter-section afisha-prefooter">
							<div class="container">
								<div class="content-block mag-telegram-content-block scrollobs">
									<div class="text-24 _18-tab">Смотрите далее</div>
									<a href="/events" class="prefooter-link cursor-hover w-inline-block">
										<div class="h1">Мероприятия</div>
										<div class="prefooter-link-icon">
											<div class="svg w-embed">
												<svg width="100%" style viewbox="0 0 78 79" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M35.7134 3.44387L35.9209 3.23633L50.0201 3.23633L78.0002 31.2164V47.0982L50.0201 75.0782H35.9209L35.7134 74.8707L66.2939 44.2902L0 44.2902V34.0271L66.2966 34.0271L35.7134 3.44387Z" fill="currentColor"></path>
												</svg>
											</div>
										</div>
									</a>
								</div>
							</div>
						</section>
						<div data-lenis-prevent class="popupevents">
							<a href="#" class="new-close-pop-left w-inline-block"></a>
							<a href="#" class="new-btn-close-pop w-inline-block">
								<div class="new-icon-28 w-embed">
									<svg width="100%" height="100%" viewbox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
										<rect width="1.01531" height="38.5819" transform="matrix(0.707119 -0.707094 0.707119 0.707094 0 0.71875)" fill="black"></rect>
										<rect width="1.01531" height="38.5819" transform="matrix(-0.707119 -0.707094 0.707119 -0.707094 0.71875 28)" fill="black"></rect>
									</svg>
								</div>
							</a>
						</div>
					</div>
					<section class="section footer-section">
						<div class="container footer-container">
							<div class="footer-content">
								<div class="footer-left">
									<div class="footer-left-top">
										<div class="text-14 is-opacity-60">контакты</div>
										<div data-acf-context="option" data-acf="llc_ooo" class="text-14">ООО "Артмедиа Групп"</div>
										<div data-acf-context="option" data-acf="adress_opc" class="text-14">119333, Москва, <br>Ленинский проспект, <br>д.60/2, помещение XXIV</div>
										<a data-acf-context="option" data-acf="email_opc" href="mailto:info@bksq.art" class="text-14 is-footer-link1">info@bksq.art</a>
									</div>
									<a data-if-exists="true" data-acf-link="tochki_prodazh_opc" data-acf-context="option" href="/magazine-3#tochki-prodazh" class="footer-link-block w-inline-block">
										<div>Точки продаж</div>
									</a>
									<a data-if-exists="true" data-acf-link="tochki_prodazh_opc_2" data-acf-context="option" href="/magazine-2?magazineAction=read#tochki-prodazh" class="footer-link-block w-inline-block">
										<div class="no-tab">Где почитать</div>
										<div class="from-tab">Почитать</div>
									</a>
								</div>
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
										<div class="text-neue-44 footer-heading"><a href="https://t.me/bksqart" data-if-exists="true" data-acf-link="ssylka_na_telegramm" data-acf-context="option" target="_blank" class="title-link cursor-hover">BKSQ                 <span class="from-tab">     </span>Telegram</a></div>
										<div data-if-exists="true" data-acf="foobig-text" data-acf-context="option" class="text-neue-44 footer-heading"><a href="https://t.me/bksqart" data-if-exists="true" data-acf-link="ssylka_na_telegramm" data-acf-context="option" target="_blank" class="title-link cursor-hover">‍</a>культура, искусство, мода, <span class="no-wrap">арт-рынок,</span> <span class="no-wrap-mob">герои, архивы</span></div>
									</div>
									<div class="footer-right-bottom">
										<a data-acf-context="option" data-acf-file="policy_opc" data-output-attribute="href" href="/policy.pdf" target="_blank" class="text-16 is-footer-link2">Политика обработки персональных данных</a><a href="#" class="text-16 is-footer-link2 show-coocky">Использование cookie-файлов</a>
										<p data-acf-context="option" data-acf="art_opc" class="text-16 is-opacity-40">© ООО "Артмедиа Групп", 2024</p>
										<p class="text-16"><span class="is-opacity-40">Сделано в</span> <a href="https://cpeople.ru/" target="_blank" class="footer-link3">CreativePeople</a></p>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div class="nav-top">
						<div class="container nav-container">
							<div class="div-block-4">
								<a href="/" class="brand cursor-hover w-inline-block">
									<div>Black square</div>
								</a>
							</div>
							<div class="div-block-4 center"><a href="/events" class="nav-link cursor-hover">мероприятия</a></div>
							<div class="div-block-4 r"><a data-if-exists="true" data-acf-link="menyu_biznes_soprovozhzhenie" data-acf-context="option" href="/b2b" class="nav-link cursor-hover">БИЗНЕС-СОПРОВОЖДЕНИЕ</a></div>
						</div>
					</div>
					<div class="nav-bottom">
						<div class="container nav-container">
							<a data-if-exists="true" data-acf-link="menyu_o_proekte" data-acf-context="option" href="/about" class="nav-link cursor-hover">о проекте</a><a href="/afisha" aria-current="page" class="nav-link cursor-hover w--current">афиша</a>
							<div data-query-arg-posts_per_page="1" data-wp="wp_query" data-query-arg-post_type="magazine">
								<a data-wp="post_link" href="/magazine3" class="nav-link cursor-hover w-inline-block">
									<div data-if-exists="true" data-acf="zhur_opc" data-acf-context="option">журнал</div>
								</a>
							</div>
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
									<p class="text-16"><span class="is-opacity-60">Согласен c условиями</span> <a href="#" data-acf-context="option" data-acf-file="policy_opc" data-output-attribute="href" target="_blank" class="cookie-link">Политики обработки персональных данных </a><span class="is-opacity-60">и предоставляю согласие на использование cookie-файлов.<br>Если вы не согласны на использование cookie-файлов, поменяйте настройки браузера.</span></p>
								</div>
								<div class="button-wrap cookies-button-wrap"><a id="accept" href="#" class="dot-link cookies-button w-button">Принять</a><a href="#" class="dot-link cookies-button-decline decline w-button">Отклонить</a></div>
							</div>
						</div>
					</div>
					<div class="mobmenu">
						<a data-lenis-toggle href="#" class="mob-btn w-inline-block">
							<div class="code-embed-2 w-embed">
								<svg width="100%" height="100%" viewbox="0 0 375 44" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M213.03 8.43015C220.813 15.4131 229.56 23 240.017 23H351C364.255 23 375 23 375 23V92C375 105.255 364.255 116 351 116H24C10.7452 116 0 105.255 0 92V23H24H135.983C146.44 23 155.187 15.4131 162.969 8.43014C168.811 3.18846 176.533 0 185 0H191C199.467 0 207.189 3.18847 213.03 8.43015Z" fill="black"></path>
									<path d="M180 16.5H196M180 23.5H196" stroke="white" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
								</svg>
							</div>
						</a>
						<div data-lenis-prevent class="mob-menu-line">
							<a href="/" class="menu-btn">BKSQ</a><a data-if-exists="true" data-acf-link="menyu_o_proekte" data-acf-context="option" href="/about" class="menu-btn">О проекте</a>
							<div data-query-arg-posts_per_page="1" data-wp="wp_query" data-query-arg-post_type="magazine">
								<a data-wp="post_link" href="#" class="w-inline-block">
									<div>Журнал</div>
								</a>
							</div>
							<a data-if-exists="true" data-acf-link="menyu_biznes_soprovozhzhenie" data-acf-context="option" href="/b2b" class="menu-btn">Бизнес-сопровождение</a>
						</div>
					</div>
				</div>
				<div class="hidden">
					<div class="code-embed-3 w-embed">
						<svg width="100%" height="100%" viewbox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20.0005" cy="20" r="20" fill="white"></circle>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M24.6534 28.7721C24.9402 28.9765 25.3099 29.0276 25.6395 28.9021C25.9691 28.7757 26.2114 28.4924 26.2844 28.149C27.0585 24.4875 28.9363 15.2198 29.6409 11.8891C29.6943 11.6381 29.6053 11.3772 29.4093 11.2095C29.2133 11.0419 28.9416 10.9935 28.6993 11.084C24.9643 12.4755 13.4616 16.8193 8.76002 18.5702C8.4616 18.6814 8.26741 18.9701 8.27721 19.2866C8.2879 19.604 8.49991 19.8792 8.80545 19.9716C10.9139 20.6063 13.6816 21.4894 13.6816 21.4894C13.6816 21.4894 14.975 25.4208 15.6493 27.4201C15.734 27.6711 15.929 27.8684 16.1865 27.9365C16.443 28.0038 16.7174 27.9329 16.9089 27.7509C17.9921 26.7217 19.6668 25.1303 19.6668 25.1303C19.6668 25.1303 22.8487 27.4784 24.6534 28.7721ZM14.8459 20.9927L16.3415 25.9578L16.6737 22.8136C16.6737 22.8136 22.4523 17.5679 25.7464 14.5779C25.8426 14.49 25.8559 14.343 25.7758 14.2399C25.6965 14.1368 25.5504 14.1126 25.4408 14.1825C21.6229 16.6364 14.8459 20.9927 14.8459 20.9927Z" fill="black"></path>
						</svg>
					</div>
					<div class="logo-dot hidden">
						<div class="svg w-embed">
							<svg width="100%" style viewbox="0 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
		<script type="text/javascript" src="<?php bloginfo( 'template_url' ); ?>/js/afisha.js?ver=1742903617"></script>
	</body>
</html>
