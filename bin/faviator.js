#!/usr/bin/env node
const fs = require('fs');
const { extname, resolve } = require('path');

let program = require('commander');

const pkg = require('../package.json');

const faviator = require('../index');

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-s, --size <n>', 'Width and height of the favicon')
  .option('-t, --text <value>', 'Text in the favicon')
  .option('--dx <n>', 'Move text horizontally')
  .option('--dy <n>', 'Move text vertically')
  .option('--font-size <n>', 'Font size of the text')
  .option('-f, --font-family <value>', 'Font family; please choose from Google Fonts')
  .option('--font-color <value>', 'Color name/hex/rgb')
  .option('-B, --background-color <value>', 'Background color of favicon')
  .option('--border-width <n>', 'Width of the border')
  .option('-b, --border-color <value>', 'Color of the border')
  .option('-R, --border-radius <n>', 'Short hand to set rx and ry')
  .option('--rx <n>', 'x-axis border radius')
  .option('--ry <n>', 'y-axis border radius')
  .option('-c, --config <path>', 'use a config file to draw')
  .option('-o, --output <path>', 'If not specified, svg will be printed to stdout. You can use .svg/.jpeg/.jpg/.png extensions.')
  .parse(process.argv);

async function main(options) {
  const { output } = options;

  if (!options.output) return console.log((await faviator.svg(options)).toString());

  const ext = extname(output);

  if (output && !['.svg', '.jpeg', '.jpg', '.png'].includes(ext)) {
    console.error('\n  error: <path> extension must be .svg/.jpeg/.jpg/.png in output\n');
    process.exit(1);
    return;
  }

  console.log(`Writting to ${output}...`);
  fs.writeFileSync(output, (await faviator[ext.substring(1)](options)));
}

if (process.argv.length <= 2) program.help();

if (program.config) {
  program = {
    ...program,
    ...require(resolve(process.cwd(), program.config)),
  };
}

main(program).catch(console.error);
