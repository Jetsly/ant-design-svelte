const babel = require('@babel/core');
const libraryName = 'ant-design-svelte';
const pluginStateKey = `importPluginState$`;
function svelteImport(input) {
  const data = babel.transform(input.content, {
    plugins: [
      ({ types }) => {
        function getPluginState(state) {
          if (!state[pluginStateKey]) {
            state[pluginStateKey] = {};
          }
          return state[pluginStateKey];
        }
        return {
          visitor: {
            Program: {
              enter(path, state) {
                const pluginState = getPluginState(state);
                pluginState.specified = Object.create(null);
                pluginState.libraryObjs = Object.create(null);
                pluginState.selectedMethods = Object.create(null);
                pluginState.pathsToRemove = [];
              },
              exit(path, state) {
                const pluginState = getPluginState(state);
                pluginState.pathsToRemove.forEach(
                  p => !p.removed && p.remove(),
                );
                Object.keys(pluginState.specified).forEach(name => {
                  const imported = pluginState.specified[name];
                  path.node.body.unshift(
                    types.importDeclaration(
                      [],
                      types.stringLiteral(
                        `${libraryName}/${imported.toLowerCase()}/style/index.js`,
                      ),
                    ),
                    types.importDeclaration(
                      [types.importDefaultSpecifier(types.identifier(name))],
                      types.stringLiteral(
                        `${libraryName}/${imported.toLowerCase()}/index.ts`,
                      ),
                    ),
                  );
                });
              },
            },
            ImportDeclaration(path, state) {
              const { node } = path;
              if (!node) return;
              const { value } = node.source;
              const pluginState = getPluginState(state);
              if (value === libraryName) {
                node.specifiers.map(spec => {
                  if (types.isImportSpecifier(spec)) {
                    pluginState.specified[spec.local.name] = spec.imported.name;
                  } else {
                    pluginState.libraryObjs[spec.local.name] = true;
                  }
                });
                pluginState.pathsToRemove.push(path);
              }
            },
          },
        };
      },
    ],
  });
  return {
    code: data.code,
  };
}

// svelteImport({
//   content:
//     '\nimport Demo from ' +
//     '"@/site/theme/template/Content/Demo.svelte";\n\nimport { ' +
//     "Button } from 'ant-design-svelte';",
// });

module.exports = svelteImport;
