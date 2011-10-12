/*
 * Date prototype extensions. Doesn't depend on any
 * other code. Doens't overwrite existing methods.
 *
 * Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
 * isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
 * setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
 *
 * Copyright (c) 2006 Jörn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 *
 * Additional methods and properties added by Kelvin Luck: firstDayOfWeek, dateFormat, zeroTime, asString, fromString -
 * I've added my name to these methods so you know who to blame if they are broken!
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * An Array of day names starting with Sunday.
 * 
 * @example dayNames[0]
 * @result 'Sunday'
 *
 * @name dayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * An Array of abbreviated day names starting with Sun.
 * 
 * @example abbrDayNames[0]
 * @result 'Sun'
 *
 * @name abbrDayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * An Array of month names starting with Janurary.
 * 
 * @example monthNames[0]
 * @result 'January'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * An Array of abbreviated month names starting with Jan.
 * 
 * @example abbrMonthNames[0]
 * @result 'Jan'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The first day of the week for this locale.
 *
 * @name firstDayOfWeek
 * @type Number
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.firstDayOfWeek = 1;

/**
 * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.format = 'dd/mm/yyyy';
//Date.format = 'mm/dd/yyyy';
//Date.format = 'yyyy-mm-dd';
//Date.format = 'dd mmm yy';

/**
 * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
 * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.fullYearStart = '20';

(function() {

	/**
	 * Adds a given method under the given name 
	 * to the Date prototype if it doesn't
	 * currently exist.
	 *
	 * @private
	 */
	function add(name, method) {
		if( !Date.prototype[name] ) {
			Date.prototype[name] = method;
		}
	};
	
	/**
	 * Checks if the year is a leap year.
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isLeapYear();
	 * @result true
	 *
	 * @name isLeapYear
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isLeapYear", function() {
		var y = this.getFullYear();
		return (y%4==0 && y%100!=0) || y%400==0;
	});
	
	/**
	 * Checks if the day is a weekend day (Sat or Sun).
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekend();
	 * @result false
	 *
	 * @name isWeekend
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekend", function() {
		return this.getDay()==0 || this.getDay()==6;
	});
	
	/**
	 * Check if the day is a day of the week (Mon-Fri)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekDay();
	 * @result false
	 * 
	 * @name isWeekDay
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekDay", function() {
		return !this.isWeekend();
	});
	
	/**
	 * Gets the number of days in the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDaysInMonth();
	 * @result 31
	 * 
	 * @name getDaysInMonth
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDaysInMonth", function() {
		return [31,(this.isLeapYear() ? 29:28),31,30,31,30,31,31,30,31,30,31][this.getMonth()];
	});
	
	/**
	 * Gets the name of the day.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName();
	 * @result 'Saturday'
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName(true);
	 * @result 'Sat'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getDayName", function(abbreviated) {
		return abbreviated ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()];
	});

	/**
	 * Gets the name of the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName();
	 * @result 'Janurary'
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName(true);
	 * @result 'Jan'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getMonthName", function(abbreviated) {
		return abbreviated ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()];
	});

	/**
	 * Get the number of the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayOfYear();
	 * @result 11
	 * 
	 * @name getDayOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDayOfYear", function() {
		var tmpdtm = new Date("1/1/" + this.getFullYear());
		return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
	});
	
	/**
	 * Get the number of the week of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getWeekOfYear();
	 * @result 2
	 * 
	 * @name getWeekOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getWeekOfYear", function() {
		return Math.ceil(this.getDayOfYear() / 7);
	});

	/**
	 * Set the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.setDayOfYear(1);
	 * dtm.toString();
	 * @result 'Tue Jan 01 2008 00:00:00'
	 * 
	 * @name setDayOfYear
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("setDayOfYear", function(day) {
		this.setMonth(0);
		this.setDate(day);
		return this;
	});
	
	/**
	 * Add a number of years to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addYears(1);
	 * dtm.toString();
	 * @result 'Mon Jan 12 2009 00:00:00'
	 * 
	 * @name addYears
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addYears", function(num) {
		this.setFullYear(this.getFullYear() + num);
		return this;
	});
	
	/**
	 * Add a number of months to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMonths(1);
	 * dtm.toString();
	 * @result 'Tue Feb 12 2008 00:00:00'
	 * 
	 * @name addMonths
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMonths", function(num) {
		var tmpdtm = this.getDate();
		
		this.setMonth(this.getMonth() + num);
		
		if (tmpdtm > this.getDate())
			this.addDays(-this.getDate());
		
		return this;
	});
	
	/**
	 * Add a number of days to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addDays(1);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addDays
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addDays", function(num) {
		//this.setDate(this.getDate() + num);
		this.setTime(this.getTime() + (num*86400000) );
		return this;
	});
	
	/**
	 * Add a number of hours to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addHours(24);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addHours
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addHours", function(num) {
		this.setHours(this.getHours() + num);
		return this;
	});

	/**
	 * Add a number of minutes to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMinutes(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 01:00:00'
	 * 
	 * @name addMinutes
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMinutes", function(num) {
		this.setMinutes(this.getMinutes() + num);
		return this;
	});
	
	/**
	 * Add a number of seconds to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addSeconds(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name addSeconds
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addSeconds", function(num) {
		this.setSeconds(this.getSeconds() + num);
		return this;
	});
	
	/**
	 * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
	 * 
	 * @example var dtm = new Date();
	 * dtm.zeroTime();
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name zeroTime
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("zeroTime", function() {
		this.setMilliseconds(0);
		this.setSeconds(0);
		this.setMinutes(0);
		this.setHours(0);
		return this;
	});
	
	/**
	 * Returns a string representation of the date object according to Date.format.
	 * (Date.toString may be used in other places so I purposefully didn't overwrite it)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.asString();
	 * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name asString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("asString", function(format) {
		var r = format || Date.format;
		return r
			.split('yyyy').join(this.getFullYear())
			.split('yy').join((this.getFullYear() + '').substring(2))
			.split('mmmm').join(this.getMonthName(false))
			.split('mmm').join(this.getMonthName(true))
			.split('mm').join(_zeroPad(this.getMonth()+1))
			.split('dd').join(_zeroPad(this.getDate()))
			.split('hh').join(_zeroPad(this.getHours()))
			.split('min').join(_zeroPad(this.getMinutes()))
			.split('ss').join(_zeroPad(this.getSeconds()));
	});
	
	/**
	 * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
	 * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
	 *
	 * @example var dtm = Date.fromString("12/01/2008");
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name fromString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	Date.fromString = function(s, format)
	{
		var f = format || Date.format;
		var d = new Date('01/01/1977');
		
		var mLength = 0;

		var iM = f.indexOf('mmmm');
		if (iM > -1) {
			for (var i=0; i<Date.monthNames.length; i++) {
				var mStr = s.substr(iM, Date.monthNames[i].length);
				if (Date.monthNames[i] == mStr) {
					mLength = Date.monthNames[i].length - 4;
					break;
				}
			}
			d.setMonth(i);
		} else {
			iM = f.indexOf('mmm');
			if (iM > -1) {
				var mStr = s.substr(iM, 3);
				for (var i=0; i<Date.abbrMonthNames.length; i++) {
					if (Date.abbrMonthNames[i] == mStr) break;
				}
				d.setMonth(i);
			} else {
				d.setMonth(Number(s.substr(f.indexOf('mm'), 2)) - 1);
			}
		}
		
		var iY = f.indexOf('yyyy');

		if (iY > -1) {
			if (iM < iY)
			{
				iY += mLength;
			}
			d.setFullYear(Number(s.substr(iY, 4)));
		} else {
			if (iM < iY)
			{
				iY += mLength;
			}
			// TODO - this doesn't work very well - are there any rules for what is meant by a two digit year?
			d.setFullYear(Number(Date.fullYearStart + s.substr(f.indexOf('yy'), 2)));
		}
		var iD = f.indexOf('dd');
		if (iM < iD)
		{
			iD += mLength;
		}
		d.setDate(Number(s.substr(iD, 2)));
		if (isNaN(d.getTime())) {
			return false;
		}
		return d;
	};
	
	// utility method
	var _zeroPad = function(num) {
		var s = '0'+num;
		return s.substring(s.length-2)
		//return ('0'+num).substring(-2); // doesn't work on IE :(
	};
	
})();/*
 * Date prototype extensions. Doesn't depend on any
 * other code. Doens't overwrite existing methods.
 *
 * Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
 * isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
 * setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
 *
 * Copyright (c) 2006 Jörn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 *
 * Additional methods and properties added by Kelvin Luck: firstDayOfWeek, dateFormat, zeroTime, asString, fromString -
 * I've added my name to these methods so you know who to blame if they are broken!
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * An Array of day names starting with Sunday.
 * 
 * @example dayNames[0]
 * @result 'Sunday'
 *
 * @name dayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * An Array of abbreviated day names starting with Sun.
 * 
 * @example abbrDayNames[0]
 * @result 'Sun'
 *
 * @name abbrDayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * An Array of month names starting with Janurary.
 * 
 * @example monthNames[0]
 * @result 'January'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * An Array of abbreviated month names starting with Jan.
 * 
 * @example abbrMonthNames[0]
 * @result 'Jan'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The first day of the week for this locale.
 *
 * @name firstDayOfWeek
 * @type Number
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.firstDayOfWeek = 1;

/**
 * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.format = 'dd/mm/yyyy';
//Date.format = 'mm/dd/yyyy';
//Date.format = 'yyyy-mm-dd';
//Date.format = 'dd mmm yy';

/**
 * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
 * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.fullYearStart = '20';

(function() {

	/**
	 * Adds a given method under the given name 
	 * to the Date prototype if it doesn't
	 * currently exist.
	 *
	 * @private
	 */
	function add(name, method) {
		if( !Date.prototype[name] ) {
			Date.prototype[name] = method;
		}
	};
	
	/**
	 * Checks if the year is a leap year.
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isLeapYear();
	 * @result true
	 *
	 * @name isLeapYear
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isLeapYear", function() {
		var y = this.getFullYear();
		return (y%4==0 && y%100!=0) || y%400==0;
	});
	
	/**
	 * Checks if the day is a weekend day (Sat or Sun).
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekend();
	 * @result false
	 *
	 * @name isWeekend
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekend", function() {
		return this.getDay()==0 || this.getDay()==6;
	});
	
	/**
	 * Check if the day is a day of the week (Mon-Fri)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekDay();
	 * @result false
	 * 
	 * @name isWeekDay
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekDay", function() {
		return !this.isWeekend();
	});
	
	/**
	 * Gets the number of days in the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDaysInMonth();
	 * @result 31
	 * 
	 * @name getDaysInMonth
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDaysInMonth", function() {
		return [31,(this.isLeapYear() ? 29:28),31,30,31,30,31,31,30,31,30,31][this.getMonth()];
	});
	
	/**
	 * Gets the name of the day.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName();
	 * @result 'Saturday'
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName(true);
	 * @result 'Sat'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getDayName", function(abbreviated) {
		return abbreviated ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()];
	});

	/**
	 * Gets the name of the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName();
	 * @result 'Janurary'
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName(true);
	 * @result 'Jan'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getMonthName", function(abbreviated) {
		return abbreviated ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()];
	});

	/**
	 * Get the number of the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayOfYear();
	 * @result 11
	 * 
	 * @name getDayOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDayOfYear", function() {
		var tmpdtm = new Date("1/1/" + this.getFullYear());
		return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
	});
	
	/**
	 * Get the number of the week of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getWeekOfYear();
	 * @result 2
	 * 
	 * @name getWeekOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getWeekOfYear", function() {
		return Math.ceil(this.getDayOfYear() / 7);
	});

	/**
	 * Set the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.setDayOfYear(1);
	 * dtm.toString();
	 * @result 'Tue Jan 01 2008 00:00:00'
	 * 
	 * @name setDayOfYear
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("setDayOfYear", function(day) {
		this.setMonth(0);
		this.setDate(day);
		return this;
	});
	
	/**
	 * Add a number of years to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addYears(1);
	 * dtm.toString();
	 * @result 'Mon Jan 12 2009 00:00:00'
	 * 
	 * @name addYears
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addYears", function(num) {
		this.setFullYear(this.getFullYear() + num);
		return this;
	});
	
	/**
	 * Add a number of months to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMonths(1);
	 * dtm.toString();
	 * @result 'Tue Feb 12 2008 00:00:00'
	 * 
	 * @name addMonths
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMonths", function(num) {
		var tmpdtm = this.getDate();
		
		this.setMonth(this.getMonth() + num);
		
		if (tmpdtm > this.getDate())
			this.addDays(-this.getDate());
		
		return this;
	});
	
	/**
	 * Add a number of days to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addDays(1);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addDays
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addDays", function(num) {
		//this.setDate(this.getDate() + num);
		this.setTime(this.getTime() + (num*86400000) );
		return this;
	});
	
	/**
	 * Add a number of hours to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addHours(24);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addHours
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addHours", function(num) {
		this.setHours(this.getHours() + num);
		return this;
	});

	/**
	 * Add a number of minutes to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMinutes(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 01:00:00'
	 * 
	 * @name addMinutes
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMinutes", function(num) {
		this.setMinutes(this.getMinutes() + num);
		return this;
	});
	
	/**
	 * Add a number of seconds to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addSeconds(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name addSeconds
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addSeconds", function(num) {
		this.setSeconds(this.getSeconds() + num);
		return this;
	});
	
	/**
	 * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
	 * 
	 * @example var dtm = new Date();
	 * dtm.zeroTime();
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name zeroTime
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("zeroTime", function() {
		this.setMilliseconds(0);
		this.setSeconds(0);
		this.setMinutes(0);
		this.setHours(0);
		return this;
	});
	
	/**
	 * Returns a string representation of the date object according to Date.format.
	 * (Date.toString may be used in other places so I purposefully didn't overwrite it)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.asString();
	 * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name asString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("asString", function(format) {
		var r = format || Date.format;
		return r
			.split('yyyy').join(this.getFullYear())
			.split('yy').join((this.getFullYear() + '').substring(2))
			.split('mmmm').join(this.getMonthName(false))
			.split('mmm').join(this.getMonthName(true))
			.split('mm').join(_zeroPad(this.getMonth()+1))
			.split('dd').join(_zeroPad(this.getDate()))
			.split('hh').join(_zeroPad(this.getHours()))
			.split('min').join(_zeroPad(this.getMinutes()))
			.split('ss').join(_zeroPad(this.getSeconds()));
	});
	
	/**
	 * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
	 * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
	 *
	 * @example var dtm = Date.fromString("12/01/2008");
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name fromString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	Date.fromString = function(s, format)
	{
		var f = format || Date.format;
		var d = new Date('01/01/1977');
		
		var mLength = 0;

		var iM = f.indexOf('mmmm');
		if (iM > -1) {
			for (var i=0; i<Date.monthNames.length; i++) {
				var mStr = s.substr(iM, Date.monthNames[i].length);
				if (Date.monthNames[i] == mStr) {
					mLength = Date.monthNames[i].length - 4;
					break;
				}
			}
			d.setMonth(i);
		} else {
			iM = f.indexOf('mmm');
			if (iM > -1) {
				var mStr = s.substr(iM, 3);
				for (var i=0; i<Date.abbrMonthNames.length; i++) {
					if (Date.abbrMonthNames[i] == mStr) break;
				}
				d.setMonth(i);
			} else {
				d.setMonth(Number(s.substr(f.indexOf('mm'), 2)) - 1);
			}
		}
		
		var iY = f.indexOf('yyyy');

		if (iY > -1) {
			if (iM < iY)
			{
				iY += mLength;
			}
			d.setFullYear(Number(s.substr(iY, 4)));
		} else {
			if (iM < iY)
			{
				iY += mLength;
			}
			// TODO - this doesn't work very well - are there any rules for what is meant by a two digit year?
			d.setFullYear(Number(Date.fullYearStart + s.substr(f.indexOf('yy'), 2)));
		}
		var iD = f.indexOf('dd');
		if (iM < iD)
		{
			iD += mLength;
		}
		d.setDate(Number(s.substr(iD, 2)));
		if (isNaN(d.getTime())) {
			return false;
		}
		return d;
	};
	
	// utility method
	var _zeroPad = function(num) {
		var s = '0'+num;
		return s.substring(s.length-2)
		//return ('0'+num).substring(-2); // doesn't work on IE :(
	};
	
})();function isDate(value) {
    try {
        //Change the below values to determine which format of date you wish to check. It is set to dd/mm/yyyy by default.
        var DayIndex = 2;
        var MonthIndex = 1;
        var YearIndex = 0;
 
        value = value.replace(/-/g, "/").replace(/\./g, "/");
        var SplitValue = value.split("/");
        var OK = true;
        if (!(SplitValue[DayIndex].length == 1 || SplitValue[DayIndex].length == 2)) {
            OK = false;
        }
        if (OK && !(SplitValue[MonthIndex].length == 1 || SplitValue[MonthIndex].length == 2)) {
            OK = false;
        }
        if (OK && SplitValue[YearIndex].length != 4) {
            OK = false;
        }
        if (OK) {
            var Day = parseInt(SplitValue[DayIndex], 10);
            var Month = parseInt(SplitValue[MonthIndex], 10);
            var Year = parseInt(SplitValue[YearIndex], 10);
 
            if (OK = ((Year > 1900) && (Year <= new Date().getFullYear()))) {
                if (OK = (Month <= 12 && Month > 0)) {
                    var LeapYear = (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0));
 
                    if (Month == 2) {
                        OK = LeapYear ? Day <= 29 : Day <= 28;
                    }
                    else {
                        if ((Month == 4) || (Month == 6) || (Month == 9) || (Month == 11)) {
                            OK = (Day > 0 && Day <= 30);
                        }
                        else {
                            OK = (Day > 0 && Day <= 31);
                        }
                    }
                }
            }
        }
        return OK;
    }
    catch (e) {
        return false;
    }
}

String.prototype.isDate = function() {
    return isDate(this);
}
jQuery(function($){

    $.fn.listbuilder = function(settings){
        //add body role
        if( !$('body').is('[role]') ){ $('body').attr('role','application'); }
        //cache reference to textarea
        var el = $(this);

        //overrideable defaults
        var options = $.extend({
                delimChar: /[,\n]/, //character used to split textarea content into items
                width: el.width(), //width of listBuilder container. defaults to width of textarea
                height: el.height(), //height of listBuilder container. defaults to height of textarea
                completeChars: [188,13], //keyCodes for item completion
                userDirections: 'To add an item to this list, type a name and press enter or comma.', //directions that will tooltip on the input
                labelReplacement: false
        },settings);

        //create component container
        var listbuilder = $('<ul class="listbuilder"></ul>')
                                .width(options.width)
                                .height(options.height);

        //function to return a new listbuilder entry
        function listUnit( val ){
            return $('<li class="listbuilder-entry"><span class="listbuilder-entry-text">'+val+'</span><a href="#" class="listbuilder-entry-remove" title="Remove '+val+' from the list." role="button"></a></li>')
                .hover(
                    function(){ $(this).addClass('listbuilder-entry-hover'); },
                    function(){ $(this).removeClass('listbuilder-entry-hover'); }
                )
                .attr('unselectable', 'on')
                .css('MozUserSelect', 'none');
        }

        window.stripValue = function stripValue(val) {

            function isLetter(ch) {
                 return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
            }

        // Test for digits
           function isDigit(aChar){
              myCharCode = aChar.charCodeAt(0);

              if((myCharCode > 47) && (myCharCode <  58)){
                 return true;
              }

              return false;
           }

            var ret = '';
            for(var i=0,n=val.length;i<n;i++) {
                if(isLetter(val.charAt(i)) || isDigit(val.charAt(i)))
                    ret += val.charAt(i);
            }

            console.log('strippedValue('+val+')='+ret);
            return ret;
        }

        //function to populate listbuilder from textarea
        function populateList(){
            listbuilder.empty();
            $.each(el.val().split(options.delimChar), function(){
                if(this != ''){ listbuilder.append(listUnit(stripValue(this))); }
            });
            //append typeable component
            listbuilder.append('<li class="listbuilder-entry-add"><input type="text" value="" title="'+ options.userDirections +'" /></li>');
        }

        //run proxy on every keyup in textarea (for development)
        el.keyup(populateList);

        //function to populate textarea from current listbuilder
        function updateValue(){
            taval = [];
            listbuilder.find('span.listbuilder-entry-text').each(function(){
                taval.push(stripValue( $(this).text()) );
            });
            taval.push( stripValue( listbuilder.find('input').val() ) );
            el.val( taval.join(/*options.delimChar*/'\n') );
        };

        //populate initial listbuilderfrom textarea
        populateList();

        //add key behavior to input
        listbuilder.find('input')
            .keydown(function(ev){
                var input = $(this);

                //check if key was one of the completeChars, if so, create a new item and empty the field
                $.each(options.completeChars,function(){
                    if(ev.keyCode == this && input.val() != '' && input.val() != options.delimChar){
                        var val = input.val().split(options.delimChar)[0];
                        input.parent().before( listUnit(stripValue(val)) );
                        input.val('');
                    }
                    if(ev.keyCode == this){
                        ev.preventDefault();
                    }
                });

                var prevUnit = input.parent().prev();
                if(input.val() == '' && ev.keyCode == 8){
                    ev.stopPropagation();
                    if(prevUnit.is('.listbuilder-entry-selected')){
                        prevUnit.remove();
                    }
                    else {
                        prevUnit.addClass('listbuilder-entry-selected');
                    }
                }
                else {
                    prevUnit.removeClass('listbuilder-entry-selected');
                }


            })
            .keyup(function(){
                updateValue();
                //approx width for input
                var testWidth = $('<span style="visibility: hidden; position: absolute; left: -9999px;">'+ $(this).val() +'</span>').css('font-size', $(this).css('font-size')).appendTo('body');
                $(this).width( testWidth.width() + 20 );
                testWidth.remove();
            });

            //apply delete key event at document level
        $(document)
            .click(function(){
                listbuilder.find('.listbuilder-entry-selected').removeClass('listbuilder-entry-selected');
                listbuilder.removeClass('listbuilder-focus');
            })
            .keydown(function(ev){
                if(ev.keyCode == 8){
                    listbuilder.find('.listbuilder-entry-selected').remove();
                    updateValue();
                }
            });


        //click events for delete buttons and focus
        listbuilder.click(function(ev){
            $(this).addClass('listbuilder-focus');

            var clickedElement = $(ev.target);
            if( clickedElement.is('a.listbuilder-entry-remove') ){
                clickedElement.parent().remove();
                updateValue();
                return false;
            }
            else if( clickedElement.is('li.listbuilder-entry, span')){
                if(clickedElement.is('span')){
                    clickedElement = clickedElement.parent();
                }
                if( !ev.shiftKey && !ev.ctrlKey && !ev.metaKey){
                    listbuilder.find('.listbuilder-entry-selected').removeClass('listbuilder-entry-selected');
                }
                if( (ev.shiftKey || ev.ctrlKey || ev.metaKey) && clickedElement.is('.listbuilder-entry-selected') ){
                    clickedElement.removeClass('listbuilder-entry-selected');
                }
                else{
                    clickedElement.addClass('listbuilder-entry-selected');
                }
                return false;
            }
            else {
                $(this).find('.listbuilder-entry-selected').removeClass('listbuilder-entry-selected');
                listbuilder.find('input').eq(0).focus();
                return false;
            }

        });

        //set focus/blur states from input state and focus on input
        listbuilder.add('input')
            .focus(function(){
                $(this).addClass('listbuilder-input-focus');
                listbuilder.addClass('listbuilder-focus');
            })
            .blur(function(){
                $(this).removeClass('listbuilder-input-focus');
                listbuilder.removeClass('listbuilder-focus');
            });

        //insert listbuilder after textarea (and hide textarea)
        listbuilder.insertAfter( el );

        //set label to direct to new input
        var assocLabel = $('label[for='+ el.attr('id') +']');
        if(assocLabel.length && options.labelReplacement){
            var newLabel = $(options.labelReplacement);
            assocLabel.replaceWith(newLabel);
            newLabel.text(assocLabel.html());
        }

        //keep textarea chainable
        return this;
    };        
});
/*
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.formatDate = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au),
              Stéphane Nahmani (sholby@sholby.net),
              Stéphane Raimbault <stephane.raimbault@gmail.com> */
jQuery(function($){
	$.datepicker.regional['fr'] = {
		closeText: 'Fermer',
		prevText: 'Précédent',
		nextText: 'Suivant',
		currentText: 'Aujourd\'hui',
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
		'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
		monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin',
		'Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
		dayNamesMin: ['D','L','M','M','J','V','S'],
		weekHeader: 'Sem.',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['fr']);
});jQuery(function($) {

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

    var myTabs = $("#recensements-table").tabs({
        tabTemplate: '<li><a href="#{href}">#{label} </a> </li>',
        spinner: '<em class="loading">Chargement de contenu...</em>',
        /*load: function(event, ui) {
            $('a', ui.panel).click(function() {
                $(ui.panel).load(this.href);
                return false;
            });
        },*/
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
                myTabs.tabs('remove', index);
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
                    
                    myTabs.tabs('add',
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

                toAdd_at_LAST&&$.each(toAdd_at_LAST, function(){ series.push(this); });
                toAdd_at_LAST_ticks&&$.each(toAdd_at_LAST_ticks, function(){ seriesTitles.push(this); });
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
