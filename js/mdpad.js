

mdpad = function() {

var deferred = new $.Deferred();  // Keeps track of things that need to load before the first page calculation


// when the DOM loads
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: window.location.search.substring(1),
        success: function (response) {
            var converter = new Showdown.converter({ extensions: ['md'] });
            $('#main_markdown').html(converter.makeHtml(response));
            deferred.resolve();
            $(".mdblock[run='init']").each(calculate_block);
            deferred.done(calculate);
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

function deferOn() {
    var d = new $.Deferred();
    deferred = $.when(deferred, d); // deferred is a global
    return d;
}

function scriptloader(x) {
    // TODO data checking on x
    var d = deferOn();
    x.push(d.resolve);
    head.js.apply(null, x);    // calls head.js(x[0], x[1], ..., function(d) d.resolve())
}

var dataloadermap = { // json and xml are handled automatically
    csv:  "(function(csv) {return $.csv.toArrays(csv, {onParseValue: $.csv.hooks.castToScalar})})",
    yaml: "jsyaml.load"
};

function dataloader(x) {
    $.each(x, function(key, val){
        var _dl_defer = deferOn();
        var filetype = val.split('.').pop();
        $.get(val, function (content) {
            fun = dataloadermap[filetype] || "";
            eval(key + " = " + fun + "(content)");
            _dl_defer.resolve();
        });
    });
}


// escape html
function escape_html(str) {
    // escape ampersands, angle brackets, tabs, and newlines
    return $('<div/>').text(str).html();
}

var textbuffer = "";

function calculate_block() {
    var $this = $(this);
    var $inp = $this.find(".mdinput");
    var $out = $this.find(".mdresult");
    var attroutputid = $this.attr("outputid");
    if (typeof attroutputid != 'undefined') {
        $out = $("#" + attroutputid);
    }
    $active_element = $out;
    var nam = $this.attr("name");
    var attrlang = $this.attr("lang");
    var attrjquery = $this.attr("jquery");
    var attrscript = $this.attr("script");
    var first = "";  // text to be eval'd
    var middle = "";
    var last = "";
    var hasname = typeof nam != 'undefined' && nam != "";
    if (hasname) {
        first = nam + " = ";
    }
    if (attrlang == "js") {
        last = $inp.text();
    } else if (attrlang == "yaml") {
        last = "(jsyaml.load($inp.text()))";
    } else if (attrlang == "emblem" && !hasname) {  // only do this if not named
        last = "(function (x) {$active_element.append(Emblem.compile(Handlebars, x)(window))})($inp.text())";
    } else {
        last = "($inp.text())";
    }
    if (typeof attrjquery != 'undefined') {
        middle = "$out." + attrjquery;
    } else if (typeof attrscript != 'undefined') {
        middle = attrscript;
    }
    if (typeof attroutid != 'undefined') {
        $out.attr("id", attroutid);
    }
    $out.css('height', $out.height()).css('overflow', 'hidden'); // keep the page from jumping around
    $out.html("");
    textbuffer = "";
    //console.log(first + middle + last);
    eval(first + middle + last);
    if (textbuffer != "") {
        if ($this.attr("output") == "markdown") {
            $out.append(converter.makeHtml(textbuffer));
        } else {
            $out.append("<pre class='jsplain'>" + escape_html(textbuffer) + "</pre>");
        }
    }
    $out.css('height', 'auto').css('overflow', 'visible');
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
    if (this.name == "") return; // Bail out if an element isn't named.
    var cmd = "";
    if (this.type == "text") {
        window[this.name]  = this.value;
    } else if (this.type == "number") {
        window[this.name]  = Number(this.value);
    } else if (this.type == "radio" && this.checked) {
        window[this.name]  = this.value;
    } else if (this.type == "checkbox") {
        window[this.name]  = this.checked;
    } else if (this.nodeName.toLowerCase() == "select") {
        window[this.name]  = this[this.selectedIndex].value
    } else if (this.nodeName.toLowerCase() == "textarea") {
        window[this.name]  = this.value;
    }
}

var converter = new Showdown.converter();
var $active_element;

function calculate_forms() {  // page calculation
    var form_cmd = $(":input").map(read_form);
}

function calculate() {  // page calculation
    // calculate form elements first
    // TODO what about actively generated form elements?
    calculate_forms();
    // Now, start calculation with the first block. Calculations chain
    // from there.
    $(".mdblock[run='normal']").each(calculate_block);
}

function plot(data, options) {  // uses Flot
  var narg = 0
  if (typeof arguments[narg] == 'string') {   // it's the output id
    $el = $(arguments[narg])
    narg += 1
  } else {
    $el = $active_element
  }
  function isSeries(x) {
      return (Array.isArray(x) && Array.isArray(x[1])) ||
             (typeof x == "object" && !Array.isArray(x));
  }
  if (Array.isArray(arguments[narg]) &&
      isSeries(arguments[narg][0])) {   // all series given
    var data = arguments[narg];
    narg += 1
  } else if (isSeries(arguments[narg])) {   // one series
    data = [arguments[narg]];
    narg += 1
  } else if (Array.isArray(arguments[narg]) &&
             Array.isArray(arguments[narg + 1])) {   // two single vectors
    var data = [_.zip(arguments[narg], arguments[narg + 1])]; // converts to [[[x1,y1],[x2,y2],...]]
    narg += 2;
  }
  var options = arguments[narg];
  var pdiv = $('<div/>', {style: 'width:35em;height:25em'}).appendTo($el);
  $.plot(pdiv, data, options);
}

jQuery.fn.calculate = function() {
        return this.each(calculate_block);
};

return{
    calculate:calculate,
    calculate_forms:calculate_forms,
    calculate_block:calculate_block
}

}();
