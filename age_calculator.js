jQuery.noConflict();
$ = jQuery;

$(document).ready(function(){
    //run on ready
    calculateAge();
    //run on bind events
    $("#dob").bind("keyup change click", function(){ 
        calculateAge();
    });
});

/**
 * used to fire the change to the form on any evnts
 */
function calculateAge(){
    //get date of birth value
    var dob = $('#dob').val();
    //make sure entered value is right length
    if(validateDate(dob)){
      //get year month and date from entered value
      var year  = dob.substring(0, 4);
      var month = dob.substring(5, 7) - 1;
      var date  = dob.substring(8);
      //get the precise age object
      var preciseAge = getPreciseAge(year,month,date);
      //get correct pluralization of days
      var day_text = (preciseAge.days > 1 || preciseAge.days < 1) ? 'days' : 'day';
      //build age string
      var ageHTML = preciseAge.years + ' years, ' +
                    preciseAge.months + ' months, ' +
                    preciseAge.days + ' ' + day_text;
   
      $('#age').html(ageHTML);
    } else {
      $('#age').html('Please enter valid date.');
    }
}

/**
 * validate date in YYYY-MM-DD format
 */
function validateDate(dtValue)
{
    //input date in miliseconds
    var dtValueMiliseconds = new Date(dtValue);
    //get today in miliseconds
    var today = new Date();
    //make sure input date is not after today
    if(dtValueMiliseconds <= today){
        //matches correct pattern
        var dtRegex = new RegExp(/\b^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}\b/);
        return dtRegex.test(dtValue);
    } else {
        //input date is after today
        return false;
    }
}

/**
 * Calculate the precise age in years, months and days for a given birthdate.
 * 
 * @param {string} year expects format yyyy
 * @param {string} month expects format mm (0-11)
 * @param {string} date expects format dd (1-31)
 * @returns {object} containing age in years, months and days
 */
function getPreciseAge(yearDob, monthDob, dateDob) {
    //initialze return values
    var yearAge,monthAge,dateAge;
    // get date strings for now
    var now = new Date();
    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();
    //calculate base years
    yearAge = yearNow - yearDob;
    //calculate months
    if (monthNow >= monthDob) {
        //if current month is same or after birth month then get difference
        monthAge = monthNow - monthDob;
    } else {
        //otherwise if current month is before birth month
        //reduce year age by one
        yearAge--;
        //increment months by difference
        monthAge = 12 + monthNow - monthDob;
    }
    //calculate days
    if (dateNow >= dateDob) {
        //if current date is same or after current date then get difference
        dateAge = dateNow - dateDob;
    } else {
        //otherwise if current date is before birth date
        //reduce month by one
        monthAge--;
        //increment days by difference
        dateAge = 31 + dateNow - dateDob;
        //check if months are less than 0
        if (monthAge < 0) {
            //change to 11 months
            monthAge = 11;
            //reduce years by one
            yearAge--;
        }
    }
    //return age object
    return {
      years   : yearAge,
      months  : monthAge,
      days    : dateAge
    };
}