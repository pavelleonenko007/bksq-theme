<?php
/**
 *  component-passed-event
 *
 * @package 0.0.1
 */

defined( 'ABSPATH' ) || exit;

global $post;

$subtitle = get_field( 'subtitle' );
$company  = get_field( 'vid_aktivnosti1' );
$mesto    = get_field( 'stand' ); ?>
<div class="events-item">
	<div class="event-inside-block">
		<div class="event-keeper">
			<div class="event-var">
				<div class="event-row cursor-hover scrollobs-line eventsingle">
					<div class="div-block-2 colsingle">
						<div class="event-row-left scrollobs-opc col1">
							<div class="event-left1 col1">
								<?php
								if ( ! empty( $subtitle ) ) :
									?>
									<div class="text-neue-36 colored"><?php echo wp_kses_post( $subtitle ); ?></div>
								<?php endif; ?>
							</div>
							<div class="event-left2">
								<div class="rel">
									<div class="event-title _2"><?php the_title(); ?></div>
									<a href="#" class="abs-link w-inline-block"></a>
								</div>
								<div class="text-16 colored">Павильоны Black Square от Романа Сакина — пространства для уединения и осмысления увиденного. Скачать <a href="https://drive.google.com/drive/folders/1i2vNAeOg95lug3FZJ4t3I4UN-3AMlUbR?usp=sharing" target="_blank" class="link">пресс-релиз</a></div>
							</div>
							<div class="event-left3 col1">
								<div data-acf="place" class="text-16 is-opacity-60">Тимирязев Центр</div>
								<div data-acf="stand" class="text-16">Стенд О37</div>
							</div>
						</div>
					</div>
					<div data-acf-repeater="card-images" class="event-row-right scrollobs-opc col2">
						<div class="event-image-box in"><img src="<?php echo get_template_directory_uri(); ?>/images/67121772eb04270c8b304d4c_001.avif" loading="eager" alt class="event-image"></div>
					</div>
					<a href="<?php the_permalink(); ?>" class="abs-link w-inline-block"></a>
				</div>
			</div>
			<div class="event-var">
				<div class="slide-inner wp-slide-inner cursor-hover">
					<div class="wp-tag-row">
						<?php if ( ! empty( $company ) ) : ?>
							<div class="wp-tag modyfid">
								<div class="text-16 _14-tab"><?php echo wp_kses_post( $company ); ?></div>
							</div>
						<?php endif; ?>
					</div>
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="new-img-mom">
							<img class="image-cover" src="<?php echo esc_url( get_the_post_thumbnail_url( get_the_ID(), 'large' ) ); ?>" alt loading="lazy">
						</div>
					<?php endif; ?>
					<div class="wp-slide-bottom g16">
						<?php if ( ! empty( $start_date ) ) : ?>
							<div class="text-16 mob-16 opacity-60-tab modified bolded"><?php echo esc_html( date_i18n( 'd/m', strtotime( $start_date ) ) ); ?></div>
						<?php endif; ?>
						<div class="new-p-36-32 mmax638"><?php the_title(); ?></div>
						<div data-acf="rich" class="text-16 mob-16 opacity-60-tab modified"><?php echo esc_html( $mesto ); ?></div>
					</div>
				</div>
				<a href="<?php the_permalink(); ?>" class="afisha-item no-barba abs-link w-inline-block"></a>
			</div>
		</div>
	</div>
</div>
