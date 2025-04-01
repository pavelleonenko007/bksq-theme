<?php
/**
 * Forms
 *
 * @package 0.0.1
 */

defined( 'ABSPATH' ) || exit;

add_filter( 'wp_mail_from', 'bksq_change_mail_from' );
function bksq_change_mail_from() {
	return 'noreply@combine.pics';
}

add_action( 'wp_mail_failed', 'bksq_log_email_fails' );
function bksq_log_email_fails( $error ) {
	error_log( $error->get_error_message(), 3, WP_CONTENT_DIR . '/debug.log' );
}

add_action( 'wp_ajax_submit_contact_form', 'bksq_submit_contact_form' );
add_action( 'wp_ajax_nopriv_submit_contact_form', 'bksq_submit_contact_form' );
function bksq_submit_contact_form() {
	$data               = $_POST;
	$data['User-Agent'] = $_SERVER['HTTP_USER_AGENT'];

	unset( $data['action'] );
	unset( $data['_wp_http_referer'] );

	$to               = ! empty( get_field( 'email_opc', 'option' ) ) ? get_field( 'email_opc', 'option' ) : get_option( 'admin_email' );
	$subject          = 'Contact form submission';
	$message          = '';
	$headers          = array(
		'content-type: text/html',
	);
	$attachments      = array();
	$uploads_dir_path = WP_CONTENT_DIR . '/uploads/';

	foreach ( $data as $key => $value ) {
	    if (is_array($value)) {
	        $message .= "<strong>$key:</strong> " . implode(', ', $value) . '<br>';
	    } else {
	        $message .= "<strong>$key:</strong> $value<br>";
	    }
	}

	if ( ! empty( $_FILES ) && isset( $_FILES['file'] ) && ! empty( $_FILES['file'] ) ) {
		if ( is_array( $_FILES['file']['name'] ) ) {
			foreach ( $_FILES['file']['name'] as $index => $file_name ) {
				$file_path = $uploads_dir_path . $file_name;

				move_uploaded_file( $_FILES['file']['tmp_name'][ $index ], $file_path );

				$attachments[] = $file_path;
			}
		} else {
			$file_name = $_FILES['file']['name'];
			$file_path = $uploads_dir_path . $file_name;

			move_uploaded_file( $_FILES['file']['tmp_name'], $file_path );

			$attachments[] = $file_path;
		}
	}

	$sended = wp_mail( $to, $subject, $message, $headers, $attachments );

	foreach ( $attachments as $attachment ) {
		unlink( $attachment );
	}

	if ( ! $sended ) {
		wp_send_json_error(
			array(
				'message' => 'Something wrong with sending your vacancy. Try again later!',
			),
			400
		);
	}

	wp_send_json_success(
		array(
			'message' => 'Your message successfully sent!',
		)
	);
}
