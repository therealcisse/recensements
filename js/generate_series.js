jQuery(function($) {

    $.jqplot.config.enablePlugins = true;
    window.generatedOne = false;

    function plural(str, toAdd, num) {
        if(num > 1) return str + toAdd;
        return str
    }

    /**
     * Enables or disables any matching elements.
     */
    $.fn.enable = function(b) {
        if (b === undefined) {
            b = true;
        }
        return this.each(function() {
            this.disabled = !b;
        });
    };

    $.fn.doBusy = function(fn) {
        $('<span id="loading"></span>').insertBefore(this);
        this.enable(false);
        
        var $ctx = this;
        fn(function onDoneWorking(){
            $ctx.enable();
            $ctx.parent().find('#loading').remove();
        });
    };

    // Very cool stuff, because of this we can parse the body even if the response is an error, nice for receiving validation errors in getJSON
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (options.parseError) {
            $.Deferred(
                function(defer) {
                    jqXHR.done(defer.resolve)
                        .fail(function(jqXHR, statusText, errorMsg) {
                            if(jqXHR.statusCode()==500) //TODO: test case where statusCode==500
                                defer.rejectWith(this, [ jqXHR, statusText, errorMsg ]);
                            else
                                defer.rejectWith(this, [ $.parseJSON(jqXHR.responseText), "success", jqXHR ]);
                        });
                }).promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
        }
    });

    collapsible(this);

    //-----------------------------------------------------------------------------------------------------

    // TODO: implement a RESTful-style system
    function loadCnt(URL, panelEl) {
        //$(panelEl).html('Done Loading tab');
    }

    var myTabs = $("#recensements-table").wijtabs({
        tabTemplate: '<li><a href="#{href}">#{label} </a> </li>',
        spinner: '<em class="loading">Chargement de contenu...</em>',
        add: function(evt, ui) {
            $(ui.panel).html('<div class="loading"></div>');

            if(ui.index == 0) { //If first tab, show its content
                //setTimeout(function(){
                    //var URL = ui.tab.href.split(/#/)[0].split(/:/)[1];
                    //URL&&loadCnt(URL, ui.panel);
                //}, 0);
            }

            setTimeout(function(){
                $('table', ui.panel).tablesorter({
                    widthFixed: true,
                    locale: 'en',
                    widgets: ['zebra'],
                    headers: {0: {sorter: true}, 1: {sorter: false}, 2: {sorter: false}, 3: {sorter: false}}
                });
            }, 100);
        },
        show: function (evt, ui) {
            //var URL = ui.tab.href.split(/#/)[0].split(/:/)[1];
            //LOAD IT
            //URL&&loadCnt(URL, ui.panel);
        },
        alignment: 'top',
        scrollable: true
    });

    //-----------------------------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------------------------------------

    Date.firstDayOfWeek = 0;
    Date.format = 'yy-mm-dd';

    setUpForDailySeries();
    setUpValidation();

    $('#Keywords').listbuilder({
        width: '90%',
        height: '150px',
        labelReplacement: '<label for="Keywords"></label>'
    });

    function setUpDatePicker(incr) {
        $('.date-pick').datepicker('destroy');
        $('.date-pick').datepicker({
            changeMonth: true,
            numberOfMonths: 3,
            changeYear: true,
            showWeek: true,
            maxDate: new Date().asString(),
            dateFormat: Date.format, //'yy-mm-dd',
            onSelect: function(selectedDate, instance) {
                var opt = this.id == 'StartDate' ? 'minDate' : 'maxDate';
                var incr = this.id == 'StartDate' ? incr : -incr;
                if (selectedDate) {
                    var date = $.datepicker.parseDate(
                        instance.settings.dateFormat ||
                            $.datepicker._defaults.dateFormat,
                        selectedDate, instance.settings);

                    $('.date-pick').not(this).datepicker('option', opt, date.addDays(incr).asString());
                }
            }
        });
        $('#StartDate').datepicker('option', 'maxDate', String(-incr));
    }

    function setUpForDailySeries() { setUpDatePicker(1); }
    function setUpForWeeklySeries() { setUpDatePicker(7); }
    function setUpForMonthlySeries() { setUpDatePicker(30); }

    function printErrorMsg(it, errorMsg) {
        window.clearTimeout(window.validationTimeout);

        var msg = $('#msg');

        msg.html('<div class="error"><span class="icon"></span><span>' + errorMsg + '</span></div>').slideDown();
        window.validationTimeout = window.setTimeout(function() {
            msg.slideUp().empty();
        }, 7000);
        it && window.setTimeout(function() {
            it.focus();
        }, 400);

        console.log(errorMsg);
        return false;
    }

    function setUpValidation() {

        function validateEmpty(id, errorMsg) { //todo: add to printErrorMsg
            var it = $('#' + id),
                val = it.val();

            val = val != null ? val.trim() : '';

            if (val == '') {
                return printErrorMsg(it, errorMsg);
            }

            return true;
        }

        window.isStartDateValid = function isStartDateValid() {
            return validateEmpty('StartDate', "La date de début est necessaire") && ($('#StartDate').val().isDate() || printErrorMsg($('#StartDate'), "La date de début est invalide"));
        };

        window.isEndDateValid = function isEndDateValid() {
            return validateEmpty('EndDate', "La date de fin est necessaire") && ($('#EndDate').val().isDate() || printErrorMsg($('#EndDate'), "La date de fin est invalide"));
        };

        window.isKeywordsValid = function isKeywordsValid() {
            function focusIt() {
                $('.listbuilder').find('input').eq(0).focus();
                return true;
            }

            return validateEmpty('Keywords', "Il faut au moins un mot-clé") && focusIt();
        };
    }

    function getDisplayType() { return parseInt($('#DisplayType').val()); }

    function plotGraph(done) {
        window.generatedOne = true;

        // Remove all tabs -- TODO: improve this later
        setTimeout(function () {
            $('li', myTabs).each(function() {
                var index = $(this).index($(this).parent());
                myTabs.wijtabs('remove', index);
            });
        }, 0);

        function getKeywords() {

            function notEmpty(it) {
                return it != null ? it.trim() : ''
            }

            var kws = notEmpty($('#Keywords').val());

            if (kws == '') return [];

            var ret = [];
            var arr = kws.split(/[,\n]/);

            for (var i = 0,n = arr.length; i < n; i++) {
                var v = window.stripValue(notEmpty(arr[i]));
                if (v != '') ret.push(v);
            }

            return ret;
        }

        var mentionsForAllKeywords = 0,
            maxPosts = 0,
            displayTpe = getDisplayType(),
            StartDate = $('#StartDate').datepicker('getDate'),
            EndDate = $('#EndDate').datepicker('getDate');

        function capitalize(word) {
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        }

        $.when.apply($,
            $.map(getKeywords(), function(keyword) {

                // Add a tab for this KEYWORD
                setTimeout(function(){
                    var Query = {
                        action: 'generate_table',
                        StartDate: encodeURIComponent(StartDate),
                        EndDate: encodeURIComponent(EndDate),
                        Keyword: encodeURIComponent(keyword)
                    }, URL = ajaxurl + '?' + $.param(Query);
                    
                    myTabs.wijtabs('add',
                        URL + '#recensements-table-tab-' + keyword,
                        capitalize(keyword)
                    );
                }, 0);

                return $.ajax({
                    url: ajaxurl,
                    dataType: 'json',
                    parseError: true,
                    data: {
                        action: 'generate_series',
                        DisplayType: encodeURIComponent(displayTpe),
                        StartDate: encodeURIComponent(StartDate),
                        EndDate: encodeURIComponent(EndDate),
                        Keyword: encodeURIComponent(keyword)
                    }
                });
            })
        ).done(function() {
                if ($.lastPlot) $.lastPlot.destroy();

                var maxTotalPosts = 0,
                    series = [],
                    seriesTitles = [],
                    toAdd_at_LAST = null,
                    toAdd_at_LAST_ticks = null, //TODO: workaround for jqplot BUG, (if first series is empty, shows no xaxis lables ^#^&)
                    ticks = getTicks();

                function getTicks() {
                    switch(getDisplayType()) {
                        case 3 : return getMonthTicks(new Date(StartDate), new Date(EndDate));
                        case 2 : return getWeeklyTicks(new Date(StartDate), new Date(EndDate));
                        case 1 :
                        default:
                    }
                    return {};
                }

                function WeekKey(wstart, wend) { return "De " + dateFormat(wstart, dateFormat.masks['isoDate']) + " à " + dateFormat(wend, dateFormat.masks['isoDate']); }
                function getWeeklyTicks(StartDate, EndDate) {
                    function getStartOfWeek(date) { return date.getDay()==0 ? new Date(date.getTime()) : new Date(date.getTime() + ((1 - (date.getDay() + 1)) * 86400000)) /*date.addDays(1-(date.getDay()+1))*/; }
                    function getEndOfWeek(date) { return date.getDay()==6 ? new Date(date.getTime()) : new Date(date.getTime() + ((7 - (date.getDay() + 1)) * 86400000))/* date.addDays(7-(date.getDay()+1))*/; }

                    var weeklyTicks = {};
                    
                    for(var weekStart = getStartOfWeek(StartDate), weekEnd = getEndOfWeek(StartDate);
                            (weekStart.getTime() <= EndDate.getTime());
                         weekStart.addDays(7), weekEnd.addDays(7)) {
                        weeklyTicks[WeekKey(weekStart, weekEnd)] = false;
                    }

                    return weeklyTicks;
                }

                function MonthKey(y, m) {
                    var MONTH_NAMES_FR = [
                                'Janvier',
                                'Février',
                                'Mars',
                                'Avril',
                                'Mai',
                                'Juin',
                                'Juillet',
                                'Août',
                                'Septembre',
                                'Octobre',
                                'Novembre',
                                'Decembre'
                    ];
                    return MONTH_NAMES_FR[m] + ', ' + y;
                }
                function getMonthTicks(StartDate, EndDate) {
                    var monthlyTicks = {};

                    var startY = StartDate.getFullYear(),
                        endY = EndDate.getFullYear();
                    for(var Y=startY; Y <= endY; Y++) {
                        var startM = StartDate.getMonth(),
                            endM = EndDate.getMonth(); //!!! This returns actual month number minus ONE
                        for (var M=startM; M <= endM; M++)
                            monthlyTicks[MonthKey(Y,M)] = false;
                    }

                    return monthlyTicks;
                }

                function addNewSeries($response) {
                    console.assert($response['Success'] === true, 'Success should be true');

                    var mentionsForKeyword = 0;

                    function countPosts(series) {
                        $.each(series, function() {
                            var $this = parseInt(this['Posts']);
                            if ($this > maxPosts) maxPosts = $this;
                            mentionsForKeyword += $this;
                        });
                        mentionsForAllKeywords += mentionsForKeyword;
                    }

                    var totalPosts = parseInt($response['TotalPosts']);
                    if (maxTotalPosts < totalPosts)
                        maxTotalPosts = totalPosts;//We just need the max TotalPosts

                    countPosts($response['Result']);

                    function getDailySeries(seriesData) { return $.map(seriesData, function(Res){ ticks[Res['PostDate']]=true; return Number(Res['Posts']); }); }
                    function getWeeklySeries(seriesData) { return $.map(seriesData, function(Res){ ticks[WeekKey(new Date(Res['WeekStart']), new Date(Res['WeekEnd']))]=true; return Number(Res['Posts']); }); }
                    function getMonthlySeries(seriesData) { return $.map(seriesData, function(Res){ ticks[MonthKey(Res['Year'], Res['Month'])]=true; return Number(Res['Posts']); }); }

                    var seriesForKeyword = null;
                    if(displayTpe == 1) seriesForKeyword = getDailySeries($response['Result']);
                    else if(displayTpe == 2) seriesForKeyword = getWeeklySeries($response['Result']);
                    else if(displayTpe == 3) seriesForKeyword = getMonthlySeries($response['Result']);
                    else throw new Error("Unknown display type");

                    if(seriesForKeyword.length==0) {
                        toAdd_at_LAST=toAdd_at_LAST||[];
                        toAdd_at_LAST.push(seriesForKeyword);

                        toAdd_at_LAST_ticks=toAdd_at_LAST_ticks||[];
                        toAdd_at_LAST_ticks.push({label: '<b>' + capitalize($response['Keyword']) + "</b> (<em>" + mentionsForKeyword + "</em> "+plural('mention', 'nes', mentionsForKeyword)+" dans <em>" + totalPosts + "</em> "+plural('article', 's', totalPosts)+")"});
                    }
                    else {
                        series.push(seriesForKeyword);
                        seriesTitles.push({label: '<b>' + capitalize($response['Keyword']) + "</b> (<em>" + mentionsForKeyword + "</em> "+plural('mention', 'nes', mentionsForKeyword)+" dans <em>" + totalPosts + "</em> "+plural('article', 's', totalPosts)+")"});
                    }
                }

                var data = $.makeArray(arguments);

                $.isArray(data[0])

                    ? //Multiple keywords

                    $.each(data, function() {
                        addNewSeries(this[0]);
                    })

                    : addNewSeries(data[0]);

                $.each(toAdd_at_LAST, function(){ series.push(this); });
                $.each(toAdd_at_LAST_ticks, function(){ seriesTitles.push(this); });
                seriesTitles.push({lineWidth:4, markerOptions:{style:'square'}});

                $.lastPlot = $.jqplot('recensements-graph', series, {
                    title: 'Recensements des mots-clés (<em>' + mentionsForAllKeywords + '</em> '+plural('mention', 'nes', mentionsForAllKeywords)+' dans <em>' + maxTotalPosts + '</em> '+plural('article', 's', maxTotalPosts)+' aux totales)',
                    seriesDefaults: {
                        renderer: $.jqplot.BarRenderer,
                        pointLabels: { show: true },
                        rendererOptions: {
                            barPadding: 10,
                            barMargin: 10,
                            barWidth: 10
                        }
                    },
                    series: seriesTitles,
                    axes: {
                        xaxis: {
                            renderer: $.jqplot.CategoryAxisRenderer,
                            rendererOptions: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer
                            },
                            tickOptions: {
                                fontSize:'10pt',
                                fontFamily:'Tahoma',
                                angle:-40,
                                fontWeight:'normal',
                                fontStretch:1
                            },
                            ticks: $.map(ticks, function(Val, Key) { return (Val&&Key)||null; })
                        },
                        yaxis: {
                            autoscale: true,
                            tickOptions: {formatString: '%d'},
                            min:0,
                            max: (maxPosts > 8 ? maxPosts : 8) + 6/*For the legend*/,
                            tickInterval: 1//(maxPosts > 10 ? 1 : 1)
                        }
                    },
                    legend: {
                        show: true,
                        placement: 'inside',
                        location: 'ne'
                    },
                    noDataIndicator: {
                        show: true,
                        indicator: "Il n'y pas des données",
                        axes: {
                            xaxis: {
                                min: 0,
                                max: 5,
                                tickInterval: 1,
                                showTicks: false
                            },
                            yaxis: {
                                min: 0,
                                max: 8,
                                tickInterval: 2,
                                showTicks: false
                            }
                        }
                    }
                });

                //Change form title to Modifier les parametres, change submit button text to regenerer les
                $('.collapsible').find('legend').find('h2').text('Modifier les Paramètres');
                $('#generate_report_submit').val('Régénérer le graphe');

                //Collapse form
                toggleFieldset($('.collapsible'));

                done();
            })

            .fail(function($response) {
                printErrorMsg(null, $response['Result']['Msg']);
                done();
            });
    }

    $('#DisplayType').change(function() {
        switch (getDisplayType()) {

            case 3:
                setUpForMonthlySeries();
                break;

            case 2:
                setUpForWeeklySeries();
                break;

            case 1:
            default:

                setUpForDailySeries();
                break;
        }

        if (window.generatedOne && window.isStartDateValid()
            && window.isEndDateValid()
            && window.isKeywordsValid()) {
            $('#generate_report_submit').doBusy(plotGraph);
        }
    });

    $('#report_form').submit(function() {
        if (window.isStartDateValid()
            && window.isEndDateValid()
            && window.isKeywordsValid()) $('#generate_report_submit').doBusy(plotGraph);

        return false; //Dont submit normally
    });

    //----------------------------------------------------------------------------------------------------------------

    /**
     * Toggle the visibility of a fieldset using smooth animations
     */
    function toggleFieldset(fieldset) {
        if ($(fieldset).is('.collapsed')) {
            // Action div containers are processed separately because of a IE bug
            // that alters the default submit button behavior.
            var content = $('> div:not(.action)', fieldset);
            $(fieldset).removeClass('collapsed');
            content.hide();
            content.slideDown({
                duration: 'slow',
                easing: 'linear',
                complete: function () {
                    collapseScrollIntoView(this.parentNode);
                    this.parentNode.animating = false;
                    $('div.action', fieldset).show();
                }, step: function () {
                    // Scroll the fieldset into view
                    collapseScrollIntoView(this.parentNode);
                }
            });
        }
        else {
            $('div.action', fieldset).hide();
            var content = $('> div:not(.action)', fieldset).slideUp('slow', function () {
                $(this.parentNode).addClass('collapsed');
                this.parentNode.animating = false;
            });
        }
    }

    ;
    /**
     * Scroll a given fieldset into view as much as possible.
     */

    function collapseScrollIntoView(node) {
        var h = self.innerHeight || document.documentElement.clientHeight || $('body')[0].clientHeight || 0;
        var offset = self.pageYOffset || document.documentElement.scrollTop || $('body')[0].scrollTop || 0;
        var posY = $(node).offset().top;
        var fudge = 55;
        if (posY + node.offsetHeight + fudge > h + offset) {
            if (node.offsetHeight > h) {
                window.scrollTo(0, posY);
            } else {
                window.scrollTo(0, posY + node.offsetHeight - h + fudge);
            }
        }
    }

    ;
    function collapsible(context) {
        $('fieldset.collapsible > legend:not(.collapsible-processed)', context).each(function () {
            var fieldset = $(this.parentNode);
            // Expand if there are errors inside
            if ($('input.error, textarea.error, select.error', fieldset).size() > 0) {
                fieldset.removeClass('collapsed');
            }
            // Turn the legend into a clickable link and wrap the contents of the fieldset
            // in a div for easier animation
            var text = this.innerHTML;
            $(this).empty().append($('<a href="#">' + text + '</a>').click(function () {
                var fieldset = $(this).parents('fieldset:first')[0];
                // Don't animate multiple times
                if (!fieldset.animating) {
                    fieldset.animating = true;
                    toggleFieldset(fieldset);
                }
                return false;
            })).after($('<div class="fieldset-wrapper"></div>').append(fieldset.children(':not(legend):not(.action)'))).addClass('collapsible-processed');
        });
    }

    ;
});
