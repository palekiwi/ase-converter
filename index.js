'use strict'

const aseUtils = require('ase-utils')
const R = require('ramda')
const fs = require('fs')
const path = require('path')

const OUTPUT_DIR = '/home/pawel/Pictures/Resources/swatches'

const filePath = path.resolve(process.argv[2])
const data = fs.readFileSync(filePath).toString()
const outputName = generateOutputName(filePath)

const saveFile = fs.writeFileSync.bind(null, path.join(OUTPUT_DIR, outputName))
const formatColor = formatColorAs.bind(null, outputName)

const encode = R.compose(
  saveFile,
  aseUtils.encode,
  formatSwatch,
  R.addIndex(R.map)(formatColor),
  R.map(toRGB),
  extractColorValues
)

encode(data)

// returns array
function extractColorValues (file) {
  return file.match(/rgb.+/g)
    .map(s => s.match(/\d+/g))
    .map(a => a.slice(0,3))
}


function toRGB (array) {
  return array.map(i => i / 255)
}

function formatColorAs (name, data, idx) {
  return {name: name + '_' + idx, model: 'RGB', color: data, type: 'global'}
}

function formatSwatch (data) {
  return {
    groups: [],
    colors: data,
    version: '1.0'
  }
}

function generateOutputName (filePath) {
  const nameIdx = process.argv.indexOf('-n')
  const outputName = (nameIdx != -1) ? process.argv[nameIdx + 1] : path.basename(filePath).replace(/\.[^/.]+$/, '') + '.ase'

  return outputName
}
