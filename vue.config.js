'use strict'
const glob = require('glob')
const path = require('path')
const pages = {}

glob.sync('./src/views/**/*.js').forEach(entry => {
    const basename = path.basename(entry, path.extname(entry))
    const pathname = path.dirname(entry).split('/').splice(3).join('/')
    const chunk = pathname ? pathname + '/' + basename : basename
    pages[chunk] = {
        entry: entry,
        filename: chunk + (process.env.NODE_ENV == 'production' ? '.html' : ''),
        template: 'public/index.html',
        chunks: ['chunk-vendors', 'chunk-common', chunk]
    }
})

module.exports = {
    pages,
    lintOnSave: true,

    devServer: {
        proxy: {
            '/': {
                ws: false,
                target: 'http://www.yourdomain.com',
                changeOrigin: true,
                cookieDomainRewrite: {
                    '*': '.yourdomain.com'
                },
                headers: {
                    domain: '.yourdomain.com',
                    Cookie: 'PHPSESSID=fdt3pss4sgis59msf10cvi7qic'
                },
                bypass: function (req) {
                    // POST or XMLHttpRequest request
                    return req.method !== 'POST' && req.headers['x-requested-with'] !== 'XMLHttpRequest'
                }
            }

        }
    }
}
