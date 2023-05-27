'use strict'
const promisify_js_1 = require('./promisify.js')
const src_1 = require('./src')
const cvloader_js_1 = require('./cvloader.js')
function loadOpenCV(opt) {
  const cvBase = (0, cvloader_js_1.getOpenCV)(opt)
  if (!cvBase.accumulate) {
    throw Error('failed to load opencv basic accumulate not found.')
  }
  if (!cvBase.blur) {
    throw Error('failed to load opencv basic blur not found.')
  }
  // promisify async methods
  let cv = (0, promisify_js_1.default)(cvBase)
  cv = (0, src_1.default)(cv)
  // add xmodules alias if not present (moved to C++ part)
  // if (!cvObj.xmodules && cvObj.modules)
  //  cvObj.xmodules = cvObj.modules
  const defExport = { cv: cv }
  // duplicate all export for retro-compatibility
  for (const key in cv) {
    defExport[key] = cv[key]
  }
  defExport['cv'] = cv
  return defExport
}
// const cv = loadOpenCV({ prebuild: 'latestBuild' })
module.exports = () => loadOpenCV({ prebuild: 'latestBuild' })