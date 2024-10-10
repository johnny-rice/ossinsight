"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[9493],{3905:(e,t,r)=>{r.d(t,{Zo:()=>m,kt:()=>p});var a=r(67294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),i=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},m=function(e){var t=i(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,l=e.originalType,s=e.parentName,m=c(e,["components","mdxType","originalType","parentName"]),d=i(r),p=n,g=d["".concat(s,".").concat(p)]||d[p]||u[p]||l;return r?a.createElement(g,o(o({ref:t},m),{},{components:r})):a.createElement(g,o({ref:t},m))}));function p(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=r.length,o=new Array(l);o[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,o[1]=c;for(var i=2;i<l;i++)o[i]=r[i];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},39058:(e,t,r)=>{r.d(t,{Z:()=>P});var a=r(67294),n=r(86010),l=r(5018),o=r(87524),c=r(39960),s=r(95999);const i="sidebar_re4s",m="sidebarItemTitle_pO2u",u="sidebarItemList_Yudw",d="sidebarItem__DBe",p="sidebarItemLink_mo7H",g="sidebarItemLinkActive_I1ZP";function f(e){let{sidebar:t}=e;return a.createElement("aside",{className:"col col--3"},a.createElement("nav",{className:(0,n.Z)(i,"thin-scrollbar"),"aria-label":(0,s.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},a.createElement("div",{className:(0,n.Z)(m,"margin-bottom--md")},t.title),a.createElement("ul",{className:(0,n.Z)(u,"clean-list")},t.items.map((e=>a.createElement("li",{key:e.permalink,className:d},a.createElement(c.Z,{isNavLink:!0,to:e.permalink,className:p,activeClassName:g},e.title)))))))}var h=r(13102);function b(e){let{sidebar:t}=e;return a.createElement("ul",{className:"menu__list"},t.items.map((e=>a.createElement("li",{key:e.permalink,className:"menu__list-item"},a.createElement(c.Z,{isNavLink:!0,to:e.permalink,className:"menu__link",activeClassName:"menu__link--active"},e.title)))))}function E(e){return a.createElement(h.Zo,{component:b,props:e})}function v(e){let{sidebar:t}=e;const r=(0,o.i)();return null!=t&&t.items.length?"mobile"===r?a.createElement(E,{sidebar:t}):a.createElement(f,{sidebar:t}):null}function P(e){const{sidebar:t,toc:r,children:o,...c}=e,s=t&&t.items.length>0;return a.createElement(l.Z,c,a.createElement("div",{className:"container margin-vert--lg"},a.createElement("div",{className:"row"},a.createElement(v,{sidebar:t}),a.createElement("main",{className:(0,n.Z)("col",{"col--7":s,"col--9 col--offset-1":!s}),itemScope:!0,itemType:"http://schema.org/Blog"},o),r&&a.createElement("div",{className:"col col--2"},r))))}},15289:(e,t,r)=>{r.d(t,{Z:()=>o});var a=r(67294),n=r(44996),l=r(9460);function o(e){let{children:t,className:r}=e;const{frontMatter:o,assets:c}=(0,l.C)(),{withBaseUrl:s}=(0,n.C)(),i=c.image??o.image;return a.createElement("article",{className:r,itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},i&&a.createElement("meta",{itemProp:"image",content:s(i,{absolute:!0})}),t)}},99714:(e,t,r)=>{r.d(t,{Z:()=>s});var a=r(67294),n=r(86010),l=r(18780),o=r(9460),c=r(53470);function s(e){let{children:t,className:r}=e;const{isBlogPostPage:s}=(0,o.C)();return a.createElement("div",{id:s?l.blogPostContainerID:void 0,className:(0,n.Z)("markdown",r),itemProp:"articleBody"},a.createElement(c.Z,null,t))}},12046:(e,t,r)=>{r.d(t,{Z:()=>g});var a=r(67294),n=r(86010),l=r(9460),o=r(84881),c=r(71526),s=r(87462),i=r(95999),m=r(39960);function u(){return a.createElement("b",null,a.createElement(i.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))}function d(e){const{blogPostTitle:t,...r}=e;return a.createElement(m.Z,(0,s.Z)({"aria-label":(0,i.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t})},r),a.createElement(u,null))}const p="blogPostFooterDetailsFull_mRVl";function g(){const{metadata:e,isBlogPostPage:t}=(0,l.C)(),{tags:r,title:s,editUrl:i,hasTruncateMarker:m}=e,u=!t&&m,g=r.length>0;return g||u||i?a.createElement("footer",{className:(0,n.Z)("row docusaurus-mt-lg",t&&p)},g&&a.createElement("div",{className:(0,n.Z)("col",{"col--9":u})},a.createElement(c.Z,{tags:r})),t&&i&&a.createElement("div",{className:"col margin-top--sm"},a.createElement(o.Z,{editUrl:i})),u&&a.createElement("div",{className:(0,n.Z)("col text--right",{"col--3":g})},a.createElement(d,{blogPostTitle:s,to:e.permalink}))):null}},79224:(e,t,r)=>{r.d(t,{Z:()=>N});var a=r(67294),n=r(86010),l=r(39960),o=r(9460);const c="title_f1Hy";function s(e){let{className:t}=e;const{metadata:r,isBlogPostPage:s}=(0,o.C)(),{permalink:i,title:m}=r,u=s?"h1":"h2";return a.createElement(u,{className:(0,n.Z)(c,t),itemProp:"headline"},s?m:a.createElement(l.Z,{itemProp:"url",to:i},m))}var i=r(95999),m=r(88824);const u="container_mt6G";function d(e){let{readingTime:t}=e;const r=function(){const{selectMessage:e}=(0,m.c)();return t=>{const r=Math.ceil(t);return e(r,(0,i.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:r}))}}();return a.createElement(a.Fragment,null,r(t))}function p(e){let{date:t,formattedDate:r}=e;return a.createElement("time",{dateTime:t,itemProp:"datePublished"},r)}function g(){return a.createElement(a.Fragment,null," \xb7 ")}function f(e){let{className:t}=e;const{metadata:r}=(0,o.C)(),{date:l,formattedDate:c,readingTime:s}=r;return a.createElement("div",{className:(0,n.Z)(u,"margin-vert--md",t)},a.createElement(p,{date:l,formattedDate:c}),void 0!==s&&a.createElement(a.Fragment,null,a.createElement(g,null),a.createElement(d,{readingTime:s})))}function h(e){return e.href?a.createElement(l.Z,e):a.createElement(a.Fragment,null,e.children)}function b(e){let{author:t,className:r}=e;const{name:l,title:o,url:c,imageURL:s,email:i}=t,m=c||i&&`mailto:${i}`||void 0;return a.createElement("div",{className:(0,n.Z)("avatar margin-bottom--sm",r)},s&&a.createElement(h,{href:m,className:"avatar__photo-link"},a.createElement("img",{className:"avatar__photo",src:s,alt:l})),l&&a.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},a.createElement("div",{className:"avatar__name"},a.createElement(h,{href:m,itemProp:"url"},a.createElement("span",{itemProp:"name"},l))),o&&a.createElement("small",{className:"avatar__subtitle",itemProp:"description"},o)))}const E="authorCol_Hf19",v="imageOnlyAuthorRow_pa_O",P="imageOnlyAuthorCol_G86a";function y(e){let{className:t}=e;const{metadata:{authors:r},assets:l}=(0,o.C)();if(0===r.length)return null;const c=r.every((e=>{let{name:t}=e;return!t}));return a.createElement("div",{className:(0,n.Z)("margin-top--md margin-bottom--sm",c?v:"row",t)},r.map(((e,t)=>a.createElement("div",{className:(0,n.Z)(!c&&"col col--6",c?P:E),key:t},a.createElement(b,{author:{...e,imageURL:l.authorsImageUrls[t]??e.imageURL}})))))}function N(){return a.createElement("header",null,a.createElement(s,null),a.createElement(f,null),a.createElement(y,null))}},9460:(e,t,r)=>{r.d(t,{C:()=>c,n:()=>o});var a=r(67294),n=r(902);const l=a.createContext(null);function o(e){let{children:t,content:r,isBlogPostPage:n=!1}=e;const o=function(e){let{content:t,isBlogPostPage:r}=e;return(0,a.useMemo)((()=>({metadata:t.metadata,frontMatter:t.frontMatter,assets:t.assets,toc:t.toc,isBlogPostPage:r})),[t,r])}({content:r,isBlogPostPage:n});return a.createElement(l.Provider,{value:o},t)}function c(){const e=(0,a.useContext)(l);if(null===e)throw new n.i6("BlogPostProvider");return e}},88824:(e,t,r)=>{r.d(t,{c:()=>m});var a=r(67294),n=r(52263),l=r(25108);const o=["zero","one","two","few","many","other"];function c(e){return o.filter((t=>e.includes(t)))}const s={locale:"en",pluralForms:c(["one","other"]),select:e=>1===e?"one":"other"};function i(){const{i18n:{currentLocale:e}}=(0,n.Z)();return(0,a.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:c(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return l.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),s}}),[e])}function m(){const e=i();return{selectMessage:(t,r)=>function(e,t,r){const a=e.split("|");if(1===a.length)return a[0];a.length>r.pluralForms.length&&l.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${a.length}: ${e}`);const n=r.select(t),o=r.pluralForms.indexOf(n);return a[Math.min(o,a.length-1)]}(r,t,e)}}}}]);