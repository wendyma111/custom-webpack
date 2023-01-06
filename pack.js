const path = require('path')
const fs = require('fs')
// code解析为ast
const { parse } = require('@babel/parser')
// 编译ast节点
const traverse = require('@babel/traverse').default
// 将ast转化为节点
const { transformFromAst } = require('@babel/core')

/**
 * 1、解析入口文件路径
 * 2、从入口文件开始递归解析模块依赖
 * 3、得到模块依赖关系图
 * 4、生成代码
 *  4-1、将模块内容通过函数包装，require、exports作为参数传入
 *  4-2、重写require、exports
 *  4-3、执行主入口文件内容
 */
class Compiler {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = path.resolve(output.path, output.filename)
    this.module = {}
  }

  /**
   * 递归查找模块依赖 & 解析模块内容
   */
  parseDep(ast, filePath) {
    const dirname = path.dirname(filePath)
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        const moduleName = node.source.value
        const modulePath = path.resolve(dirname, moduleName)
        const moduleContent = fs.readFileSync(modulePath, 'utf-8')
        const ast = parse(moduleContent, {
          sourceType: 'module'
        })
        // ast转化为代码
        const { code } = transformFromAst(ast, null, {
          presets: ['@babel/preset-env']
        })
        this.module[moduleName] = code

        // 递归解析模块依赖
        this.parseDep(ast, modulePath)
      }
    })
  }

  /**
   * 启动主入口
   * 从entry开始递归解析模块依赖
   * 生成打包后代码
   */
  run() {
    const entryContent = fs.readFileSync(this.entry, 'utf-8')
    const ast = parse(entryContent, {
      sourceType: 'module'
    })

    this.parseDep(ast, this.entry)
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    this.module[this.entry] = code

    this.generate()
  }

  /**
   * 生成代码
   * 1、重写require方法
   * 2、重写exports对下岗
   */
  generate() {
    const code = `const __custompack_module__ = {
  ${Object.keys(this.module).map(moduleName => `"${moduleName}": function(require, exports) {
    eval(\`${this.module[moduleName]}\`)
  }`).join(',')}
}

const __custompack_exports_cache__ = {}

function __custompack_require__(moduleName) {
  if (__custompack_exports_cache__[moduleName]) {
    return __custompack_exports_cache__[moduleName]
  }

  __custompack_exports_cache__[moduleName] = {
    exports: {}
  }

  const moduleContent = __custompack_module__[moduleName]
  moduleContent(__custompack_require__, __custompack_exports_cache__[moduleName].exports)

  return __custompack_exports_cache__[moduleName].exports
}

__custompack_require__('${this.entry}')
    `

    if (!fs.existsSync(path.dirname(this.output))) {
      fs.mkdirSync(path.dirname(this.output))
      fs.writeFileSync(this.output, code, 'utf-8')
    } else {
      fs.writeFileSync(this.output, code, 'utf-8')
    }
  }
}

module.exports = Compiler