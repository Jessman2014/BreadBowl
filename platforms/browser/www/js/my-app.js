// Initialize app
var myApp = new Framework7({
    modalTitle: 'Expense Item',
    swipePanel: 'left'
});



// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

$$('.panel-close').on('click', function(e) {
    myApp.closePanel();
});

$$('.open-left-panel').on('click', function(e) {
    // 'left' position to open Left panel
    myApp.openPanel('left');
});

var calendarDefault = myApp.calendar({
    input: '#calendar-default',
});

var preloadedData = '[{"title":"Festival Foods","amount":"69.99","boughtDate":"2016-04-07","category":"Grocery","id":"1"},{"title":"Ace Hardware","amount":"30.00","boughtDate":"2016-04-21","category":"Household","id":"2"},{"title":"Walgreens","amount":"15.45","boughtDate":"2016-04-18-","category":"Toiletry","id":"3"},{"title":"Walmart","amount":"62.48","boughtDate":"2016-04-24","category":"Clothing","id":"4"},{"title":"Charter","amount":"15.98","boughtDate":"2016-03-05","category":"Internet","id":"5"},{"title":"Piggly Wiggly","amount":"105.48","boughtDate":"2016-03-21","category":"Grocery","id":"6"},{"title":"Menards","amount":"62.74","boughtDate":"2016-03-15","category":"Household","id":"7"},{"title":"Woodmans","amount":"162.54","boughtDate":"2016-03-16","category":"Grocery","id":"8"},{"title":"Festival Foods","amount":"78.45","boughtDate":"2016-04-05","category":"Grocery","id":"9"},{"title":"Walmart","amount":"13.88","boughtDate":"2016-04-23","category":"Household","id":"10"},{"title":"The Hive","amount":"600","boughtDate":"2016-03-27","category":"Rent","id":"11"}]';
if (!localStorage.bb7Data || localStorage.bb7Data.length == 0) {
    localStorage.bb7Data = preloadedData;
}
var expenseData = JSON.parse(localStorage.bb7Data);

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    var categories = {};
    if (expenseData.length > 0) {
        for (i = 0; i < expenseData.length; i++) {
            if (categories[expenseData[i].category]) {
                categories[expenseData[i].category] += parseFloat(expenseData[i].amount);
            }
            else {
                categories[expenseData[i].category] = parseFloat(expenseData[i].amount);
            }
        }
        
        
        data.addRows(Object.keys(categories).length);
        var i = 0;
        for (category in categories) {
            data.setCell(i, 0, category);
            data.setCell(i, 1, categories[category]);
            i++;
        }
    }

    var options = {
        title: 'Expenses By Category',
        is3D: true,
        legend: {position: 'left'},
        backgroundColor: { fill:'transparent' }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);

}

$$('.popup').on('open', function() {
    $$('body').addClass('with-popup');
});
$$('.popup').on('opened', function() {
    $$(this).find('input[name="title"]').focus();
});
$$('.popup').on('close', function() {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="title"]').blur().val('');
    $$(this).find('input[name=amount]').val('');
    $$(this).find('input[name=date]').val('');
});

// Add expense
$$('.popup .add-expense').on('click', function() {
    var title = $$('.popup input[name="title"]').val().trim();
    if (title.length === 0) {
        return;
    }
    var amount = $$('.popup input[name="amount"]').val().trim();
    if (amount.length === 0 && !isNaN(amount)) {
        return;
    }
    var boughtDate = $$('.popup input[name=date]').val().trim();
    var category = $$('.popup .category-select').val();
    var now = moment().format();
    expenseData.push({
        title: title,
        amount: amount,
        boughtDate: boughtDate,
        category: category,
        id: now
    });
    localStorage.bb7Data = JSON.stringify(expenseData);
    buildExpenseListHtml();
    myApp.closeModal('.popup');
    drawChart();
});

// Build Expense HTML using Template7 template engine
var expenseItemTemplateSource = $$('#expense-item-template').html();
var expenseItemTemplate = Template7.compile(expenseItemTemplateSource);
function buildExpenseListHtml() {
    var renderedList = expenseItemTemplate(expenseData);
    $$('.expense-items-list').html(renderedList);
}
// Build HTML on App load
buildExpenseListHtml();

$$('.select-item-checkbox').on('click', function () {
    var accordionItem = $$(this).parents('.accordion-item');
    var id = accordionItem.attr('data-id');
    var index;
    for (var i = 0; i < expenseData.length; i++) {
        if (expenseData[i].id == id) index = i;
    }
    if (typeof (index) !== 'undefined') {
        expenseData.splice(index, 1);
        localStorage.bb7Data = JSON.stringify(expenseData);
        accordionItem.remove();
        drawChart();
    }
});

window.addEventListener('load', function(e) {
    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            myApp.confirm('A new version of Bread Bowl is available. Do you want to load it right now?', function() {
                window.location.reload();
            });
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);
}, false);


