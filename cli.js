#!/usr/bin/env node

const core = require('./core')
const readline = require('readline')

const main = async () => {
    var keepalive = false

    var ctx = {
        info: (msg, shard) => console.log(`[INFO${shard? ` SH${shard}`:''}] ${msg}`),
        warn: (msg, shard) => console.warn(`[WARN${shard? ` SH${shard}`:''}] ${msg}`),
        error: (err, shard) => { 
            console.error(`[ERR${shard? ` SH${shard}`:''}]`, err)
            if(!shard && !keepalive) process.exit(1)
        }
    }

    console.log(`AyanoCLI v0.1.0`)
    ctx = await core(ctx, process.argv.slice(2))

    if(res.keepalive) {
        keepalive = true
        const rl = readline.createInterface(process.stdin, process.stdout)
        rl.setPrompt('ayy> ')
        rl.prompt()

        rl.on('line', async line => {
            if (line === "quit" || line === "q") 
                rl.close()

            ctx = await core(ctx, line.split(' '))
            rl.prompt()

        }).on('close', async () => {
            if(ctx.bot){
                console.log('Waiting for AyanoBOT to disconnect')
                await ctx.bot.disconnect()
            }

            console.log('Bye')
            process.exit(0)
        })

    } else process.exit(0)
}


main().catch(console.error)
