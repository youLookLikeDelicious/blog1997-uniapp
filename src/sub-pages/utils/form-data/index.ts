// @see https://github.com/zlyboy/wx-formdata

import mimeMap from './mimeMap'

interface File {
  buffer: ArrayBuffer,
  fileName: string,
  name: string
}

interface FileData {
  url: string,
  name: string // 表单的key
}

export default class FormData
{
  fileManager: UniApp.FileSystemManager
  files: File[]
  data: Record<string, any>

  boundaryKey: string
  boundary: string
  endBoundary: string

  constructor() {
    this.fileManager = uni.getFileSystemManager()
    this.files = []
    this.data = {}

    this.boundaryKey = 'wxmpFormBoundary' + this.randString()
    this.boundary = `------${this.boundaryKey}`
    this.endBoundary = `------${this.boundaryKey}--`
  }

  append(name: string, value: any) {
    this.data[name] = value
  }

  appendFile(files: FileData | FileData[]) {
    if (!Array.isArray(files)) {
      files = [files]
    }
    this.files = this.files.concat(files.map(file => {
      let buffer = this.fileManager.readFileSync(file.url) as ArrayBuffer
      if(Object.prototype.toString.call(buffer).indexOf("ArrayBuffer") < 0){
        new Error('文件读取失败')
      }

      const fileName = this.getFileNameFromPath(file.url)

      return { name: file.name, buffer, fileName }
    }))
  }

  formDataArray(name: string, value: any, fileName = '') {
    let dataString = '';
    const isFile = !!fileName;

    dataString += this.boundary + '\r\n';
    dataString += `Content-Disposition: form-data; name="${name}"`;
    if (isFile){
      dataString += `; filename="${fileName}" \r\n`;
      const mime = this.getFileMime(fileName)
      dataString += `Content-Type: ${mime} \r\n\r\n`;
    }
    else{
      dataString += '\r\n\r\n';
      dataString += value;
    }

    let dataArray = []
    dataArray.push(...toUtf8Bytes(dataString));

    if (isFile) {
      dataArray = dataArray.concat(Array.prototype.slice.call(new Uint8Array(value)))
    }
    dataArray.push(...toUtf8Bytes("\r\n"))

    return dataArray;
  }

  getData() {  
    let postArray: any[] = [];
    
    //拼接参数
    if(Object.keys(this.data).length){
      for(let key in this.data){
        postArray = postArray.concat(this.formDataArray(key, this.data[key]));
      }
    }

    //拼接文件
    if(Object.keys(this.files).length){
      const images = this.files.map(file => this.formDataArray(file.name, file.buffer, file.fileName))
      images.forEach(img => {
        postArray = postArray.concat(img)
      })
    }

    //结尾
    let endBoundaryArray = [];
    endBoundaryArray.push(...toUtf8Bytes(this.endBoundary))
    postArray = postArray.concat(endBoundaryArray)
    return {
      contentType: `multipart/form-data; boundary=----${this.boundaryKey}`,
      buffer: new Uint8Array(postArray).buffer
    }
  }

  getFileMime(fileName: string){
    let idx = fileName.lastIndexOf(".");
    let mime = mimeMap[fileName.substring(idx)];
    return mime ? mime : "application/octet-stream"
  }

  getFileNameFromPath(path: string): string {
    const ind = path.lastIndexOf('/') + 1
    return path.substring(ind)
  }

  protected randString(): string {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (var i = 17; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}

const toUtf8Bytes = (str: string) => {
  const bytes = [];
  for (var i = 0; i < str.length; i++) {
    bytes.push(...utf8CodeAt(str, i))

    const code = str.codePointAt(i) as number
    if (code > 0xffff) {
      i++;
    }
  }

  return bytes;
}

const utf8CodeAt = (str: string, i: number) => {
  var out = [], p = 0;
  var c = str.charCodeAt(i);
  if (c < 128) {
    out[p++] = c;
  } else if (c < 2048) {
    out[p++] = (c >> 6) | 192;
    out[p++] = (c & 63) | 128;
  } else if (
      ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
      ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
    // Surrogate Pair
    c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
    out[p++] = (c >> 18) | 240;
    out[p++] = ((c >> 12) & 63) | 128;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  } else {
    out[p++] = (c >> 12) | 224;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  }
  return out;
}
