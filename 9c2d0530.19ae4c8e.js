(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{114:function(e,r,t){"use strict";t.d(r,"a",(function(){return s})),t.d(r,"b",(function(){return f}));var n=t(0),a=t.n(n);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var b=a.a.createContext({}),p=function(e){var r=a.a.useContext(b),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},s=function(e){var r=p(e.components);return a.a.createElement(b.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return a.a.createElement(a.a.Fragment,{},r)}},d=a.a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,i=e.originalType,o=e.parentName,b=c(e,["components","mdxType","originalType","parentName"]),s=p(t),d=n,f=s["".concat(o,".").concat(d)]||s[d]||u[d]||i;return t?a.a.createElement(f,l(l({ref:r},b),{},{components:t})):a.a.createElement(f,l({ref:r},b))}));function f(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var i=t.length,o=new Array(i);o[0]=d;var l={};for(var c in r)hasOwnProperty.call(r,c)&&(l[c]=r[c]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var b=2;b<i;b++)o[b]=t[b];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},94:function(e,r,t){"use strict";t.r(r),t.d(r,"frontMatter",(function(){return o})),t.d(r,"metadata",(function(){return l})),t.d(r,"rightToc",(function(){return c})),t.d(r,"default",(function(){return p}));var n=t(2),a=t(6),i=(t(0),t(114)),o={id:"webshellinvariantprops",title:"Interface: WebshellInvariantProps",sidebar_label:"WebshellInvariantProps",hide_title:!0},l={unversionedId:"api/interfaces/webshellinvariantprops",id:"api/interfaces/webshellinvariantprops",isDocsHomePage:!1,title:"Interface: WebshellInvariantProps",description:"Interface: WebshellInvariantProps",source:"@site/docs/api/interfaces/webshellinvariantprops.md",slug:"/api/interfaces/webshellinvariantprops",permalink:"/webshell/docs/api/interfaces/webshellinvariantprops",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/api/interfaces/webshellinvariantprops.md",version:"current",sidebar_label:"WebshellInvariantProps",sidebar:"someSidebar",previous:{title:"Interface: WebjsContext",permalink:"/webshell/docs/api/interfaces/webjscontext"}},c=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Properties",id:"properties",children:[{value:"onWebFeatureError",id:"onwebfeatureerror",children:[]},{value:"webHandle",id:"webhandle",children:[]},{value:"webshellDebug",id:"webshelldebug",children:[]}]}],b={rightToc:c};function p(e){var r=e.components,t=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},b,t,{components:r,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"interface-webshellinvariantprops"},"Interface: WebshellInvariantProps"),Object(i.b)("p",null,"Props any Webshell component will support."),Object(i.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"WebshellInvariantProps"))),Object(i.b)("h2",{id:"properties"},"Properties"),Object(i.b)("h3",{id:"onwebfeatureerror"},"onWebFeatureError"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(i.b)("strong",{parentName:"p"},"onWebFeatureError"),": (featureIdentifier: string,error: string) => void"),Object(i.b)("p",null,"Triggered when a feature script throws."),Object(i.b)("hr",null),Object(i.b)("h3",{id:"webhandle"},"webHandle"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(i.b)("strong",{parentName:"p"},"webHandle"),": Ref","<",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"/webshell/docs/api/interfaces/webhandle"}),"WebHandle"),">"),Object(i.b)("p",null,"Pass a reference to send messages to the Web environment."),Object(i.b)("hr",null),Object(i.b)("h3",{id:"webshelldebug"},"webshellDebug"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(i.b)("strong",{parentName:"p"},"webshellDebug"),": boolean"),Object(i.b)("p",null,"Report Web error messages from features in the console."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},Object(i.b)("inlineCode",{parentName:"strong"},"defaultvalue"))," ",Object(i.b)("inlineCode",{parentName:"p"},"__DEV__")))}p.isMDXComponent=!0}}]);