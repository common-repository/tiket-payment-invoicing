<?php
/**
 * Tiket Wordpress plugin
 *
 *
 * @package   Tikex Payment and Invoice Integration
 * @author    SkyMongoose Kft.
 * @license   GPL-3.0
 * @link      https://tikex.com
 * @copyright 2017 Pangolin (Pty) Ltd
 *
 * @wordpress-plugin
 * Plugin Name:       Tikex Payment and Invoice Integration
 * Plugin URI:        https://tikex.com
 * Description:       Payment and Invoice Integration for WordPress
 * Version:           6.0.119
 * Author:            SkyMongoose Kft.
 * Author URI:        https://tikex.com
 * Text Domain:       Tikex Payment and Invoice Integration
 */


namespace TiketWP\twppwr;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'TIKET_WP_PLUGIN_REACT', '3.1.0' );


/**
 * Autoloader
 *
 * @param string $class The fully-qualified class name.
 * @return void
 *
 *  * @since 1.0.0
 */
spl_autoload_register(function ($class) {

    // project-specific namespace prefix
    $prefix = __NAMESPACE__;

    // base directory for the namespace prefix
    $base_dir = __DIR__ . '/includes/';

    // does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }

    // get the relative class name
    $relative_class = substr($class, $len);

    // replace the namespace prefix with the base directory, replace namespace
    // separators with directory separators in the relative class name, append
    // with .php
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // if the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});

/**
 * Initialize Plugin
 *
 * @since 1.0.0
 */
function init() {
	$twppwr = Plugin::get_instance();
	$twppwr_shortcode11 = Shortcode11::get_instance();
    $twppwr_shortcode12 = Shortcode12::get_instance();
    $twppwr_shortcode13 = Shortcode13::get_instance();
    $twppwr_shortcode14 = Shortcode14::get_instance();
    $twppwr_shortcode16 = Shortcode16::get_instance();
    $twppwr_shortcode17 = Shortcode17::get_instance();
    $twppwr_shortcode21 = Shortcode21::get_instance();
    $twppwr_shortcode22 = Shortcode22::get_instance();
    $twppwr_shortcode23 = Shortcode23::get_instance();
    $twppwr_shortcode24 = Shortcode24::get_instance();
    $twppwr_shortcode25 = Shortcode25::get_instance();
    $twppwr_shortcode26 = Shortcode26::get_instance();
	$twppwr_admin = Admin::get_instance();

	// Check if /checkout and /login pages exist, and create them if they don't.
	/*$checkout_page = get_page_by_path( 'checkout' );
	if ( ! $checkout_page ) {
		$checkout_page = array(
            'post_title' => 'Checkout',
            'post_name'  => 'checkout',
            'post_status' => 'publish',
            'post_content' => '[tikex_checkout]',
            'post_type' => 'page',
            'post_author' => 1,
            'post_parent' => 0,
            'post_slug' => 'checkout'
        );
        $checkout_page_id = wp_insert_post( $checkout_page );
	}

	$login_page = get_page_by_path( 'login' );
	if ( ! $login_page ) {
		$login_page = array(
            'post_title' => 'Login',
            'post_name'  => 'login',
            'post_status' => 'publish',
            'post_content' => '[tikex_login]',
            'post_type' => 'page',
            'post_author' => 1,
            'post_parent' => 0,
            'post_slug' => 'login'
        );
        $login_page_id = wp_insert_post( $login_page );
	}*/
}

/*function tiketwp_handle_php_errors()
{
    // Turn off the display of PHP errors
    ini_set('display_errors', 0);

    // Log PHP errors to a file
    ini_set('log_errors', 1);
    ini_set('error_log', WP_CONTENT_DIR . '/php_errors.log');

    // Set the error reporting level
    error_reporting(E_ALL);
}

function disable_plugin_update_notification() {
    remove_action('admin_notices', 'update_nag', 3);
}

function remove_all_admin_notices() {
    remove_all_actions('admin_notices');
}


add_action('init', 'TiketWP\\twppwr\\tiketwp_handle_php_errors');
add_action('admin_menu', 'disable_plugin_update_notification');
add_action('admin_init', 'remove_all_admin_notices');*/

add_action( 'plugins_loaded', 'TiketWP\\twppwr\\init' );

/**
 * Register activation and deactivation hooks
 */

register_activation_hook( __FILE__, array( 'TiketWP\\twppwr\\Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'TiketWP\\twppwr\\Plugin', 'deactivate' ) );
