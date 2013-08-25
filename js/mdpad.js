mdpad = function() {



// when the DOM loads
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: window.location.search.substring(1),
        success: function (response) {
            var converter = new Showdown.converter({ extensions: ['md'] });
            $('#main_markdown').html(converter.makeHtml(response)); 
            // $("#mdpad_error_div").html("<span class='color-scheme-message'>Initializing, please wait...</span>");
            convert_yamls();
            calculate();
            $(':input').change(function() {
                calculate();
            });
           $(":input").keypress(function (e) {
                  if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                      calculate();
                      return false;
                  } else {
                      return true;
                  }
              });
        },
        error: function (response) {
            $("#mdpad_error_div").html("<span class='color-scheme-message'>Error reading file.</span>");
        }
    });
});


// escape html
function escape_html(str) {
    // escape ampersands, angle brackets, tabs, and newlines
    return $('<div/>').text(str).html();
}

var textbuffer = "";

// function print(str) {
//     $active_element.append(str);
// }

// function println(str) {
//     $active_element.append(str + "\n");
// }
           
function convert_yaml() {
    var inp = $(this).find(".yamlinput");
    var out = $(this).find(".yamlresult");
    var nam = $(this).attr("name");
    if (typeof nam == 'undefined') nam = "Y";
    eval(nam + " = jsyaml.load(inp.text())");
    var js = $(this).attr("js");
    if (typeof js != 'undefined') eval("out." + js + "(" + nam + ")");
}

function convert_yamls() {
    var code = $("#main_markdown").find(".yamlblock").each(convert_yaml);
}


function print(str) {
    if (typeof str == 'undefined') str = "";
    textbuffer += str;
}

function println(str) {
    if (typeof str == 'undefined') str = "";
    textbuffer += str + "\n";
}

function read_form() {
    // Send commands to javascript to turn form elements into javascript variables.
    var cmd = "";
    if (this.type == "text") {
        cmd += this.name + "= \"" + this.value.replace(/"/g,"\\\"")  + "\";";
    } else if (this.type == "number") {
        cmd += this.name + "= " + this.value  + ";";
    } else if (this.type == "radio" && this.checked) {
        cmd += this.name + "= \"" + this.value.replace(/"/g,"\\\"") + "\";";
    } else if (this.type == "checkbox") {
        cmd += this.name + "= " + ((this.checked) ? "true;" : "false;");
    } else if (this.nodeName.toLowerCase() == "select") {
        //cmd += this.name + "= \"" + this[this.selectedIndex].text + "\";"; // gives the text contents
        cmd += this.name + "= \"" + this[this.selectedIndex].value.replace(/"/g,"\\\"") + "\";"; // gives the value
    } else if (this.nodeName.toLowerCase() == "textarea") {
        cmd += this.name + "= \"" + this.value.replace(/"/g,"\\\"") + "\";"; 
    // } else if (typeof this.value != 'undefined' && this.value != "") {
    //     cmd += this.name + "= \"" + this.value.replace(/"/g,"\\\"")  + "\";";
    }
console.log(cmd);
    eval(cmd);
}

var converter = new Showdown.converter();
var $active_element;

function calculate_block(dom_ele) {
    if (dom_ele.length == 0) return;
    var code = $(dom_ele).find(".jsinput").text();
    var res = $(dom_ele).find(".jsresult");
    scroll_position = jQuery(window).scrollTop();
    res.css('height', res.height()).css('overflow', 'hidden'); // keep the page from jumping around
    res.html("");
    textbuffer = "";
    $active_element = res;
    eval(code);
    var is_empty = textbuffer == "";
    if (!is_empty) {
        if (res.parent().attr("output") == "markdown") {
            res.append(converter.makeHtml(textbuffer));
        } else {
            res.append("<pre class='jsplain'>" + escape_html(textbuffer) + "</pre>");
        }
    }
    res.css('height', 'auto').css('overflow', 'visible');
    // res.toggle( "highlight" );
    // res.toggleClass( "jsresultdone");
    // res.toggleClass( "jsresult", false, 100);
}

function calculate_forward(dom_ele) {
    if (dom_ele.length == 0) return;
    calculate_block(dom_ele);
    calculate_forward(next_node(dom_ele));    
}

function next_node(node) { // non-recursive
// Return the next calculatable node.
// Traverses the DOM tree starting at the DOM node "node".
// Keeps going until it finds a "calculatable" DOM node.
    var starting_node = node;
    n = node.children(".jsblock") // try children
    if (n.length > 0) {
        return n.first();
    } 
    n = node.nextAll(".jsblock") // try siblings
    if (n.length > 0) { 
        return n.first();
    } 
    return [];
}  

function calculate() {  // page calculation
    // calculate form elements first
    // TODO what about actively generated form elements?
    var form_cmd = $(":input").map(read_form); 
    // Now, start calculation with the first block. Calculations chain
    // from there.
    calculate_forward(next_node($("#main_markdown")));
}

function plot(data, options) {  // uses Flot
    pdiv = $('<div/>', {style: 'width:600px;height:400px'}).appendTo($active_element);
    $.plot(pdiv, data, options);
}

return{
    calculate:calculate,
    calculate_block:calculate_block
}

}();
