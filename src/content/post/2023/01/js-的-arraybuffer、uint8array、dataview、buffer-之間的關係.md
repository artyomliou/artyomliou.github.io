---
layout: ../../../../layouts/PostLayout.astro
title: JS 的 ArrayBuffer、Uint8Array、DataView、Buffer 之間的關係
imgSrc: /wp-content/uploads/2023/01/20230103-arraybuffer.jpg
slug: 2023/01/js-的-arraybuffer、uint8array、dataview、buffer-之間的關係
---

![](/wp-content/uploads/2023/01/20230103-arraybuffer-1024x336.jpg)



  
[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 是本篇文章將提到各個 API 的根本



  
它的別稱是「Byte Array」，就是 Byte Array 的意思，在這個「Array」中每一個 element 就是一個 Byte（8 bits）。



  
因為在宣告時就要定義長度，比如 `new ArrayBuffer(4)` 便會分配總共 4 Bytes（32 bits）的空間。對於這樣連續的記憶體，JS 不允許你直接寫資料到裡面，而要透過一些 View 幫你操作，比如有多種類型讀寫能力、但一次只能讀寫一個數字的 [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)，或者一次只能使用一種資料類型、但可以一次性寫入多個數字的 [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)。







<br><br>



  
## View



  
不管是 [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/DataView#syntax) 還是 [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#constructor)，他們本身都沒有資料，只有對 ArrayBuffer 的參考，以及檢視範圍。這一點可以從他們的 constructor 看出來。在這範圍內，你可以使用這兩種 View 提供的能力，任意讀寫 ArrayBuffer 中的資料。



  
甚至可以在同一個 ArrayBuffer 上建立兩種 View，並用他們各自提供的能力任意讀寫，可以參考 [msgpack-nodejs byte-array.ts](https://github.com/artyomliou/msgpack-nodejs/blob/main/src/encoder/byte-array.ts)



<br><br>



  
### TypedArray



  
其實它是[一系列 View 的統稱](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects)，建立他們，其實就是建立「使用特定資料型態讀寫資料的 View」。



  
有正整數用的：




  
- Uint8Array（常用）



  
- Uint16Array



  
- Uint32Array



  
- BigUint64Array




  
也有正負整數都能用的：




  
- Int8Array



  
- Int16Array



  
- Int32Array



  
- BigInt64Array




  
還有兩個浮點數用的：




  
- Float32Array



  
- Float64Array




<br><br>



  
#### new Uint8Array(length)



  
其實所有 TypedArray constructor 都接受 length 參數，是陣列長度的意思。用這種方式建立的 TypedArray，本身還是沒有資料。可以想像它其實是先計算所需長度、並建立 ArrayBuffer，接著在其上再建立一個 TypedArray。



  
至於這樣子的陣列實際佔據的空間要看他的 Type。比如說：




  
- `new Uint32Array(4)` 是 32 bits * 4（4 bytes * 4）



  
- `new Uint8Array(4)` 是 8 bits * 4（1 bytes * 4）。




<br><br>



  
### DataView



  
它的作用是把 ArrayBuffer 中的資料讀寫成你想要的資料型態，比如 [getInt8()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt8) 一次讀取 1 byte，並把數字回傳為整數，因為只有 1 byte，所以只能表示 -128 ~127 之間的數字；又或者 [getInt32()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt32) 一次讀取 4 byte，並把數字回傳為整數，因為有 4 byte，所以可以表示 -2147483648 到 2147483647 之間的數字。



  
當然，要是使用 U 系列 function 讀寫正整數，那能表示的正整數會更高，但就不能是負整數。



<br><br>



  
#### Endianess (Byte Order)



  
DataView 還有一大好處，是寫入超過 1 byte 的資料時可以可以控制 bytes 的順序，詳情可以看 [wiki](https://zh.wikipedia.org/zh-tw/%E5%AD%97%E8%8A%82%E5%BA%8F) 或 [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) 的介紹。需要控制這個的原因，一個是機器差異，另一個可能是某些傳輸格式的要求，比如 MessagePack 在[其規格](https://github.com/msgpack/msgpack/blob/master/spec.md)中要求所有資料都用 big-endian 寫入。



  
DataView 的實際應用可以參考 [msgpack-nodejs encodeInteger()](https://github.com/artyomliou/msgpack-nodejs/blob/main/src/encoder/encoder.ts#L125-L161)



<br><br>



  
## 在同一個 ArrayBuffer 上建立新的 TypedArray



  
TypedArray 的 [subarray()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) 可以用來對其下的 ArrayBuffer 建立一個同樣資料型態、但不同範圍的 View。



  
比如以下的程式碼：



  
```
/**
 * @param {Uint32Array} view 
 */
function printTypedArrayInfo(view) {
  console.log(`[view] offset = ${view.byteOffset}, length = ${view.byteLength}`)
  console.log(`[buffer] length = ${view.buffer.byteLength}`)
}

const buf = new ArrayBuffer(12)
const view = new Uint32Array(buf)
printTypedArrayInfo(view)
// [view] offset = 0, length = 12
// [buffer] length = 12

const view2 = view.subarray(2)
printTypedArrayInfo(view2)
// [view] offset = 8, length = 4
// [buffer] length = 12
```



  
我們可以得知，在 `subarray()` 前後，兩個 view 底下的 buffer 長度都不變。只有我們手動指定了檢視範圍的 `view2`，它的 offset 是從我們指定的位置開始，直到 buffer 結束。



<br><br>



  
## 在 TypedArray 之間複製資料



  
比如我原本的 TypedArray 長度不夠用，我想建立一個新的、長度更長的 TypedArray，並把資料複製過去（[實際案例](https://github.com/artyomliou/msgpack-nodejs/blob/main/src/encoder/byte-array.ts#L18-L34)），那我可以寫類似底下的程式碼：



  
```
const view = new Uint8Array(8)
view.set([1, 2, 3, 4, 5, 6, 7, 8])
console.log(view)
// Uint8Array(8) [
//   1, 2, 3, 4,
//   5, 6, 7, 8
// ]

const view2 = new Uint8Array(12)
view2.set(view, 4) // offset here is not necessary
console.log(view2)
// Uint8Array(12) [
//   0, 0, 0, 0, 1,
//   2, 3, 4, 5, 6,
//   7, 8
// ]
```



<br><br>



  
## 專屬於 Node.js 的 Buffer



  
[Buffer](https://nodejs.org/api/buffer.html) 站在 Uint8Array（TypedArray）的基礎上，又加入了很多 function。



  
具體來說，Buffer 除了有 TypedArray 應該要有的 function 之外，他還加入了很多 DataView 提供的各種資料型態的讀寫能力，比如用來讀寫 big-endian int32 的 [buf.readInt32BE()](https://nodejs.org/api/buffer.html#bufreadint32beoffset)、[buf.writeInt32BE()](https://nodejs.org/api/buffer.html#bufwriteint32bevalue-offset)。



  
不過要注意的是：Buffer 與 TypedArray 有些行為上的差異，可以讀[這一個章節](https://nodejs.org/api/buffer.html#buffers-and-typedarrays)。



<br><br>



  
## 參考




  
- [MDN ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)



  
- [MDN TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)



  
- [MDN DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)



  
- [Node.js Buffer](https://nodejs.org/api/buffer.html)



  
- [PJCHENder – [JS] TypedArray, ArrayBuffer 和 DataView](https://pjchender.dev/javascript/js-typedarray-buffer-dataview/)

