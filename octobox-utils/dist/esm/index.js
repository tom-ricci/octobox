/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function n(n,t,o,e){return new(o||(o=Promise))((function(i,c){function u(n){try{l(e.next(n))}catch(n){c(n)}}function r(n){try{l(e.throw(n))}catch(n){c(n)}}function l(n){var t;n.done?i(n.value):(t=n.value,t instanceof o?t:new o((function(n){n(t)}))).then(u,r)}l((e=e.apply(n,t||[])).next())}))}const t=t=>n(void 0,void 0,void 0,(function*(){return new Promise((n=>setTimeout(n,t)))})),o=(n,t)=>{n=null!=n?n:0,t=null!=t?t:0,window.scrollTo(n,t)};export{o as useScrollRestoration,t as useSleep};
//# sourceMappingURL=index.js.map
