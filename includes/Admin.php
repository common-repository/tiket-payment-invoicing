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
 * @subpackage Admin
 */
class Admin {

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Plugin basename.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_basename = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;


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
	 * Initialize the plugin by loading admin scripts & styles and adding a
	 * settings page and menu.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
		$plugin = Plugin::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
		$this->version = $plugin->get_plugin_version();

		$this->plugin_basename = plugin_basename( plugin_dir_path( realpath( dirname( __FILE__ ) ) ) . $this->plugin_slug . '.php' );
	}


	/**
	 * Handle WP actions and filters.
	 *
	 * @since 	1.0.0
	 */
	private function do_hooks() {
		// Load admin style sheet and JavaScript.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

		// Add the options page and menu item.
		add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );

		// Add plugin action link point to settings page
		add_filter( 'plugin_action_links_' . $this->plugin_basename, array( $this, 'add_action_links' ) );
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_styles() {
		if ( ! isset( $this->plugin_screen_hook_suffix ) ) {
			return;
		}
		$screen = get_current_screen();
		if ( $this->plugin_screen_hook_suffix == $screen->id || $screen->id == "tikex_page_tiket-on-wordpress-eventtimeseditor" || $screen->id == "tikex_page_tiket-on-wordpress-eventseditor" || $screen->id == "tikex_page_tiket-on-wordpress-payeeseditor") {
			wp_enqueue_style( $this->plugin_slug . '-style', plugins_url( 'assets/css/admin.css', dirname( __FILE__ ) ), array(), $this->version );
			//wp_enqueue_style( $this->plugin_slug . '-style-2', plugins_url( 'node_modules/react-datepicker/dist/react-datepicker.css', dirname( __FILE__ ) ), array(), $this->version );
		}
		if ( $this->plugin_screen_hook_suffix == $screen->id || $screen->id == "tikex_page_tiket-on-wordpress-eventtimeseditor") {
			//wp_enqueue_style( $this->plugin_slug . '-style-3', plugins_url( 'assets/css/plugin.css', dirname( __FILE__ ) ), array(), $this->version );
			wp_enqueue_style( $this->plugin_slug . '-style-4', plugins_url( 'assets/css/ReactDatePickerCustom.css', dirname( __FILE__ ) ), array(), $this->version );
			wp_enqueue_style('react-datepicker', 'https://unpkg.com/react-datepicker/dist/react-datepicker.css');
		}

		wp_enqueue_style( $this->plugin_slug . '-style-5', plugins_url( 'assets/css/hideSystemComponentsFromAdminPage.css', dirname( __FILE__ ) ), array(), $this->version );
	}

	/**
	 * Register and enqueue admin-specific javascript
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_scripts() {
		if ( ! isset( $this->plugin_screen_hook_suffix ) ) {
			return;
		}

		$screen = get_current_screen();

		if (  $screen->id == "tikex_page_tiket-on-wordpress-eventseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-eventseditor', plugins_url( 'assets/js/eventseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if ( $screen->id == "tikex_page_tiket-on-wordpress-eventtimeseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-eventtimeseditor', plugins_url( 'assets/js/eventtimeseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if (  $screen->id == "tikex_page_tiket-on-wordpress-productseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-productseditor', plugins_url( 'assets/js/productseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if ( $this->plugin_screen_hook_suffix == $screen->id || $screen->id == "tikex_page_tiket-on-wordpress-profile" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-profile', plugins_url( 'assets/js/profile.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if (  $screen->id == "tikex_page_tiket-on-wordpress-purchases" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-purchases', plugins_url( 'assets/js/purchases.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if (  $screen->id == "tikex_page_tiket-on-wordpress-translationseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-translationseditor', plugins_url( 'assets/js/translationseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if ( $screen->id == "tikex_page_tiket-on-wordpress-teams" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-teams', plugins_url( 'assets/js/teams.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if (  $screen->id == "tikex_page_tiket-on-wordpress-payeeseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-payeeseditor', plugins_url( 'assets/js/payeeseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if (  $screen->id == "tikex_page_tiket-on-wordpress-formseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-formseditor', plugins_url( 'assets/js/formseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if (  $screen->id == "tikex_page_tiket-on-wordpress-passeseditor" ) {
			wp_enqueue_script( $this->plugin_slug . '-admin-passeseditor', plugins_url( 'assets/js/passeseditor.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}

		if ( $this->plugin_screen_hook_suffix == $screen->id || $screen->id == "admin_page_login-page" ) {
			wp_enqueue_script( 'tiket-on-wordpress-shortcode13', plugins_url( 'assets/js/shortcode13.js', dirname( __FILE__ ) ), array( 'jquery' ), $this->version );
		}
	}

	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {
		/*
		 * Add a settings page for this plugin to the Settings menu.
		 */
		$this->plugin_screen_hook_suffix = add_menu_page(
			__( 'Tikex', $this->plugin_slug ),
			__( 'Tikex', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug,
			array( $this, 'display_profile_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Bérletek', $this->plugin_slug ),
			__( 'Bérletek', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-passeseditor',
			array( $this, 'display_passeseditor_page' )
		);
		
		add_submenu_page(
			$this->plugin_slug,
			__( 'Csapataim', $this->plugin_slug ),
			__( 'Csapataim', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-teams',
			array( $this, 'display_teams_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Fordítások', $this->plugin_slug ),
			__( 'Fordítások', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-translationseditor',
			array( $this, 'display_translationseditor_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Időpontok', $this->plugin_slug ),
			__( 'Időpontok', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-eventtimeseditor',
			array( $this, 'display_eventtimes_editor_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Kedvezményezettek', $this->plugin_slug ),
			__( 'Kedvezményezettek', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-payeeseditor',
			array( $this, 'display_payees_editor_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Profil', $this->plugin_slug ),
			__( 'Profil', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug,
			array( $this, 'display_profile_page' )
		);

		/*add_submenu_page(
			$this->plugin_slug,
			__( 'Termékek', $this->plugin_slug ),
			__( 'Termékek', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-productseditor',
			array( $this, 'display_products_editor_page' )
		);*/

		add_submenu_page(
			$this->plugin_slug,
			__( 'Termékek', $this->plugin_slug ),
			__( 'Termékek', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-eventseditor',
			array( $this, 'display_events_editor_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Űrlapok', $this->plugin_slug ),
			__( 'Űrlapok', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-formseditor',
			array( $this, 'display_forms_editor_page' )
		);

		add_submenu_page(
			$this->plugin_slug,
			__( 'Vásárlások', $this->plugin_slug ),
			__( 'Vásárlások', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug . '-purchases',
			array( $this, 'display_purchases_page' )
		);

		// Add your custom page without a menu item
		add_submenu_page(
			null,
			__( 'Custom Page', $this->plugin_slug ),
			__( 'Custom Page', $this->plugin_slug ),
			'read',
			'login-page',
			array( $this, 'display_custom_page' )
		);
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_products_editor_page() {
		?><div id="tiket-on-wordpress-productseditor">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_events_editor_page() {
		?><div id="tiket-on-wordpress-eventseditor">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_payees_editor_page() {
		?><div id="tiket-on-wordpress-payeeseditor">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_forms_editor_page() {
		?><div id="tiket-on-wordpress-formseditor">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_eventtimes_editor_page() {
		?><div id="tiket-on-wordpress-eventtimeseditor">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_profile_page() {
		?><div id="tiket-on-wordpress-profile">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_purchases_page() {
		?><div id="tiket-on-wordpress-purchases">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_translationseditor_page() {
		?><div id="tiket-on-wordpress-translationseditor">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_teams_page() {
		?><div id="tiket-on-wordpress-teams">
		</div><?php
	}

	/**
	 * Render the first submenu page.
	 *
	 * @since    1.0.0
	 */
	public function display_passeseditor_page() {
		?><div id="tiket-on-wordpress-passeseditor">
		</div><?php
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links( $links ) {
		return array_merge(
			array(
				'settings' => '<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_slug ) . '">' . __( 'Settings', $this->plugin_slug ) . '</a>',
			),
			$links
		);
	}

	/**
	 * Render the custom page content.
	 *
	 * @since    1.0.0
	 */
	public function display_custom_page() {
		echo '<div id="login-page">';
		echo do_shortcode('[tikex_login]');
		echo '</div>';
	}
}
