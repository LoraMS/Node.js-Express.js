$(document).ready(function() {
    $('.date').each(function (index, dateElem) {
    var $dateElem = $(dateElem);
    var formatted = moment($dateElem.text(), 'YYYY-MM-DD').format('LL');
    $dateElem.text(formatted);
   });
});
