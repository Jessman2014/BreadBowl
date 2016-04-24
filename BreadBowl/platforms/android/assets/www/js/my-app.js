// Initialize app
var myApp = new Framework7({
    modalTitle: 'Expense Item'
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

var expenseData = localStorage.bb7Data ? JSON.parse(localStorage.bb7Data) : [];

$$('.popup').on('open', function () {
    $$('body').addClass('with-popup');
});
$$('.popup').on('opened', function () {
    $$(this).find('input[name="title"]').focus();
});
$$('.popup').on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="title"]').blur().val('');
});

// Popup colors
$$('.popup .color').on('click', function () {
    $$('.popup .color.selected').removeClass('selected');
    $$(this).addClass('selected');
});


// Add expense
$$('.popup .add-expense').on('click', function () {
    var title = $$('.popup input[name="title"]').val().trim();
    if (title.length === 0) {
        return;
    }
    var color = $$('.popup .color.selected').attr('data-color');
    expenseData.push({
        title: title,
        color: color,
        checked: '',
        id: (new Date()).getTime()
    });
    localStorage.bb7Data = JSON.stringify(expenseData);
    buildExpenseListHtml();
    myApp.closeModal('.popup');
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

// Mark checked
$$('.expense-items-list').on('change', 'input', function () {
    var input = $$(this);
    var item = input.parents('li');
    var checked = input[0].checked;
    var id = item.attr('data-id') * 1;
    for (var i = 0; i < expenseData.length; i++) {
        if (expenseData[i].id === id) expenseData[i].checked = checked ? 'checked' : '';
    }
    localStorage.bb7Data = JSON.stringify(expenseData);
});

// Delete item
$$('.expense-items-list').on('delete', '.swipeout', function () {
    var id = $$(this).attr('data-id') * 1;
    var index;
    for (var i = 0; i < expenseData.length; i++) {
        if (expenseData[i].id === id) index = i;
    }
    if (typeof(index) !== 'undefined') {
        expenseData.splice(index, 1);
        localStorage.bb7Data = JSON.stringify(expenseData);
    }
});

// Update app when manifest updated 
// http://www.html5rocks.com/en/tutorials/appcache/beginner/
// Check if a new cache is available on page load.
window.addEventListener('load', function (e) {
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            myApp.confirm('A new version of Bread Bowl is available. Do you want to load it right now?', function () {
                window.location.reload();
            });
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);
}, false);