=== Tikex ===
Contributors: j4nos
Donate link: https://tikex.com
Tags: ticket, payment, invoicing
Requires at least: 5.1
Tested up to: 5.7.2
Stable tag: 6.0.119
Requires PHP: 7.0
License: GPL-3.0
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Easy bank card payment and integration with invoicing solutions for events

== Description ==

Pluginünkkel vendégeid bankkártyás fizetést tudnak számodra indítani, s te számlát tudsz küldeni nekik.
Időpont alapú eseményeket támogatunk. 
A vásárlás során űrlapon egyedi információkat kérhetsz be a vendégektől. 
Bérlet vásárlásra, beváltásra is van lehetőség.

== Frequently Asked Questions ==

Which payment providers I can integrate with?

Barion.com is our first payment provider.

Which invoice solutions I can integrate with?

szamlazz.hu and billingo.hu is the two billing providers you can choose from.

= Where can I find more info? =

<a href="https://tikex.com/organizers">https://tikex.com/organizers</a>

== Changelog ==

= 5.0.0 =

- Tikex admin menü

= 4.0.0 =

- Giveaway

= 3.1.0 =

- Quantity editor

= 3.0.0 =

- Passes / Bérletek

== Upgrade Notice ==

= 1.0 =

- Payment and invoicing

== Screenshots ==

1. /plugin-directory/assets/pf.png

= ShortCode11 =

[tikex_buy_ticket_form team_slug="bor-es-piac" ad_slug="bortesztkostolo"]

= ShortCode13 =

[tikex_login]

= ShortCode14 =

[tikex_checkout]

= ShortCode15 =

[tikex_giveaway post_id="legszebb-szolobirtok" organization_short_id="bor-es-piac"]

= ShortCode21 =

[tikex_program_list organization_short_id="stitch-budapest"]

= ShortCode22 =

[tikex_program_detail program_id="ruhavarras-alapjai" organization_short_id="stitch-budapest"]

= ShortCode23 =

[tikex_adomanyozas ad_slug="pf-tamogatas-2" plan_id="xyz" price="2000" ad_sub_page_id="xyz" tema_slug="xyz"]

== Installation ==

Pluginünket az alábbi shortcode-okkal tudod használni. Paraméterként az alábbi példában a "teszt-program" érték van átadva. Ehelyett neked a saját progamod azonosítóját kell átadd. Regisztrálj be a <a href="https://tikex.com">https://tikex.com</a> oldalon, hozz létre egy programot, s az ott létrehozott program azonosítóját kell itt paraméterként átadni. Tovább infókat a https://tikex.com/organizers oldalon találsz.

<code>
[tikex_buy_ticket_form program_id="teszt-program"]
</code>

A fizetési folyamathoz két oldalt is létre kell hozzál, s el kell rajtuk helyezd az alábbi shortcode-okat.

<code>
[tikex_login]
[tikex_checkout]
</code>

A tikex_login shortcode kerüljön a /login aloldalra a tikex_checkout kerüljön a /checkout aloldalra.

Ha kérdésed van vagy elakadnál bátran keress bennünket az info@tikex.com email címen.