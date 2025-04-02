<head>
		<meta charset="utf-8">
		<meta content="width=device-width, initial-scale=1" name="viewport">
		<link href="https://fonts.googleapis.com" rel="preconnect">
		<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></script>
		<script type="text/javascript">WebFont.load({  google: {    families: ["Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"]  }});</script>
		<script type="text/javascript">!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);</script>
		<link href="https://thevogne.ru/clients/creativepeople/bsqr/main.css" rel="stylesheet">
		<!-- <script defer src="https://thevogne.ru/clients/creativepeople/bsqr/app.js"></script> -->
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css">
		<style>
.swiper {
	overflow: visible;
}
.swiper-scrollbar {
display:none;
}

.slider-card-details-box.no-tab {
    display: flex !important;
}
		
		</style>
		<script id="query_vars">
var query_vars =
  '<?php global $wp_query; echo serialize($wp_query->query) ?>';
		</script>
		<?php wp_head(); ?>
		<?php if(function_exists('get_field')) { echo get_field('head_code', 'option'); } ?>
		<?php if(file_exists(dirname( __FILE__ ).'/header_code.php')){ include_once 'header_code.php'; } ?>

	</head>