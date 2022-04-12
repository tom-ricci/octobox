"use strict";
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
function e(e,n,t,o){return new(t||(t=Promise))((function(r,u){function i(e){try{l(o.next(e))}catch(e){u(e)}}function c(e){try{l(o.throw(e))}catch(e){u(e)}}function l(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}l((o=o.apply(e,n||[])).next())}))}Object.defineProperty(exports,"__esModule",{value:!0});exports.useScrollRestoration=(e,n)=>{e=null!=e?e:0,n=null!=n?n:0,window.scrollTo(e,n)},exports.useSleep=n=>e(void 0,void 0,void 0,(function*(){return new Promise((e=>setTimeout(e,n)))}));
//# sourceMappingURL=index.js.map
