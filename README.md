# AU_Postcode_Map
Display an interactive map of Australian Postcodes

This code is an example of one way to use publicly available data and tools to display an interactive map of Australia showing suburbs for each postcode.

Aquire the data
===============
- Download the Postal Areas shapefile from the [ABS](https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/digital-boundary-files)
- Use [MapShaper.org](https://mapshaper.org) to convert the file
    - Import the Shape File (zip) into MapShaper (quick import is fine).
    - Simplify ... for my example I went with 15% and applied any repairs. This gives a reasonable fidelity and a managable file for later steps (depending on your accuracy and performance needs this may change)
    - Export the map as a GeoJSON file. I have included that as `POA_2021_AUST_GDA2020_15percent.json`.

- Download the AU Postcodes file (commercial) from [AusPost](https://auspost.com.au/business/marketing-and-communications/access-data-and-insights/address-data/postcode-data) or you can use the older (but still largely accurate) version from [Elkfox](https://github.com/Elkfox/Australian-Postcode-Data/tree/master). This is optional, but does allow the suburb names to be added to the GeoJSON

Clean/Enrich the data
=====================
As the GeoJSON will contain some extraneous data that isn't useful for this project I built a small PHP script which only copies across the features I need, and rather than bring across all the properties just gets the postcode and embeds the suburb names (you could choose to do the postcode/suburb lookup on demand, in fact for our internal implementation we're doing that and some other data lookup via ajax calls)

Either in a browser, or from the command line, run `postcodes.php`. The script assumes that the GeoJSON file will be named as above, and the postcodes will be in `au_postcodes.csv`. Obviously you can edit that as needed. The script will produce a `map.json` file that is used in the interactive display, and list any postcodes it was unable to match.

Display the data
================
Inspired by an article by [Luke Singham](https://lukesingham.com/map-of-australia-using-osm-psma-and-shiny/) on this topic (wish I'd found the article sooner, as it would have saved me some deadends. Also shows some good alternative ways to collect and cleanse the data) I decided to go with [Leaflet](https://leafletjs.com).

The `index.html` page contains a div to display the map in, and loads jQuery, leaflet, and [turfjs](https://github.com/Turfjs/turf) scripts.

The `script.js` handles the data loading and display using Leaflet. It assigns random colours to each postcode, and updates the info box with the postcode and suburbs when you mouse over. It includes a (commented out) section (inspired by sample from [Abdurrahman Yildiz](https://github.com/abdurrahmanyildiz/geojson-feature-merger))that demonstrates using Turf to filter the data to only show specific groups of postcodes (updating the properties to keep the info box correct).