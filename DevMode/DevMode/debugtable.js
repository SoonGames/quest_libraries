function initDebugTable(css) {

    // Set original Stylesheet
    $('<style />').text(css).appendTo($('head'));

    // Create DevMode-Sidebar
    $('body').append(
        '<div class="devmode_sidebar">' +
            '<div class="devmode_sidebar_labels" id="devmode_sidebar_labels_debugtable"></div>' +
            '<div class="devmode_sidebar_container">' +
                '<div id="debugtable_names"></div>' +
                '<div id="debugtable_attr"></div>' +
            '</div>' +
        '</div>'
    );

    // Custom Stylesheet
    $('.devmode_sidebar').css({
        "height": "100%",
        "width": "500px",
        "top": "0px",
        "right": "0px",
        "display": "flex",
        "position": "fixed",
        "z-index": "1000"
    });

    $('.devmode_sidebar_labels').css({
        "box-sizing": "border-box",
        "text-align": "center",
        "border-bottom-left-radius": "10px",
        "height": "50px",
        "width": "50px",
        "background-color": "ghostwhite",
        "background-repeat": "no-repeat, repeat",
        "background-position": "center",
        "box-shadow": "none",
        "transition": "box-shadow 0.5s",
        "z-index": "0"
    });

    $('#devmode_sidebar_labels_debugtable').css({
        "background-image": "url('quest://res/DevMode/debugtable.png')"
    });

    $('.devmode_sidebar_container').css({
        "box-sizing": "border-box",
        "display": "flex",
        "height": "100%",
        "width": "100%",
        "border": "none",
        "box-shadow": "none",
        "transition": "box-shadow 0.5s",
        "background-color": "ghostwhite"
    });

    $('#debugtable_names').css({
        "box-sizing": "border-box",
        "float": "right",
        "height": "100%",
        "width": "33.3%",
    });
    
    $('#debugtable_attr').css({
        "box-sizing": "border-box",
        "float": "right",
        "height": "100%",
        "width": "66.6%",
    });


    // Declare variables
    var devmode_sidebar_show = true;
    var devmode_sidebar_boxshadow = "0px 0px 25px grey";
    

    // Resizing the sidebar
    $('.devmode_sidebar').resizable({
        handles:'w',
        resize: function (event,ui) {
            ui.position.left = ($(window).width() - $(this).width());
        },
        stop: function (event,ui) {
            $(this).css({ left: "initial" });
        }
    });


    // Hidden DevMode-Sidebar
    toggletable (0);


    // Appearance of the box shadow on mouseover
    $(".devmode_sidebar_labels").hover(function() {
        $(this).css("box-shadow", devmode_sidebar_boxshadow)
    }).mouseout(function() {
        if (!devmode_sidebar_show) $(this).css("box-shadow","none")
    });


    // When clicking on the label of the sidebar it will be displayed.
    $('.devmode_sidebar_labels').on('click', function() {
        toggletable (200);
    });


    // DevMode-Sidebar fly in or out
    function toggletable (duration) {
        devmode_sidebar_show = !devmode_sidebar_show;
        if (devmode_sidebar_show) {
            var tok = "+";
            var boxshadowval = devmode_sidebar_boxshadow;
            $('.devmode_sidebar').resizable("enable");
            
        }
        else {
            var tok = "-";
            var boxshadowval = "none";
            $('.devmode_sidebar').resizable("disable");
        }
        $('.devmode_sidebar').animate({ right: tok + '=' + $('.devmode_sidebar_container').width() }, duration, "easeOutExpo" );
        $('.devmode_sidebar_container').css('box-shadow', boxshadowval);
    }


    // If the window is resized, the sidebar should remain at the right margin
    $(window).resize(function() {
        if (devmode_sidebar_show) {
            $('.devmode_sidebar').css({ right: '0px' });
        }
        else {
            $('.devmode_sidebar').css({ right: '-' + $('.devmode_sidebar_container').width() });
        }
    });
    
    // The selected name
    selectedname = "";

    // Debugtable - Names
    $("#debugtable_names").tabulator({
        selectable: 1,
        layout: "fitColumns",
        initialSort: [{
            column: "name",
            dir: "asc"
        }],
        columns: [{
            title: "Name",
            field: "name",
            sorter: "string",
            headerFilter: "input",
            headerFilterPlaceholder: "Filter by...",
            resizable: false
        }],
        rowClick: function (e, row) { // For name selectiony
            row.select();
            selectedname = row.getData().name
            ASLEvent("getTableDataAttr", selectedname);
        }
    });


    // Debugtable - Attributes
    $("#debugtable_attr").tabulator({
        layout: "fitColumns",
        initialSort: [{
                column: "attribute",
                dir: "asc"
            },
            {
                column: "value",
                dir: "asc"
            }
        ],
        columns: [{
                title: "Attribute",
                field: "attribute",
                sorter: "string",
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by...",
                resizable: false
            },
            {
                title: "Value",
                field: "value",
                sorter: "string",
                editor: "input",
                headerFilter: "input",
                headerFilterPlaceholder: "Filter by...",
                resizable: false
            }
        ],
        cellEdited: function (cell) { // When you change the attributes
            console.log("ATT: " + cell.getRow().getData().attribute);
            console.log("VAL: " + cell.getRow().getData().value);
            ASLEvent("ParseToQuestCode", selectedname + "." + cell.getRow().getData().attribute + "=" + cell.getRow().getData().value);
            // command = "#" + selectedname + "." + cell.getRow().getData().attribute + "=" + cell.getRow().getData().value + "\r\n";
            // $('#txtCommand').val(command);
        }
    });


    // Debugtable - Read Names
    ASLEvent("getTableDataNames", "");

}


// Debugtable update
function setTableData(table, datastr) {
    var data = JSON.parse(datastr);
    $("#debugtable_" + table).tabulator("clearData");
    $("#debugtable_" + table).tabulator("setData", data);
    $("#debugtable_" + table).tabulator("redraw", true);
}