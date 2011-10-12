
<?php

/*

Plugin Name: Recensements
Description: This plug-in will display a graphical report for admin about, keyword mentions in articles.
Version: 0.6
Author: amsayk

*/

function recensements_report_deactivate() {}

function recensements_report_activation() {}

function recensements_report() {

    ?>

<div id="recensements">

    <div id="form">
        <?php include __DIR__ . '/genform.php'; ?> <!-- Incde the form -->
    </div>

    <div id="graph">
        <div style="width: 95%; height: 500px;" class="wrapper" id="recensements-graph"></div>
    </div>

    <div id="table">
        <div class="wrapper" id='recensements-table'>
            <ul>
                <li><a href="#tabs-1">Dummy tab</a></li>
            </ul>
            <div id="tabs-1">
                <p> Dummy tab
                </p>
            </div>
        </div>
    </div>

</div>



<?php
}

function recensements_report_add_to_menu() {
	$page = add_options_page('Page des Recensements', 'Les recensements', 'manage_options', __FILE__, 'recensements_report' );
    add_action("admin_print_scripts-$page", 'generate_series_scripts');
    add_action("admin_print_styles-$page", 'generate_series_styles');
}

if (is_admin()) {
	add_action('admin_menu', 'recensements_report_add_to_menu');
}

register_activation_hook(__FILE__, 'recensements_report_activation');
add_action('admin_menu', 'recensements_report_add_to_menu');
register_deactivation_hook( __FILE__, 'recensements_report_deactivate' );


add_action('wp_ajax_generate_series', 'generate_series');
add_action('wp_ajax_generate_table', 'generate_table');

function generate_series_scripts(){

   // isDate
   //wp_enqueue_script("isDate", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/is_date.js"));

   // List Builder
   //wp_enqueue_script("listbuilder", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jQuery.listbuilder.js"), array('jquery'));

   //wp_enqueue_script("dateformat", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/date_format.js"));

   //jquery.datePicker
   //wp_enqueue_script("date.js", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/date.js"));

    //JQuery UI DatePicker
   //wp_enqueue_script("jquery.ui.datePicker.fr", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jquery.ui.datepicker-fr.js"));
   wp_enqueue_script("jquery.ui.datePicker", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jquery-ui-1.8.16.custom.min.js"));

   //JqPlot
   wp_enqueue_script("excanvas", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jqplot/excanvas.min.js"));
   wp_enqueue_script("jqplot", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jqplot/jquery.jqplot.min.js"), array( 'jquery' ));
   wp_enqueue_script("jqplot.canvasTextRenderer", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jqplot/plugins/jqplot.canvasTextRenderer.min.js"), array( 'jqplot' ));
   wp_enqueue_script("jqplot.canvasAxisTickRenderer", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js"), array( 'jqplot' ));
   wp_enqueue_script("jqplot.barRenderer", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jqplot/plugins/jqplot.barRenderer.min.js"), array( 'jqplot' ));
   wp_enqueue_script("jqplot.categoryAxisRenderer", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/jqplot/plugins/jqplot.categoryAxisRenderer.min.js"), array( 'jqplot' ));

    //WIJMO
   //wp_enqueue_script("WIJMO.tabs", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/wijmo/jquery.wijmo.wijtabs.min.js"));

   //TaBLe Sorter
   wp_enqueue_script("jQuery.metadata", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/tablesorter/jquery.metadata.js"));
   wp_enqueue_script("jQuery.tablesorter", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/tablesorter/jquery.tablesorter-update.min.js"));

   //wp_enqueue_script("generate-series", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/generate_series.js"));
   //wp_enqueue_script("generate_series", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/main.js")); //main=is_date.js+jQuery.listbuilder.js+date_format.js+date.js+jquery.ui.datepicker-fr.js+generate_series.js
   wp_enqueue_script("generate_series", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/js/all.js")); //main=is_date.js+jQuery.listbuilder.js+date_format.js+date.js+jquery.ui.datepicker-fr.js+generate_series.js
}

function generate_series_styles(){
   wp_enqueue_style("generate_series", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/style.css"));

   // jqplot
   wp_enqueue_style("jqplot", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/jqplot/jquery.jqplot.css"));

   // List Builder
   wp_enqueue_style("listbuilder", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/jQuery.listbuilder.css"));

   //TAbleSorter
   wp_enqueue_style("jQuery.tablesorter", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/tablesorter/blue/style.css"));

    //WIJMO
   //wp_enqueue_style("WIJMO.jquery", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/wijmo/themes/rocket/jquery-wijmo.css"));
   //wp_enqueue_style("WIJMO.tabs", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/wijmo/themes/wijmo/jquery.wijmo.wijtabs.css"));

    // JQuery UI DatePicker CSS
   wp_enqueue_style("jquery.ui.datePicker.css", path_join(WP_PLUGIN_URL, basename( dirname( __FILE__ ) ) . "/css/pepper-grinder/jquery-ui-1.8.16.custom.css"));
}

// --------------------------------------------------------------------------------------------------------------------------------------------

require __DIR__ . "/includes/series-functions.php";

// --------------------------------------------------------------------------------------------------------------------------------------------

function generate_table(){

    function get_table_results($start, $end, $keyword) {
        global $wpdb;

        $sSql = "SELECT posts.ID as post_id, users.display_name as author, posts.post_title as title, posts.post_date as published";
        $sSql = $sSql . " FROM $wpdb->posts posts, $wpdb->users users";
        $sSql = $sSql . " WHERE posts.post_author = users.ID";
        $sSql = $sSql . " AND posts.post_type = 'post' AND posts.post_status = 'publish' AND posts.post_date >= '" . date('Y-m-d', strtotime($start)) . "' AND posts.post_date <= '" . date('Y-m-d', strtotime($end)) . "'";
        $sSql = $sSql . " AND (ucase(posts.post_title) like '%" . strtolower($keyword) . "%'";
        $sSql = $sSql . " OR ucase(posts.post_content) like '%" . strtolower($keyword) . "%')";
        $sSql = $sSql . " order by posts.post_date desc";

        return @$wpdb->get_results($sSql);
    }

    function get_all_cats_links_for_post($post_id) {
        if(!isset($post_id)) return array();

        require_once(ABSPATH . WPINC . '/category-template.php');

        $categories = get_the_category( $post_id );

        if ( empty( $categories ) )
            return '<a href="' . get_option('siteurl') . '/wp-dev/?cat=1" title="' . esc_attr( sprintf( __( "Afficher les articles dans %s" ), $category->name ) ) . '" ' . $rel . '>' . $category->name.'</a>&nbsp;&nbsp;';

        $thelist = '';
        $first=true;
        foreach ( $categories as $category ) {
            if(! $first) $thelist .= '|&nbsp;';
            $first=false;
            $thelist .= '<a href="' . get_category_link( $category->term_id ) . '" title="' . esc_attr( sprintf( __( "Afficher les articles dans %s" ), $category->name ) ) . '" ' . $rel . '>' . $category->name.'</a>&nbsp;';
        }

        return $thelist;
    }

    $siteurl = get_option('siteurl');

    $StartDate = isset($_REQUEST['StartDate']) ? urldecode($_REQUEST['StartDate']) : null;
    $EndDate = isset($_REQUEST['EndDate']) ? urldecode($_REQUEST['EndDate']) : date('Y-m-d');
    $Keyword = isset($_REQUEST['Keyword']) ? trim(urldecode($_REQUEST['Keyword'])) : null;

    if (! ($res = validateDates($StartDate, $EndDate))) {

        $tableStr = <<<STR
<table id="recensements-table-$Keyword" class="tablesorter">
<thead>
<tr>
    <th style="cursor:pointer;cursor:hand;">Date publi&eacute;e</th>
    <th style="cursor:pointer;cursor:hand;">Auteur</th>
    <th style="cursor:pointer;cursor:hand;">Article</th>
    <th style="cursor:pointer;cursor:hand;">Cat&eacute;gories</th>
</tr>
</thead>
<tbody>
STR;
        
        foreach(get_table_results($StartDate, $EndDate, $Keyword) as $post_line) {
            $published_date = date("d/m/Y", strtotime($post_line->published));
            $author_name    = $post_line->author;

            $post_link_href = $siteurl . "?p=" . urlencode($post_line->post_id);
            $post_link      = "<a title=\"\" href=\"$post_link_href\">" . $post_line->title . "</a>";

            $cats = get_all_cats_links_for_post($post_line->post_id);

            $tableStr .= "<tr><td>$published_date</td><td>$author_name</td><td>$post_link</td><td>$cats</td></tr>";
        }

        $tableStr .= '</tbody></table>';

        header('content-type:text/html; charset=utf-8');

        echo $tableStr;

    }

    else {

        header('content-type:text/plain; charset=utf-8', null, 422);
        echo $res['Msg'];
    }

    die;
}

function generate_series(){

    $DisplayType = isset($_REQUEST['DisplayType']) ? urldecode($_REQUEST['DisplayType']) : null;
    $StartDate = isset($_REQUEST['StartDate']) ? urldecode($_REQUEST['StartDate']) : null;
    $EndDate = isset($_REQUEST['EndDate']) ? urldecode($_REQUEST['EndDate']) : date('Y-m-d');
    $Keyword = isset($_REQUEST['Keyword']) ? trim(urldecode($_REQUEST['Keyword'])) : null;

    function get_results($DisplayType, $StartDate, $EndDate, $Keyword) {
        switch(intval($DisplayType)) {
            case Series::WEEKLY : return generate_weekly_series($StartDate, $EndDate, $Keyword);
            case Series::MONTHLY : return generate_monthly_series($StartDate, $EndDate, $Keyword);

            case Series::DAILY :
            default :
                return generate_daily_series($StartDate, $EndDate, $Keyword);
        }
    }

    if (! ($res = validateDates($StartDate, $EndDate))) {

        header('content-type:application/json; charset=utf-8');

        function getSumOfPosts($arr) {
            $sum = 0;
            foreach($arr as $ele)
                $sum += $ele['Posts'];
            return $sum;
        }

        $res = get_results($DisplayType, $StartDate, $EndDate, $Keyword);

        echo json_encode(array(
                          'Success' => true,
                          'Keyword' => $Keyword,
                          'TotalPosts' => getSumOfPosts($res),
                          'Result' => $res
        ));
        
    }

    else {

        header('content-type:application/json; charset=utf-8', null, 422);
        echo json_encode(array(
                         'Success' => false,
                         'Result' => $res
                     ));
    }

    die; //Neccessary in ajax requests or Wordpress will do die(0), which will make your JSON response an error

}

function validateDates($StartDate, $EndDate) {
   $now = time();
   $startLong = strtotime($StartDate);
   $in_valid =  $startLong == false || $startLong < 0 || $startLong > $now;

   if($in_valid) {
        return array('Msg' => 'La date de début est invalide');
   }

   $endLong = strtotime($EndDate);
   $in_valid =  $endLong == false || $endLong < 0 || $endLong > $now || $endLong <= $startLong;

   if($in_valid) {
       return array('Msg' => 'La date de fin est invalide');
   }

   return 0;
}

?>
