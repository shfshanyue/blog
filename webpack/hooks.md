1. environment
1. afterEnvironment
1. entryOption
1. afterPlugins: 当内置 Plugin 设置完毕后调用
1. afterResolvers
1. initialize
1. beforeRun
1. run
1. watchRun
1. normalModuleFactory: 当一个 `NormalModuleFactory` 被创建时调用
1. contextModuleFactory
1. beforeCompile
1. compile
1. thisCompilation: 当初始化 `compilation` 时执行
1. compilation
1. make: 真正的构建过程
1. afterCompile
1. shouldEmit
1. emit: 将构建资源输出到目录中
1. afterEmit
1. assetEmitted
1. done
1. additionalPass
1. failed
1. invalid
1. watchClose
1. infrastructureLog
1. log

`Compilation`

1. buildModule: 当构建一个模块时
1. rebuildModule
1. failedModule
1. succeedModule: 当一个模块构建成功时
1. finishModules: 当所有模块都构建成功时
1. finishRebuildModule
1. seal
1. unseal
1. optimizeDependencies
1. afterOptimizeDependencies
1. optimize
1. optimizeModules
1. afterOptimizeModules
1. optimizeChunks
1. afterOptimizeChunks
1. optimizeTree
1. afterOptimizeTree
1. optimizeChunkModules
1. afterOptimizeChunkModules
1. optimizeChunkModules
1. afterOptimizeChunkModules
1. shouldRecord
1. reviveModules
1. beforeModuleIds
1. moduleIds: 当为每一个 module 生成 moduleId 时
1. optimizeModuleIds
1. afterOptimizeModuleIds
1. reviveChunks
1. beforeChunkIds
1. chunkIds: 当为每一个 chunk 生成 chunkId 时
1. optimizeChunkIds
1. afterOptimizeChunkIds
1. recordModules
1. recordChunks
1. beforeModuleHash
1. afterModuleHash: 当为每一个 module 生成 hash 时
1. beforeHash
1. afterHash
1. recordHash
1. record
1. beforeModuleAssets
1. additionalChunkAssets
1. shouldGenerateChunkAssets
1. beforeChunkAssets
1. additionalAssets
1. optimizeChunkAssets
1. afterOptimizeChunkAssets
1. optimizeAssets
1. afterOptimizeAssets
1. processAssets
1. afterProcessAssets
1. needAdditionalSeal
1. afterSeal
1. chunkHash: 为每一个 chunk 添加 hash
1. moduleAsset
1. chunkAsset
1. assetPath
1. needAdditionalPass
1. childCompiler
1. normalModuleLoader