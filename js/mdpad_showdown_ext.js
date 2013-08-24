//
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

(function(){
    var mdpad_showdown_ext = function(converter) {
        return [
            {
              // strike-through
              // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
              type : 'lang',
              regex   : '(~T){2}([^~]+)(~T){2}',
              replace : function(match, prefix, content, suffix) {
                  return '<del>' + content + '</del>';
              }
              // regex : '```.*js(.*)\n([\s\S]*?)\n```',
              // replace : function(match, extras, codeblock) {
			  //     // codeblock = _EncodeCode(codeblock);
			  //     // codeblock = _Detab(codeblock);
			  //     codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			  //     codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

			  //     codeblock = "<div class='jsblock' " + extras + " run='normal'><pre class='jsinput'><code>\n" + codeblock + 
              //                 "\n</code></pre><div class = 'jsresult'></div></div>";

			  //     // return hashBlock(codeblock);
			  //     return codeblock;
              // }
            }
        ];
    };
console.log("hi")

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.mdpad_showdown_ext = mdpad_showdown_ext; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = mdpad_showdown_ext;
}());
