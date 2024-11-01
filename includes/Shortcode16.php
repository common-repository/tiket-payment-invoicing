<?php
/**
 * tiket-on-wordpress
 *
 *
 * @package   tiket-on-wordpress
 * @author    Pangolin
 * @license   GPL-3.0
 * @link      https://gopangolin.com
 * @copyright 2017 Pangolin (Pty) Ltd
 */

namespace TiketWP\twppwr;

/**
 * @subpackage Shortcode
 */
class Shortcode16 {

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
		$plugin = Plugin::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
		$this->version = $plugin->get_plugin_version();

		add_shortcode( 'tikex_premium_content', array( $this, 'shortcode' ) );
	}


	/**
	 * Handle WP actions and filters.
	 *
	 * @since 	1.0.0
	 */
	private function do_hooks() {
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_scripts' ) );
	}

	/**
	 * Register frontend-specific javascript
	 *
	 * @since     1.0.0
	 */
	public function register_frontend_scripts() {
		wp_register_script( $this->plugin_slug . '-shortcode-script16', plugins_url( 'assets/js/shortcode16.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		wp_register_style( $this->plugin_slug . '-shortcode-style16-2', plugins_url( 'assets/css/plugin.css', dirname( __FILE__ ) ), $this->version );
	}

	public function shortcode( $atts ) {
		wp_enqueue_script( $this->plugin_slug . '-shortcode-script16' );
		wp_enqueue_style( $this->plugin_slug . '-shortcode-style16-2' );

		$object_name = 'twppwr_object_' . uniqid();

		$object = shortcode_atts( array(
			'program_id' 	  					=> '',
			'organization_short_id'	 	  		=> '',
			'api_nonce' 						=> wp_create_nonce( 'wp_rest' ),
			'api_url'							=> rest_url( $this->plugin_slug . '/v1/' ),
		), $atts, 'tiket-on-wordpress' );

		wp_localize_script( $this->plugin_slug . '-shortcode-script16', $object_name, $object );

		$shortcode = '<div class="tiket-on-wordpress-shortcode16" data-object-id="' . $object_name . '"></div>';
		return $shortcode;
	}
}
