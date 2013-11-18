// Copyright Tom Short, 2013, MIT license (see LICENSE.txt)
// Adapted from the jQuery.dform code, copyright David Luecke, also with the MIT license.

$.dform.subscribe("bs3caption", function(options, type) {
    var ops = {};
    if (typeof (options) === "string") {
            ops["html"] = options;
    } else {
            $.extend(ops, options);
    }
    ops.type = "label";
    if (this.attr("id")) {
            ops["for"] = this.attr("id");
    }
    var col1class = this.parent().attr("col1class");
    var col2class = this.parent().attr("col2class");
    this.wrap("<div class='form-group'/>");
    if (type === "checkbox" || type === "radio") {
        this.wrap("<label>" + options + "</label>").parent()
            .wrap("<div class='"+type+"'/>").parent()
            .wrap("<div class='"+col2class+"'/>")
        if (col1class) {
            this.parent().parent().parent().before("<div class = '" + col1class + "'/>"); 
        }
    } else {
        var label = $($.dform.createElement(ops));
        this.addClass("form-control");
        label.addClass("control-label");
        label.insertBefore(this);
        label.addClass(col1class);
        this.wrap("<div class='" + col2class + "'/>");
        label.dform('run', ops);
    }
});

$.dform.subscribe("choices", function(options, type) {
// This is like the "options" subscriber, but the input is just an array with choices.
// The content and tag value are the same.
// Only selects are supported.
    var self = this;
    // Options for select elements
    if ((type === "select") && typeof options !== 'string')
    {
        $.each(options, function (value, content) {
            var option = { type : 'option', value : content };
            if (typeof (content) === "string") {
                option.html = content;
            }
            if (typeof (content) === "object") {
                option = $.extend(option, content);
            }
            self.dform('append', option);
        });
    }
});


// Extend the "value" subscriber for selects to set selected=selected
// when value equals the item value.
$.dform.subscribe("value", function(options, type) {
    var self = this;
    if(type === "option" && this.parent().attr("selectvalue") === options) {
        this.attr("selected", "selected");
    }
});
