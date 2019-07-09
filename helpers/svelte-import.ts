import ts from 'typescript';
import { join } from 'path';
const printer = ts.createPrinter();
export interface Options {
  libraryName: string;
  libraryDirectory: string;
}
export interface ImportedStruct {
  importName: string;
}
function getImportedStructs(node: ts.Node) {
  const structs = new Set<ImportedStruct>();
  node.forEachChild(importChild => {
    if (
      ts.isImportClause(importChild) &&
      importChild.namedBindings &&
      ts.isNamedImports(importChild.namedBindings)
    ) {
      importChild.namedBindings.forEachChild(namedBinding => {
        const importSpecifier = <ts.ImportSpecifier>namedBinding;
        structs.add({ importName: importSpecifier.name.text });
      });
    }
  });
  return structs;
}
function createDistAst(struct: ImportedStruct, options: Options) {
  const astNodes: ts.Node[] = [];

  const { libraryName, libraryDirectory } = options;
  const importPath = join(
    libraryName!,
    libraryDirectory,
    struct.importName.toLowerCase(),
  );
  const scriptNode = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(ts.createIdentifier(struct.importName), undefined),
    ts.createLiteral(importPath),
  );

  astNodes.push(scriptNode);
  const stylePath = `${importPath}/style/index`;
  const styleNode = ts.createImportDeclaration(
    undefined,
    undefined,
    undefined,
    ts.createLiteral(stylePath),
  );
  astNodes.push(styleNode);
  return astNodes;
}
function createTransformer(options: Options) {
  const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    const visitor: ts.Visitor = node => {
      if (ts.isSourceFile(node)) {
        return ts.visitEachChild(node, visitor, context);
      }
      if (!ts.isImportDeclaration(node)) {
        return node;
      }
      const importedLibName = (<ts.StringLiteral>node.moduleSpecifier).text;
      if (options.libraryName !== importedLibName) {
        return node;
      }
      const structs = getImportedStructs(node);
      if (structs.size === 0) {
        return node;
      }
      return Array.from(structs).reduce(
        (acc, struct) => {
          const nodes = createDistAst(struct, options);
          return acc.concat(nodes);
        },
        <ts.Node[]>[],
      );
    };
    return node => ts.visitNode(node, visitor);
  };
  return transformer;
}
function svelteImport(input) {
  const result = ts.transform(
    ts.createSourceFile(
      input.filename,
      input.content,
      ts.ScriptTarget.ES2016,
      true,
    ),
    [
      createTransformer({
        libraryName: 'ant-design-svelte',
        libraryDirectory: 'components',
      }),
    ],
  );
  const transformedSourceFile = result.transformed[0];
  const resultCode = printer.printFile(transformedSourceFile);
  return {
    code: resultCode,
  };
}

// svelteImport({
//   content: `import { Button } from 'ant-design-svelte'`,
//   filename: 'sss',
// });
// yarn ts-node -T scripts/svelte-import.ts

module.exports = svelteImport;
