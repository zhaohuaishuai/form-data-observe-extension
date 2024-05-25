import  sanitizeHtml from './sanitize-html.min.js';

/**
 *
 * @param {*} oldVnode
 * @param {*} newVnode
 * @return {
*    add: [],
*    remove: [],
*    update: []
* }
*
*/

export function diff(oldVnode, newVnode) {
 const add = [];
 const remove = [];
 const update = [];
 function vNodeDiff(oldVnode, newVnode, parentPath = []) {
   function subDiff(oldKey, newKey) {
     if (oldKey === newKey) {
       vNodeDiff(oldVnode[oldKey], newVnode[newKey], [...parentPath, newKey]);
     } else {
       add.push({
         path: [...parentPath, newKey],
         payload: newVnode[newKey],
       });
       remove.push({
         path: [...parentPath, oldKey],
         payload: oldVnode[oldKey],
       });
     }
   }

   if (isPrimitive(newVnode)) {
     if (oldVnode !== newVnode) {
       update.push({
         payload: [oldVnode, newVnode],
         path: parentPath,
       });
     }
     return oldVnode === newVnode;
   }

   if (Array.isArray(newVnode) && oldVnode !== null) {
     if (newVnode.length === oldVnode.length) {
       for (let i = 0; i < newVnode.length; i++) {
         vNodeDiff(oldVnode[i], newVnode[i], [...parentPath, i]);
       }
     }
     if (newVnode.length > oldVnode.length) {
       for (let i = 0; i < newVnode.length; i++) {
         if (i + 1 > oldVnode.length) {
           add.push({
             path: [...parentPath, i],
             payload: newVnode[i],
           });
           continue;
         }
         vNodeDiff(oldVnode[i], newVnode[i], [...parentPath, i]);
       }
     }

     if (newVnode.length < oldVnode.length) {
       for (let i = 0; i < oldVnode.length; i++) {
         if (i + 1 > newVnode.length) {
           remove.push({
             path: [...parentPath, i],
             payload: oldVnode[i],
           });
           continue;
         }
         vNodeDiff(oldVnode[i], newVnode[i], [...parentPath, i]);
       }
     }
     return;
   }
   const newKeys = Object.keys(newVnode);

   const oldKeys = Object.keys(isPrimitive(oldVnode) ? {} : oldVnode);

   const owendByAll = newKeys.filter((key) => oldKeys.includes(key));
   const addByAll = newKeys.filter((key) => !oldKeys.includes(key));
   const remoteByAll = oldKeys.filter((key) => !newKeys.includes(key));

   owendByAll.forEach((key) => {
     subDiff(key, key);
   });
   addByAll.forEach((key) => {
     add.push({
       path: [...parentPath, key],
       payload: newVnode[key],
     });
   });
   remoteByAll.forEach((key) => {
     remove.push({
       path: [...parentPath, key],
       payload: oldVnode[key],
     });
   });
 }
 vNodeDiff(oldVnode, newVnode);
 return { add, remove, update };
}

export function cloneNodePath(vnode) {
 if (vnode == null) {
   return null;
 }

 const cloneVnode = JSON.parse(JSON.stringify(vnode));

 function clone(cloneVnode, parentPath = [], parentCloneVnode = null) {
   if (isPrimitive(cloneVnode)) {
     if (parentPath.length > 0 && parentCloneVnode) {
       parentCloneVnode[parentPath.at(-1)] = parentPath.join('.');
       return;
     }
   }

   if (Array.isArray(cloneVnode)) {
     if (cloneVnode.length === 0) {
       if (parentPath.length > 0 && parentCloneVnode) {
         parentCloneVnode[parentPath.at(-1)] = parentPath.join('.');
         return;
       }
     }
     for (let i = 0; i < cloneVnode.length; i++) {
       clone(cloneVnode[i], [...parentPath, i], cloneVnode);
     }
     return;
   }
   const keys = Object.keys(cloneVnode);
   if (keys.length === 0) {
     if (parentPath.length > 0 && parentCloneVnode) {
       parentCloneVnode[parentPath.at(-1)] = parentPath.join('.');
       return;
     }
   }

   keys.forEach((key) => {
     clone(cloneVnode[key], [...parentPath, key], cloneVnode);
   });
   return;
 }
 clone(cloneVnode);

 return cloneVnode;
}

export function isPrimitive(value) {
 return (
   typeof value === 'number' ||
   typeof value === 'string' ||
   typeof value === 'boolean' ||
   typeof value === 'undefined' ||
   typeof value === 'function' ||
   typeof value === 'symbol' ||
   value === null
 );
}

export function valueToJsonStrign(value, isNode = false) {
 // 清洗富文本
 value = sanitizeHtml(value, {
   allowedTags: [], // 不允许任何标签
 });
 if (value.length >= 20) {
   value = value.substring(0, 20) + '...';
 }
 if (value === null) {
   if (isNode) {
     return '<span class="hljs-literal">null</span>';
   }
   return 'null';
 }
 if (typeof value === 'undefined') {
   if (isNode) {
     return '<span class="hljs-literal">undefined</span>';
   }
   return 'undefined';
 }

 if (typeof value === 'string') {
   if (isNode) {
     return '<span class="hljs-string">"' + value + '"</span>';
   }
   return '"' + value + '"';
 }

 if (
   typeof value === 'function' ||
   typeof value === 'symbol' ||
   typeof value === 'boolean'
 ) {
   if (isNode) {
     return '<span class="hljs-literal">' + value.toString() + '</span>';
   }
   return value.toString();
 }

 if (typeof value === 'number') {
   if (isNode) {
     return '<span class="hljs-literal">' + value + '</span>';
   }
   return value;
 }

 if (isNode) {
   return '<span class="hljs-string">"' + value + '"</span>';
 }

 return value;
}

export function valueToClassName(value) {
 if (value === null) {
   return 'hljs-literal';
 }
 if (typeof value === 'undefined') {
   return 'hljs-literal';
 }

 if (typeof value === 'string') {
   return 'hljs-string';
 }

 if (
   typeof value === 'function' ||
   typeof value === 'symbol' ||
   typeof value === 'boolean'
 ) {
   return 'hljs-literal';
 }

 if (typeof value === 'number') {
   return 'hljs-literal';
 }

 return 'hljs-string';
}

export const isUpdata = (customParentPath, diffData) => {
 return diffData.update.some((item) => {
   return customParentPath.join('.') === item.path.join('.');
 });
};

export const isAdd = (customParentPath, diffData) => {
 return diffData.add.some((item) => {
   return customParentPath.join('.') === item.path.join('.');
 });
};

export const statusClassName = (customParentPath, diffData) => {
 if (isUpdata(customParentPath, diffData)) {
   return 'update_status';
 }

 if (isAdd(customParentPath, diffData)) {
   return 'add_status';
 }

 return '';
};

const addStatusHtml =
 '<span class="hljs-string flag_status_tag add" >add</span>';
const updateStatusHtml =
 '<span class="hljs-string flag_status_tag update" >update</span>';

function _jsonTostringify(value, container, diffData, extendsNodePath = []) {
 const { add, remove, update } = diffData;
 const addClassStatus = 'add_status';
 const updateClassName = 'update_status';
 function stringify(value, tierNum = 0, parentPath = []) {
   const t = Array.from({ length: tierNum })
     .map(() => ' ')
     .join('');

   if (isPrimitive(value)) {
     const isAdd = add
       .map((item) => item.path.join('.'))
       .includes([...parentPath].join('.'));
     const isUpdate = update
       .map((item) => item.path.join('.'))
       .includes([...parentPath].join('.'));
     const diffFlgString = () => {
       return `${isAdd ? addStatusHtml : isUpdate ? updateStatusHtml : ''}`;
     };
     const diffFlgClassNameString = () => {
       return `${isAdd ? addClassStatus : isUpdate ? updateClassName : ''}`;
     };
     if (typeof value === 'string' && value.split('\n').length > 1) {
       return value
         .split('\n')
         .map((item, index) => {
           if (index > 0) {
             return '\n' + t + item;
           }
           return item;
         })
         .join('');
     }

     return valueToJsonStrign(value, true) + diffFlgString();
   }
   const isArray = Array.isArray(value);
   let txt = '';
   const keys = Object.keys(value);

   for (let i = 0; i < keys.length; i++) {
     const key = keys[i];
     const data = value[key];
     const itemIsAraay = Array.isArray(data);
     const pathArr = [...parentPath, key];
     const currentPath = pathArr.join('.');
     const isAdd = add
       .map((item) => item.path.join('.'))
       .includes(currentPath);
     const isUpdate = update
       .map((item) => item.path.join('.'))
       .includes(currentPath);
     const diffFlgString = () => {
       return `${isAdd ? addStatusHtml : isUpdate ? updateStatusHtml : ''}`;
     };
     const isClodeNode = extendsNodePath.includes(currentPath);

     if (isClodeNode) {
       txt +=
         `<div style="display:inline;"  data-path="${pathArr.join(
           '.'
         )}" data-node>` +
         `${t}` +
         `${stringify(key)}:` +
         `${itemIsAraay ? `[...]` : `{...}`}` +
         `${i + 1 === keys.length ? '' : ',\n'}</div>`;
       continue;
     }

     if (isPrimitive(data)) {
       txt +=
         `<div style="display:inline;" class="${statusClassName(
           pathArr,
           diffData
         )}" data-path="${pathArr.join('.')}">${t}${
           !isArray ? `${stringify(key)}:` : ''
         }` +
         `${stringify(data, tierNum + 2, pathArr)}` +
         `${i + 1 === keys.length ? '' : ',\n'}</div>`;
       continue;
     }
     const keysLen = Object.keys(data).length;
     if (keysLen === 0) {
       txt +=
         `<div style="display:inline;" class="${statusClassName(
           pathArr,
           diffData
         )}" data-path="${pathArr.join('.')}">${t}${stringify(key) + ':'}${
           itemIsAraay ? '[]' : '{}'
         }` +
         `${diffFlgString()}` +
         `${i + 1 === keys.length ? '' : ',\n'}</div>`;
       continue;
     }
     if (isArray) {
       txt +=
         `${
           diffFlgString()
             ? Array.from({ length: tierNum - 2 })
                 .map(() => ' ')
                 .join('')
             : t
         }${diffFlgString()}<div style="display:inline;" class="${statusClassName(
           pathArr,
           diffData
         )}"  data-path="${pathArr.join('.')}" data-node >${
           itemIsAraay ? '[\n' : '{\n'
         }` +
         `${stringify(data, tierNum + 2, pathArr)}` +
         `${
           itemIsAraay
             ? i + 1 === keys.length
               ? '\n' + t + ']'
               : '\n' + t + '],\n'
             : i + 1 === keys.length
             ? '\n' + t + '}'
             : '\n' + t + '},\n'
         }</div>`;
       continue;
     }

     txt +=
       `${
         diffFlgString()
           ? Array.from({ length: tierNum - 2 })
               .map(() => ' ')
               .join('')
           : t
       }${diffFlgString()}${stringify(key) + ':'}` +
       `<div style="display:inline;" class="${statusClassName(
         pathArr,
         diffData
       )}" data-path="${pathArr.join('.')}" data-node >` +
       `${itemIsAraay ? '[\n' : '{\n'}` +
       `${stringify(data, tierNum + 2, pathArr)}` +
       `${
         itemIsAraay
           ? i + 1 === keys.length
             ? '\n' + t + ']'
             : '\n' + t + '],\n'
           : i + 1 === keys.length
           ? '\n' + t + '}'
           : '\n' + t + '},\n'
       }</div>`;
   }
   return txt;
 }
 const html =
   `${Array.isArray(value) ? '[\n' : '{\n'}` +
   stringify(value, 2) +
   `${Array.isArray(value) ? '\n]' : '\n}'}`;
 if (container) {
   container.innerHTML = html;
 }
 const lineArr = html.split('\n');
 return {
   lineNum: lineArr.length,
   lineArr: lineArr,
 };
}

export const jsonTostringify = _jsonTostringify;

export class DataFormObserve {
 _jsonTostringify = _jsonTostringify;
 _container = null;
 nodeStrinSplice = [];
 diffData = [];
 oldData = null;
 lineNum = 0;
 extendsNodePath = [];
 constructor({ container, onUpdate, plugins } = {}) {
   this._container = container || null;
   this.onUpdate = onUpdate || null;
   this.plugins = plugins || [];
   this.eventInit();
 }
 set container(container) {
   this._container = container;
   this.eventInit();
 }
 get container() {
   return this._container;
 }
 update = (newData, isUploadOldData = true, { eventType } = {}) => {
   eventType = eventType || 'updateType';
   if (isUploadOldData) {
     this.diffData = diff(this.oldData, newData);
   }
   const { lineNum, lineArr } = this._jsonTostringify(
     newData,
     this.container,
     this.diffData,
     this.extendsNodePath
   );
   if (isUploadOldData) {
     this.oldData = newData;
   }

   const reg = /(?<=data-path=").*?(?=")/g;

   this.nodeStrinSplice = lineArr.map((item, index) => {
     const match = item.match(reg);
     return {
       line: index + 1,
       isNode: item.includes('data-node'),
       path: match ? match[0] : '',
       isExpansion: !this.extendsNodePath.includes(match ? match[0] : ''),
     };
   });
   this.lineNum = lineNum;

   const pushData = {
     lineNum,
     nodeStrinSplice: this.nodeStrinSplice,
     diffData: this.diffData,
     event: {
       eventType: eventType,
     },
   };
   this.plugins.forEach((plugin) => {
     if (plugin.scroll) {
       plugin.scroll(this.container, pushData);
     }
   });

   this.onUpdate(pushData);
 };
 handleExtendsNode(item) {
   if (this.extendsNodePath.includes(item.path)) {
     this.extendsNodePath = this.extendsNodePath.filter(
       (path) => path != item.path
     );
   } else {
     this.extendsNodePath.push(item.path);
   }
   this.update(this.oldData, false, {
     eventType: 'extendEvent',
   });
 }

 eventInit() {
   // console.log('事件初始化--》', this.container);
   // if (this.container) {
   //   this.container.onScroll((e) => {
   //     console.log('滚动事件', e);
   //   });
   // }
 }
}

export class ScrollUpdateObserve {
 async scroll(container, pushData) {
   const { diffData, event } = pushData;
   if (event.eventType === 'updateType') {
     const { update, add } = diffData;
     const queryStrig = [];
     if (update.length > 0) {
       update.forEach((item) => {
         queryStrig.push({
           path: item.path.join('.'),
           dom: document.querySelector(
             '[data-path="' + item.path.join('.') + '"]'
           ),
         });
       });
     }
     if (add.length > 0) {
       add.forEach((item) => {
         queryStrig.push({
           path: item.path.join('.'),
           dom: document.querySelector(
             '[data-path="' + item.path.join('.') + '"]'
           ),
         });
       });
     }
     const offsetTops = [];
     if (queryStrig.length > 0) {
       // queryStrig.at(-1).dom.scrollIntoView({
       //   behavior: 'smooth',
       //   block: 'end',
       //   inline: 'nearest',
       // });

       for (let i = 0; i < queryStrig.length; i++) {
         offsetTops.push({
           dom: queryStrig[i].dom,
           top: queryStrig[i].dom.offsetTop,
         });
       }
       offsetTops.sort((a, b) => {
         return a.top - b.top;
       });

       for (let i = 0; i < offsetTops.length; i++) {
         await this.scrollToTargetDom(offsetTops[i]);
       }
     }
   }
 }

 async scrollToTargetDom({ dom, top }) {
   return new Promise((resolve, reject) => {
     dom.scrollIntoView({
       behavior: 'smooth',
       block: 'center',
       inline: 'nearest',
     });
     dom.classList.toggle('flash_anim');
     setTimeout(() => {
       dom.classList.toggle('flash_anim');
       resolve();
     }, 500);
   });
 }
}
