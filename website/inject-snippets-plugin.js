/* eslint-disable compat/compat */
const path = require('path');
const globby = require('globby');
const fs = require('fs');
const ts = require('typescript');
const prettier = require('prettier');

async function clearSnippetsPath(snippetsPath) {
  const currentFiles = await globby([snippetsPath]);
  return Promise.all(currentFiles.map((f) => fs.promises.unlink(f)));
}

function prettifyTranspiledSources(sources, prettierOptions) {
  return Promise.all(
    sources.map(async (s) => {
      const content = await fs.promises.readFile(s);
      return fs.promises.writeFile(
        s,
        prettier.format(content.toString(), { filepath: s, ...prettierOptions })
      );
    })
  );
}

async function transpileTypescriptSources(sources, snippetsPath) {
  let program = ts.createProgram(sources, {
    outDir: snippetsPath,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.Latest,
    declaration: false,
    removeComments: false
  });
  program.emit();
  return await globby(snippetsPath);
}

function copySourcesFiles(sources, snippetsPath) {
  return Promise.all(
    sources.map(async (s) => {
      const dest = path.resolve(snippetsPath, path.basename(s));
      await fs.promises.copyFile(s, dest);
    })
  );
}

module.exports = function (context, options) {
  const { siteDir } = context;
  const snippetsPath = path.resolve(siteDir, options.snippetsPath);
  return {
    name: 'inject-snippets-plugin',
    async loadContent() {
      await clearSnippetsPath(snippetsPath);
      const tsxSources = await globby(options.includes);
      const transpiledFiles = await transpileTypescriptSources(
        tsxSources,
        snippetsPath
      );
      await prettifyTranspiledSources(transpiledFiles, options.prettierOptions);
      // await transpileWithBabel(tsxSources, snippetsPath);
      await copySourcesFiles(tsxSources, snippetsPath);
      console.info(
        'inject-snippets-plugin:',
        'sources copied and transpiles:',
        tsxSources
      );
    }
  };
};
