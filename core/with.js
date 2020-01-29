const { requireOrDefault } = require('../core/utils')

const withConfig = callback => (ctx, argv) => {
    if(ctx.config)
        return callback(ctx, argv)

    ctx.info(`Getting config on path '${ctx.configPath}'`)
    const cfg = requireOrDefault(`${ctx.configPath}`)

    if(!cfg || !cfg.shard)
        return ctx.error(`Config not found`)

    ctx.config = cfg
    ctx.config.shard.database = cfg.database

    return callback(ctx, argv)
}

const withData = callback => (ctx, argv) => {
    if(ctx.data)
        return callback(ctx, argv)

    ctx.info(`Performing data check on path '${ctx.dataPath}'`)
    const cards = requireOrDefault(`${ctx.dataPath}/cards`)
    const collections = requireOrDefault(`${ctx.dataPath}/collections`)

    if(!cards || !collections)
        return ctx.error(`Cards and collections are required to start a cluster.
            Please make sure you run [ayy update] first to get the data`)

    const items = requireOrDefault(`${ctx.dataPath}/items`, [])
    const help = requireOrDefault(`${ctx.dataPath}/help`, [])
    const achievements = requireOrDefault(`${ctx.dataPath}/achievements`, [])

    if(items.length === 0 || help.length === 0)
        return ctx.warn(`Some data appears to be empty. Some bot functions will be limited`)

    ctx.data = { cards, collections, items, achievements, help }

    return callback(ctx, argv)
}

module.exports = { withConfig, withData }