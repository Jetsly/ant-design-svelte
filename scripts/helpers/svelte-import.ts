import ts from 'typescript';
import { join } from 'path';
const libraryName = 'ant-design-svelte';
const printer = ts.createPrinter();
export interface Options {
  libraryDirectory: string;
  style?: 'css' | boolean;
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

  const { libraryDirectory, style } = options;
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
  if (style) {
    const stylePath =
      style === 'css'
        ? `${importPath}/style/index.css`
        : `${importPath}/style/index`;
    const styleNode = ts.createImportDeclaration(
      undefined,
      undefined,
      undefined,
      ts.createLiteral(stylePath),
    );
    astNodes.push(styleNode);
  }
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
      if (libraryName !== importedLibName) {
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

const svelteImport = (options: Options) => input => {
  const result = ts.transform(
    ts.createSourceFile(
      input.filename,
      input.content,
      ts.ScriptTarget.ES2016,
      true,
    ),
    [createTransformer(options)],
  );
  const transformedSourceFile = result.transformed[0];
  const resultCode = printer.printFile(transformedSourceFile);
  return {
    code: resultCode,
  };
};

// svelteImport({
//   libraryDirectory: 'components',
//   style: true,
// })({
//   content: `import { Button } from 'ant-design-svelte'`,
//   filename: 'sss',
// });
// yarn ts-node -T scripts/helpers/svelte-import.ts

module.exports = svelteImport;
