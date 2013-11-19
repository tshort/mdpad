

mdpad = function() {

var deferred = new $.Deferred();  // Keeps track of things that need to load before the first page calculation


// when the DOM loads
head.ready(function() {
    $.ajax({
        type: "GET",
        url: window.location.search.substring(1),
        success: function (response) {
            var converter = new Showdown.converter({ extensions: ['md'] });
            $('#main_markdown').html(converter.makeHtml(response)); 
            deferred.resolve();
            convert_yamls();
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
           
function convert_yaml() {
    var inp = $(this).find(".yamlinput, .textinput");
    var out = $(this).find(".yamlresult, .textresult");
    var nam = $(this).attr("name");
    if (typeof nam == 'undefined') nam = "Y";
    var attrjquery = $(this).attr("jquery");
    var attrscript = $(this).attr("script");
    var first = nam + " = ";
    if ($(this).hasClass("yamlblock")) {
        var last = "(jsyaml.load(inp.text()))";
    } else {
        var last = "(inp.text())";
    }
    var middle = "";
    if (typeof attrjquery != 'undefined') {
        middle = "out." + attrjquery;    
    } else if (typeof attrscript != 'undefined') {
        middle = attrscript;    
    }
console.log(first+middle+last);
    eval(first + middle + last);
}

function convert_yamls() {
    var code = $("#main_markdown").find(".yamlblock, .textblock").each(convert_yaml);
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
    return node.nextInDOM(".jsblock");
}  

function calculate_forms() {  // page calculation
    var form_cmd = $(":input").map(read_form); 
}

function calculate() {  // page calculation
    // calculate form elements first
    // TODO what about actively generated form elements?
    calculate_forms();
    // Now, start calculation with the first block. Calculations chain
    // from there.
    calculate_forward(next_node($("#main_markdown")));
}

function plot(data, options) {  // uses Flot
    pdiv = $('<div/>', {style: 'width:600px;height:400px'}).appendTo($active_element);
    $.plot(pdiv, data, options);
}

jQuery.fn.calculate = function() {
    calculate_block($(this[0]));
};

return{
    calculate:calculate,
    calculate_forms:calculate_forms,
    calculate_block:calculate_block
}

}();


/*!
 * jQuery Next-In-Dom
 * http://techfoobar.com/jquery-next-in-dom/
 * 
 * Copyright (c) 2013 Vijayakrishnan Krishnan
 * Released under the MIT License
 * http://techfoobar.com/jquery-next-in-dom/LICENSE.MIT
 */
 (function($) {
 
	$.fn.nextInDOM = function(selector) {
		// NOTE: if multiple elements specified, only the first is considered
		var element = this;
		if(this.length > 1) element = this.first();
		return nextInDOM(selector?selector:'*', element, $('*').length, $('*').last());
	};
	
	$.fn.prevInDOM = function(selector) {
		// NOTE: if multiple elements specified, only the first is considered
		var element = this;
		if(this.length > 1) element = this.first();
		return prevInDOM(selector?selector:'*', element, $('*').length, $('*').first());
	};
	
	// next in dom implementation
	function nextInDOM(_selector, _subject, _maxNodes, _lastNode) {
		var nid = $(), next = getNext(_subject, _lastNode), iters = 1;
		$('html, body').addClass('cSeen');
	    while(next.length != 0) {
			if(iters > _maxNodes) return $();
			if(next.is(_selector)) {
				nid = next;
				break;
			}
	        next = getNext(next, _lastNode);
			iters++;
	    }
	    $('.cSeen').removeClass('cSeen');
	    return nid;
	}
	
	/*
	finding next (e) {
		if e has children & !e.traversed
			n = e.children.first
		else if e has next
			n = e.next
		else if e has parent
			e.parent.traversed = true
			n = next(e.parent)
		else n = null;
	}
	*/
	function getNext(_subject, _lastNode) {
		if(_subject[0] == _lastNode[0]) return $();
		if(!(_subject.hasClass('cSeen')) && _subject.children().length > 0) return _subject.children().first();
		else if(_subject.next().length > 0) return _subject.next();
		else if (_subject.parent().length > 0) {
			_subject.parent().addClass('cSeen');
			return getNext(_subject.parent(), _lastNode);
		}
	    return $();
	}
	
	// prev in dom implementation
	function prevInDOM(_selector, _subject, _maxNodes, _firstNode) {
	    var prev = getPrev(_subject, _firstNode), iters = 1;
		while(prev.length != 0) {
			if(iters > _maxNodes) return $();
	    	if(prev.is(_selector)) return prev;
	    	prev = getPrev(prev, _firstNode);
			iters++;
	    }
	    return $();
	}
	
	/*
	if e has prev and e.prev has children {
		n = deepest and farthest child of e.prev
	}
	else if e has prev {
		n = e.prev
	}
	else if e has parent {
		n = e.parent
	}
	*/
	function getPrev(_subject, _firstNode) {
		if(_subject[0] == _firstNode[0]) return $();
	    if(_subject.prev().length > 0 && _subject.prev().children().length > 0) {
			var p = _subject.prev().children().last();
			while(p.children().length > 0) p = p.children().last();
			return p;
		}
		else if(_subject.prev().length > 0) {
			return _subject.prev();
		}
		else if(_subject.parent().length > 0) {
			return _subject.parent();
		}
		return $();
	}
	
})(jQuery);
