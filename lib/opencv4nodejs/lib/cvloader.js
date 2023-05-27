'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getOpenCV = void 0

const path = require('path')
const commons_js_1 = require('./commons.js')



function getOpenCV(opt) {
   let opencvBuild = require('../build/Release/opencv4nodejs')
  // resolve haarcascade files
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { haarCascades, lbpCascades } = opencvBuild
  Object.keys(haarCascades).forEach(
    (key) =>
      (opencvBuild[key] = (0, commons_js_1.resolvePath)(
        path.join(__dirname, 'haarcascades'),
        haarCascades[key]
      ))
  )
  Object.keys(lbpCascades).forEach(
    (key) =>
      (opencvBuild[key] = (0, commons_js_1.resolvePath)(
        path.join(__dirname, 'lbpcascades'),
        lbpCascades[key]
      ))
  )
  return opencvBuild
}
exports.getOpenCV = getOpenCV
exports.default = getOpenCV
