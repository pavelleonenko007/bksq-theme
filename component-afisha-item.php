<?php
/**
 * Component Afisha Item
 *
 * @package 0.0.1
 */

defined( 'ABSPATH' ) || exit;

global $post;

$address  = get_field( 'full_address' );
$subtitle = get_field( 'subtitle' );
?>
<a id="<?php echo esc_attr( 'afishaItem' . $post->ID ); ?>" href="<?php the_permalink(); ?>" class="afisha-item no-barba w-inline-block">
	<?php if ( ! empty( $address ) ) : ?>
		<div class="horiz">
			<img src="<?php echo esc_url( get_template_directory_uri() . '/images/67b47ad9500500b95e543cdb_heroicons_map-pin-16-solid.svg' ); ?>" loading="lazy" alt class="new-icon-20">
			<div class="new-p-14-16"><?php echo do_shortcode( $address ); ?></div>
		</div>
		<?php endif; ?>
	<?php if ( has_post_thumbnail() ) : ?>
		<div class="new-afsh-img">
			<img src="<?php echo esc_url( get_the_post_thumbnail_url( $post->ID, 'large' ) ); ?>" loading="lazy" alt class="img-cover-in">
		</div>
	<?php endif; ?>
	<div class="vert g8">
		<?php if ( ! empty( $subtitle ) ) : ?>
			<div class="new-p-14-16 black"><?php echo wp_kses_post( $subtitle ); ?></div>
		<?php endif; ?>
		<div class="new-p-18-21 upper black"><?php the_title(); ?></div>
	</div>
</a>
