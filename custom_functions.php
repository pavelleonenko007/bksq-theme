<?php

defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', 'wtw_custom_code' );

function wtw_custom_code() {
	wp_enqueue_style( 'custom-css', get_stylesheet_directory_uri() . '/css/custom.css', array( 'main' ), null );
}

add_action( 'wp_enqueue_scripts', 'bksq_enqueue_scripts' );
function bksq_enqueue_scripts() {
	wp_enqueue_style( 'bundle', get_stylesheet_directory_uri() . '/build/css/bundle.css', array( 'main' ), null );

	// wp_enqueue_script( 'main', get_template_directory_uri() . '/js/main.js', array( 'jquery' ), time(), true );
	// wp_enqueue_script( 'front', get_template_directory_uri() . '/js/front.js', array( 'main' ), time(), true );
	wp_enqueue_script( 'custom', get_stylesheet_directory_uri() . '/js/custom.js', array( 'jquery' ), null, true );
	wp_enqueue_script( 'bundle', get_template_directory_uri() . '/build/js/bundle.js', array( 'custom' ), time(), true );
	wp_localize_script(
		'bundle',
		'BKSQ',
		array(
			'AJAX_URL'  => admin_url( 'admin-ajax.php' ),
			'LOCATIONS' => bksq_format_events_map_markers( bksq_get_events_by_months()['all_events'] ),
		)
	);
}

function bksq_get_upcoming_weekends() {
	$weekends     = array();
	$current_date = new DateTime();

	// Find the next Saturday
	$current_date->modify( 'next Saturday' );

	$saturday = clone $current_date;
	$sunday   = clone $current_date;
	$sunday->modify( '+1 day' );

	$weekends['saturday'] = $saturday->format( 'Y-m-d' );
	$weekends['sunday']   = $sunday->format( 'Y-m-d' );

	return $weekends;
}

function bksq_get_events_by_months( $params = array() ) {
	$months_per_page = $params['months_per_page'] ?? 2;
	$page            = $params['page'] ?? 1;
	$start_date      = $params['start_date'] ?? wp_date( 'Y-m-d' );
	$end_date        = $params['end_date'] ?? '';

	$offset = $months_per_page * ( $page - 1 );

	$start_date_month = wp_date( 'Y-m', strtotime( $start_date ) );

	$event_args = array(
		'post_type'      => 'events',
		'posts_per_page' => -1,
		'meta_query'     => array(
			array(
				'key'   => 'afisha',
				'value' => '1',
			),
			array(
				'key'     => 'end_date',
				'value'   => $start_date,
				'compare' => '>=',
				'type'    => 'DATE',
			),
		),
	);

	if ( ! empty( $end_date ) ) {
		$event_args['meta_query'][] = array(
			'key'     => 'start_date',
			'value'   => $end_date,
			'compare' => '<=',
			'type'    => 'DATE',
		);
	}

	if ( ! empty( $params['activity'] ) ) {
		$event_args['tax_query'][] = array(
			'taxonomy' => 'activity',
			'field'    => 'slug',
			'terms'    => array( $params['activity'] ),
		);
	}

	if ( ! empty( $params['city'] ) ) {
		$event_args['meta_query'][] = array(
			'key'   => 'city',
			'value' => $params['city'],
		);
	}

	$event_query = new WP_Query( $event_args );
	$events      = $event_query->posts;

	if ( count( $events ) < 1 ) {
		return array(
			'data'       => array(),
			'all_events' => array(),
			'page'       => $page,
			'totalCount' => 0,
			'maxPages'   => 0,
		);
	}

	$result = array();

	foreach ( $events as $event ) {
		$event_start_date = wp_date( 'Y-m', strtotime( get_field( 'start_date', $event ) ) );
		$event_end_date   = wp_date( 'Y-m', strtotime( get_field( 'end_date', $event ) ) );

		$start = new DateTime( $event_start_date . '-01' );
		$end   = new DateTime( $event_end_date . '-01' );
		$end   = $end->modify( 'first day of next month' );

		$period = new DatePeriod( $start, new DateInterval( 'P1M' ), $end );

		foreach ( $period as $date ) {
			if ( strtotime( $start_date_month ) > $date->getTimestamp() ) {
				continue;
			}

			if ( ! empty( $end_date ) && $date > new DateTime( $end_date ) ) {
				continue;
			}

			$result[ $date->format( 'Y-m' ) ][] = $event;
		}
	}

	// Sort the result array by date
	uksort(
		$result,
		function ( $a, $b ) {
			return strtotime( $a ) - strtotime( $b ); // Sort by date
		}
	);

	return array(
		'data'       => array_slice( $result, $offset, $months_per_page ),
		'page'       => $page,
		'all_events' => array_map(
			function ( $p ) {
				return $p->ID;
			},
			$events
		),
		'totalCount' => count( $result ),
		'maxPages'   => ceil( count( $result ) / $months_per_page ),
	);
}

function bksq_format_events_map_markers( $events = array() ) {
	return array_map(
		function ( $p ) {
			if ( ! ( $p instanceof WP_Post ) ) {
				$p = get_post( $p );
			}

			$date_range = array_filter(
				array(
					date_i18n( 'd F', strtotime( get_field( 'start_date', $p ) ) ),
					date_i18n( 'd F', strtotime( get_field( 'end_date', $p ) ) ),
				)
			);

			$object = array(
				'id'             => $p->ID,
				'title'          => get_the_title( $p->ID ),
				'date'           => implode( ' – ', $date_range ),
				'coordinates'    => array_map( 'floatval', array_values( get_field( 'coordinates', $p->ID ) ?? array() ) ),
				'city'           => get_field( 'city', $p->ID ),
				'address'        => str_replace( 'text-black', 'text-white', do_shortcode( get_field( 'full_address', $p->ID ) ) ),
				'icon'           => bksq_get_activity_icon( bksq_get_event_activity( $p ) ),
				'is_out_of_time' => get_field( 'is_out_of_time', $p->ID ),
				'url'            => get_the_permalink( $p->ID ),
			);

			return $object;
		},
		$events
	);
}

function bksq_sort_events( array $events = array(), array $params = array() ): array {
	$blocks_per_page = 2;
	$page            = isset( $params['page'] ) ? $params['page'] : 1;
	$start_time      = isset( $params['start_time'] ) ? strtotime( $params['start_time'] ) : strtotime( gmdate( 'Y-m' ) );
	$offset          = $blocks_per_page * ( $page - 1 );

	if ( count( $events ) < 1 ) {
		return array(
			'data'        => array(),
			'page'        => $page,
			'total_count' => 0,
		);
	}

	$result = array();

	foreach ( $events as $event ) {
		$start_date = gmdate( 'Y-m', strtotime( get_field( 'start_date', $event ) ) );
		$end_date   = gmdate( 'Y-m', strtotime( get_field( 'end_date', $event ) ) );

		$start = new DateTime( $start_date . '-01' );
		$end   = new DateTime( $end_date . '-01' );
		$end   = $end->modify( 'first day of next month' );

		$period = new DatePeriod( $start, new DateInterval( 'P1M' ), $end );

		foreach ( $period as $date ) {
			if ( $start_time > $date->getTimestamp() ) {
				continue;
			}

			$result[ $date->format( 'Y-m' ) ][] = $event;
		}
	}

	// Sort the result array by date
	uksort(
		$result,
		function ( $a, $b ) {
			return strtotime( $a ) - strtotime( $b ); // Sort by date
		}
	);

	return array(
		'data'       => array_slice( $result, $offset, $blocks_per_page ),
		'page'       => $page,
		'totalCount' => count( $result ),
	);
}

add_action( 'wp_ajax_filter_afisha_posts', 'bksq_filter_afisha_posts_via_ajax' );
add_action( 'wp_ajax_nopriv_filter_afisha_posts', 'bksq_filter_afisha_posts_via_ajax' );
function bksq_filter_afisha_posts_via_ajax() {
	if ( ! isset( $_POST['_filter_afisha_posts_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_filter_afisha_posts_nonce'] ) ), 'filter_afisha_posts' ) ) {
		wp_send_json_error(
			array(
				'message' => 'Ошибка в запросе!',
				'debug'   => $_POST,
			)
		);
	}

	$date     = ! empty( $_POST['date'] ) ? sanitize_text_field( wp_unslash( $_POST['date'] ) ) : '';
	$city     = isset( $_POST['city'] ) ? sanitize_text_field( wp_unslash( $_POST['city'] ) ) : '';
	$activity = isset( $_POST['activity'] ) ? sanitize_text_field( wp_unslash( $_POST['activity'] ) ) : '';
	$page     = isset( $_POST['page'] ) ? intval( sanitize_text_field( wp_unslash( $_POST['page'] ) ) ) : 1;

	$params = array();

	if ( ! empty( $activity ) ) {
		$params['activity'] = $activity;
	}

	if ( ! empty( $city ) ) {
		$params['city'] = $city;
	}

	if ( ! empty( $date ) ) {
		$date_range = explode( ' — ', $date );
		$start_date = $date_range[0];
		$end_date   = isset( $date_range[1] ) ? $date_range[1] : $start_date;

		$params['start_date'] = $start_date;
		$params['end_date']   = $end_date;
	} else {
		$params['start_date'] = wp_date( 'Y-m-d' );
	}

	$params['page'] = $page;

	ob_start();

	$event_blocks = bksq_get_events_by_months( $params );

	$out_of_time_event_args = array(
		'post_type'      => 'events',
		'posts_per_page' => -1,
		'meta_query'     => array(
			array(
				'key'   => 'is_out_of_time',
				'value' => '1',
			),
		),
	);

	if ( ! empty( $city ) ) {
		$out_of_time_event_args['meta_query'][] = array(
			'key'   => 'city',
			'value' => $city,
		);
	}

	if ( ! empty( $activity ) ) {
		$out_of_time_event_args['tax_query'][] = array(
			'taxonomy' => 'activity',
			'field'    => 'slug',
			'terms'    => array( $activity ),
		);
	}

	$out_of_time_event_query = new WP_Query( $out_of_time_event_args );

	if ( ! empty( $event_blocks['data'] ) ) {
		foreach ( $event_blocks['data'] as $date => $event_block ) :
			?>
			<div class="month-core">
				<div class="vert g20 month-line">
					<div class="new-p-18-21 black"><?php echo esc_html( 'Вечное' !== $date ? date_i18n( 'F', strtotime( $date ) ) : $date ); ?></div>
				</div>
				<div class="month-core-events">
					<?php
					global $post;
					foreach ( $event_block as $post ) :
						setup_postdata( $post );
						get_template_part( 'component-afisha-item' );
					endforeach;
					wp_reset_postdata();
					?>
				</div>
			</div>
			<?php
		endforeach;
	}

	$html = ob_get_clean();

	ob_start();

	if ( $out_of_time_event_query->have_posts() ) :
		?>
		<div class="month-core">
			<div class="vert g20 month-line">
				<div class="new-p-18-21 black">Вечное</div>
			</div>
			<div class="month-core-events">
				<?php
				while ( $out_of_time_event_query->have_posts() ) {
					$out_of_time_event_query->the_post();
					get_template_part( 'component-afisha-item' );
				}

				wp_reset_postdata();
				?>
			</div>
		</div>
		<?php
	endif;

	$out_of_time_html = ob_get_clean();

	wp_send_json_success(
		array(
			'content'          => $html,
			'outOfTimeContent' => $out_of_time_html,
			'page'             => $page,
			'totalCount'       => $event_blocks['totalCount'],
			'message'          => 'Блоки с постами успешно загружены',
			'all_events'       => $event_blocks['all_events'],
			'maxPages'         => $event_blocks['maxPages'],
			'formData'         => $_POST,
		)
	);
}

// хук для регистрации
add_action( 'init', 'bksq_create_taxonomies' );
function bksq_create_taxonomies() {
	register_taxonomy(
		'activity',
		array( 'events' ),
		array(
			'label'             => '',
			'labels'            => array(
				'name'          => 'Виды активности',
				'singular_name' => 'Вид активности',
				'search_items'  => 'Искать виды активности',
				'all_items'     => 'Все виды активности',
				'view_item '    => 'Просмотреть',
				'edit_item'     => 'Редактировать вид активности',
				'update_item'   => 'Обновить вид активности',
				'add_new_item'  => 'Добавить новый вид активности',
				'new_item_name' => 'Название вида активности',
				'back_to_items' => '← Назад к активностям',
				'menu_name'     => 'Виды активности',
			),
			'description'       => '',
			'public'            => true,
			'hierarchical'      => true,
			'rewrite'           => true,
			'capabilities'      => array(),
			'meta_box_cb'       => null,
			'show_admin_column' => true,
			'show_in_rest'      => null,
			'rest_base'         => null,
		)
	);
}

function bksq_get_event_meta_value_by_key( string $key ): array {
	global $wpdb;

	$query = $wpdb->prepare(
		"SELECT DISTINCT meta_mavue as $key
		FROM $wpdb->postmeta
		WHERE meta_key = '$key'
		AND post_id IN (
			SELECT ID
			FROM $wpdb->posts
			WHERE post_type = 'events'
			AND post_status = 'publish'
		)"
	);

	return $wpdb->get_col( $query );
}

function bksq_get_all_event_cities() {
	global $wpdb;

	$query = $wpdb->prepare(
		"SELECT DISTINCT meta_value AS city
		FROM {$wpdb->postmeta}
		WHERE meta_key = 'city' 
		AND post_id IN (
			SELECT ID 
			FROM {$wpdb->posts} 
			WHERE post_type = 'events' 
			AND post_status = 'publish'
		)"
	);

	return array_filter( $wpdb->get_col( $query ) );
}

function bksq_get_all_event_activities() {
	global $wpdb;

	$query = $wpdb->prepare(
		"SELECT DISTINCT meta_value AS activity
		FROM {$wpdb->postmeta}
		WHERE meta_key = 'activity' 
		AND post_id IN (
			SELECT ID 
			FROM {$wpdb->posts} 
			WHERE post_type = 'events' 
			AND post_status = 'publish'
		)"
	);

	$activities = $wpdb->get_col( $query );

	return array_filter( $activities );
}

function bksq_get_event_activity( $event ) {
	$activities = get_the_terms( $event, 'activity' );

	if ( is_array( $activities ) ) {
		$child_activity = null;

		foreach ( $activities as $activity ) {
			if ( 0 !== $activity->parent ) {
				$child_activity = $activity;
				break;
			}
		}

		if ( $child_activity !== null ) {
			return $child_activity;
		}

		return $activities[0];
	}

	return null;
}

function bksq_get_all_afisha_locations() {
	$afisha_posts = get_posts(
		array(
			'post_type'   => 'events',
			'numberposts' => -1,
			'meta_query'  => array(
				'relation' => 'OR',
				array(
					'key' => 'start_date',
				),
			),
		)
	);

	$locations = array_map(
		function ( $p ) {
			$object = array(
				'id'             => $p->ID,
				'title'          => get_the_title( $p->ID ),
				'coordinates'    => array_map( 'floatval', array_values( get_field( 'coordinates', $p->ID ) ?? array() ) ),
				'city'           => get_field( 'city', $p->ID ),
				'address'        => get_field( 'full_address', $p->ID ),
				'icon'           => bksq_get_activity_icon( bksq_get_event_activity( $p ) ),
				'is_out_of_time' => get_field( 'is_out_of_time', $p->ID ),
			);

			return $object;
		},
		$afisha_posts
	);

	return $locations;
}

function bksq_black_shortcode( $atts, $content = null ) {
	return '<strong class="text-black">' . do_shortcode( $content ) . '</strong>';
}
add_shortcode( 'black', 'bksq_black_shortcode' );

function bksq_get_activity_icon( $activity ) {
	$icon_url = get_template_directory_uri() . '/images/place.svg';

	if ( ! empty( $activity ) && ! empty( get_field( 'icon', $activity ) ) ) {
		return get_field( 'icon', $activity );
	}

	return $icon_url;
}

add_action( 'wp_ajax_load_more_passed_events', 'bksq_load_more_passed_events_via_ajax' );
add_action( 'wp_ajax_nopriv_load_more_passed_events', 'bksq_load_more_passed_events_via_ajax' );
function bksq_load_more_passed_events_via_ajax() {
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'load_more_passed_event' ) ) {
		error_log( 'Не пройдена проверка nonce при попытке загрузки прошедших мероприятий на странице Афиша' );

		wp_send_json_error(
			array(
				'message' => 'Ошибка в запросе!',
			)
		);
	}

	if ( empty( $_POST['page'] ) ) {
		wp_send_json_error(
			array(
				'message' => 'Не указан обязательный параметр page',
			)
		);
	}

	$page = intval( sanitize_text_field( wp_unslash( $_POST['page'] ) ) );

	$passed_event_args = array(
		'post_type'      => 'events',
		'posts_per_page' => 18,
		'paged'          => $page,
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

	ob_start();

	if ( $passed_event_query->have_posts() ) :
		while ( $passed_event_query->have_posts() ) :
			$passed_event_query->the_post();
			?>
			<?php get_template_part( 'component-passed-event' ); ?>
			<?php
		endwhile;
		wp_reset_postdata();
	endif;

	$html = ob_get_clean();

	wp_send_json_success(
		array(
			'html' => $html,
			'page' => $page,
		)
	);
}

/**
 * Рекурсивно формирует плоский список опций из иерархической структуры терминов
 *
 * @param array $terms      Массив терминов WP_Term
 * @param array &$options   Ссылка на результирующий массив опций
 * @param int   $level      Текущий уровень вложенности
 */
function bksq_flatten_terms_for_select( $terms, &$options, $level = 0 ) {
	if ( empty( $terms ) || ! is_array( $terms ) ) {
			return;
	}

	foreach ( $terms as $term ) {
			// Добавляем дефисы в зависимости от уровня вложенности
			$prefix = $level > 0 ? str_repeat( '&nbsp;&nbsp;', $level ) . ' ' : '';

			// Добавляем опцию в результирующий массив
			$options[ $term->slug ] = $prefix . $term->name;

			// Если у термина есть дочерние элементы, обрабатываем их рекурсивно
		if ( ! empty( $term->children ) ) {
			bksq_flatten_terms_for_select( $term->children, $options, $level + 1 );
		}
	}
}

function bksq_get_single_page_event_date( $post_id ) {
	$date_string = '';
	$start_date  = get_field( 'start_date', $post_id );
	$end_date    = get_field( 'end_date', $post_id );

	if ( empty( $start_date ) ) {
		return $date_string;
	}

	$formatted_start_date = date_i18n( 'd F Y', strtotime( $start_date ) );

	$date_string .= '<span>' . $formatted_start_date . '</span>';

	if ( empty( $end_date ) || $end_date === $start_date ) {
		return $date_string;
	}

	$date_string .= ' — ';

	$formatted_end_date = date_i18n( 'd F Y', strtotime( $end_date ) );

	$date_string .= '<span>' . $formatted_end_date . '</span>';

	return $date_string;
}
