<?php


abstract class Series
{

    const DAILY = 1;
    const WEEKLY = 2;
    const MONTHLY = 3;

    protected $StartDate;
    protected $EndDate;
    protected $Keyword;

    function __construct($StartDate, $EndDate, $Keyword)
    {
        $this->StartDate = $StartDate;
        $this->EndDate = $EndDate;
        $this->Keyword = $Keyword;
    }

    abstract function getResults();

    public function getEndDateAsLong()
    {
        return strtotime($this->EndDate);
    }

    public function getKeyword()
    {
        return $this->Keyword;
    }

    public function getStartDateAsLong()
    {
        return strtotime($this->StartDate);
    }
}

class WeeklySeries extends Series
{

    function getResults()
    {
        global $wpdb;

        $sSql = "SELECT COUNT(*) as posts, WEEK(post_date) as week, date(DATE_ADD(post_date, INTERVAL(1-DAYOFWEEK(post_date)) DAY)) as week_start, date(DATE_ADD(post_date, INTERVAL(7-DAYOFWEEK(post_date)) DAY)) as week_end";
        $sSql = $sSql . " FROM $wpdb->posts";
        $sSql = $sSql . " WHERE post_type = 'post' AND post_status = 'publish' AND post_date >= '" . date('Y-m-d', $this->getStartDateAsLong()) . "' AND post_date <= '" . date('Y-m-d', $this->getEndDateAsLong()) . "'";
        $sSql = $sSql . " AND (ucase(post_title) like '%" . strtolower($this->getKeyword()) . "%'";
        $sSql = $sSql . " OR ucase(post_content) like '%" . strtolower($this->getKeyword()) . "%')";
        $sSql = $sSql . " GROUP BY YEARWEEK(post_date) order by YEARWEEK(post_date) asc";

        $ret = array();
        foreach ($wpdb->get_results($sSql) as $post) {
            $ret[] = array(
                'Week' => $post->week,
                'WeekStart' => $post->week_start,
                'WeekEnd' => $post->week_end,
                'Posts' => $post->posts
            );
        }

        return $ret;
    }
}

class MonthlySeries extends Series
{

    function getResults()
    {

        global $wpdb;

        $sSql = "SELECT MONTH(post_date) as month, YEAR(post_date) as year, COUNT(*) as posts";
        $sSql = $sSql . " FROM $wpdb->posts";
        $sSql = $sSql . " WHERE post_type = 'post' AND post_status = 'publish' AND post_date >= '" . date('Y-m-d', $this->getStartDateAsLong()) . "' AND post_date <= '" . date('Y-m-d', $this->getEndDateAsLong()) . "'";
        $sSql = $sSql . " AND (ucase(post_title) like '%" . strtolower($this->getKeyword()) . "%'";
        $sSql = $sSql . " OR ucase(post_content) like '%" . strtolower($this->getKeyword()) . "%')";
        $sSql = $sSql . " GROUP BY month, year order by year asc, month asc limit 0, 12";

        $ret = array();
        foreach ($wpdb->get_results($sSql) as $post) {
            $ret[] = array(
                'Month' => $post->month,
                'Year' => $post->year,
                'Posts' => $post->posts
            );
        }

        return $ret;
    }
}

class DailySeries extends Series
{

    function getResults()
    {
        global $wpdb;

        $sSql = "SELECT date(post_date) as date, COUNT(*) as posts";
        $sSql = $sSql . " FROM $wpdb->posts";
        $sSql = $sSql . " WHERE post_type = 'post' AND post_status = 'publish' AND post_date >= '" . date('Y-m-d', $this->getStartDateAsLong()) . "' AND post_date <= '" . date('Y-m-d', $this->getEndDateAsLong()) . "'";
        $sSql = $sSql . " AND (ucase(post_title) like '%" . strtolower($this->getKeyword()) . "%'";
        $sSql = $sSql . " OR ucase(post_content) like '%" . strtolower($this->getKeyword()) . "%')";
        $sSql = $sSql . " GROUP BY date order by date asc";

        $ret = array();
        foreach ($wpdb->get_results($sSql) as $post) {
            $ret[] = array(
                'PostDate' => $post->date,
                'Posts' => $post->posts
            );
        }

        return $ret;
    }
}

function generate_weekly_series($StartDate, $EndDate, $Keyword)
{
    $series = new WeeklySeries($StartDate, $EndDate, $Keyword);
    return $series->getResults();
}

function generate_monthly_series($StartDate, $EndDate, $Keyword)
{
    $series = new MonthlySeries($StartDate, $EndDate, $Keyword);
    return $series->getResults();
}

function generate_daily_series($StartDate, $EndDate, $Keyword)
{
    $series = new DailySeries($StartDate, $EndDate, $Keyword);
    return $series->getResults();
}

?>
