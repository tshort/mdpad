// Markdown-Pad Extension
// ```js a=x b=y
// var a=1
// ```
//
// to 
//
// <div class='jsblock' a=x b=y>
//   <pre class='jsinput'>
//     <code>
// var a=1
//     </code>
//   </pre>
//   <div class = 'jsresult'></div>
// </div>
//

var _Templater = {
	format: function(template, values) {
		//
		// Utility function that replaces placeholders with parameterized values
		//
		// Example:
		// Inputs:
		// template = 'Here is some text: %text%'
		// values = {'text', 'Hello I am text!'}
		//
		// Output:
		// 'Here is some text: Hello I am text!'
		//
		// @param template The template to do replacements on.  Fields to be replaced should be surrounded
		//                 by percentage signs (e.g. %field%)
		// @param values A Javascript object literal containing the names of the fields to be replaced
		//               along with the replacement values (e.g. {'field': 'Replacement text'}
		for (value in values) {
			template = template.replace(new RegExp('%' + value + '%', 'g'), values[value], 'g');
		}
		return template;
	}
}

(function(){
    var md = function(converter) {
        return [
            {
              type    : 'lang',
              filter  : function(text) {
                text = text.replace(/(?:^|\n)```js(.*)\n([\s\S]*?)\n```/g,
                    function(wholeMatch,m1,m2) {
                        var extras = m1;
                        var codeblock = m2;
              
                        codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
                        codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace
              
                        codeblock = "<div class='jsblock' " + extras + " run='normal'><pre class='jsinput'><code>" + codeblock + 
                                      "\n</code></pre><div class = 'jsresult'></div></div>";
              
                        return codeblock;
                    }
                );
                return text;
              }
            },
            {
              type    : 'lang',
              filter  : function(text) {
                text = text.replace(/(?:^|\n)```yaml(.*)\n([\s\S]*?)\n```/g,
                    function(wholeMatch,m1,m2) {
                        var extras = m1;
                        var codeblock = m2;
              
                        codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
                        codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace
             
                        // add class="" if it's not there
                        if (!/class=/.test(extras)) extras = extras + ' class=""';
                        // add the yamlblock class
                        extras = extras.replace(/(.*class=".*)(.*".*)/,"$1 yamlblock$2");
                        codeblock = "<div " + extras + " run='normal'><pre class='yamlinput'><code>" + codeblock + 
                                      "\n</code></pre><div class = 'yamlresult'></div></div>";
              
                        return codeblock;
                    }
                );
                return text;
              }
            },
            {
              type    : 'lang',
              filter  : function(text) {
                text = text.replace(/(\w[\w \t\-]*(\*)?)[ \t]*=[ \t]*___(\(.*\))?(\[\d+\])?/g, function(wholeMatch, lhs, required, value, size) {
	            	var cleaned = lhs.replace(/\*/g, '').trim().replace(/\t/g, ' ');
	            	var inputName = cleaned.replace(/[ \t]/g, '-'); // convert spaces to hyphens
	            	value = value ? value.replace(/\(/, "").replace(/\)/, "") : "";
	            	return '<input type="text" name="' + inputName +  '" size="' + size + '" value="' + value + '"/>';
	            });
                return text;
              }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.md = md; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = mdpad_sd_ext;
}());
