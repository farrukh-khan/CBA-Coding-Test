function encodeString(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function uiLoader(status) {
    if (status == 'show') {
        $('[ui-view]').addClass('loader');
    }
    else {
        $('[ui-view]').removeClass('loader');
    }
}

function decodeString(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()


function cnicPattren() {

    return '[0-9]{5}-[0-9]{7}-[0-9]{1}';
}




function makeCnic(event, thisVal) {

    var $this = $(thisVal);

    if (event.keyCode == 8 || event.keyCode == 9
                                             || event.keyCode == 27 || event.keyCode == 13
                                             || (event.keyCode == 65 && event.ctrlKey === true)) {
        return;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
        event.preventDefault();
    }

    var length = $this.val().length;

    if (length >= 15) {

        event.preventDefault();

    }

    if (length == 5 || length == 13) {
        return $this.val($this.val() + '-');
    }

}




function makeNum(event, thisVal) {

    var $this = $(thisVal);

    if (event.keyCode == 8 || event.keyCode == 9
                                             || event.keyCode == 27 || event.keyCode == 13
                                             || (event.keyCode == 65 && event.ctrlKey === true)) {
        return;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
        event.preventDefault();
    }

    var length = $this.val().length;

    if (length >= 15) {

        event.preventDefault();

    }


}

function getDateRange(dateRange) {
    var currentDate = moment();
    var startDate = moment();
    var endDate = moment();

    switch (dateRange) {
        case "today":
            startDate = moment().format("DD-MM-YYYY");
            endDate = moment().format("DD-MM-YYYY");
            break;
        case "week":
            startDate = moment().subtract(moment().weekday() - 1, 'days').format("DD-MM-YYYY");
            endDate = moment().format("DD-MM-YYYY");
            break;
        case "month":
            startDate = moment().date(1).format("DD-MM-YYYY");
            endDate = moment().format("DD-MM-YYYY");
            break;
        case "year":
            startDate = moment().dayOfYear(1).format("DD-MM-YYYY");
            endDate = moment().format("DD-MM-YYYY");
            break;
        case "yesterday":
            startDate = moment().subtract(1, 'days').format("DD-MM-YYYY");
            endDate = moment().subtract(1, 'days').format("DD-MM-YYYY");
            break;
        case "lastWeek":
            startDate = moment().subtract(1, 'week').format("DD-MM-YYYY");
            endDate = moment().format("DD-MM-YYYY");
            break;
        case "lastMonth":
            startDate = moment().subtract(1, 'month').date(1).format("DD-MM-YYYY");
            endDate = moment().subtract(1, 'month').date(moment().subtract(1, 'month').daysInMonth()).format("DD-MM-YYYY");
            break;
        case "lastYear":
            startDate = moment().subtract(1, 'year').dayOfYear(1).format("DD-MM-YYYY");
            endDate = moment().date(moment().month(11).daysInMonth()).format("DD-MM-YYYY");
            break;
        default:
            return null;
    }

    return {
        startDate: startDate,
        endDate: endDate
    }
}

function printView() {
    var win = window.open('', '', 'left=0,top=0,width=1100,height=600,toolbar=0,scrollbars=0,status =0');
    var content = "<html>";
    content += "<body onload=\"window.print(); window.close();\">";
    content += '<head>';
    content += '<link href="/app/css/test/bootstrap.css" rel="stylesheet" type="text/css" />';
    content += '<link href="/app/css/styles.css" rel="stylesheet" type="text/css" />';
    content += '</head>';


    content += document.getElementById("rptView").innerHTML;
    content += "</body>";
    content += "</html>";
    win.document.write(content);
    win.document.close();
}

