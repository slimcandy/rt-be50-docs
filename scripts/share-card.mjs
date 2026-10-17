// Rebuilds public/share-card.jpg (1200×630) and public/apple-touch-icon.png
// (180×180) from the built site. Run `npm run build` first, then `npm run card`,
// then build again so the new files end up in out/.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const out = fileURLToPath(new URL('../out/', import.meta.url))
const pub = fileURLToPath(new URL('../public/', import.meta.url))
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.txt': 'text/plain' }

const server = createServer(async (req, res) => {
  let path = normalize(new URL(req.url, 'http://x').pathname).replace(/^(\.\.[/\\])+/, '')
  let candidates = [path, `${path}.html`, join(path, 'index.html')]
  for (let candidate of candidates) {
    try {
      let file = join(out, candidate)
      let body = await readFile(file)
      res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream')
      return res.end(body)
    } catch {}
  }
  res.statusCode = 404
  res.end()
}).listen(0)
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch()

// Card: the real page, so it can be remade whenever the design changes.
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: 'light' })
await page.goto(`${base}/wireless/general`, { waitUntil: 'networkidle' })
await page.screenshot({ path: join(pub, 'share-card.jpg'), type: 'jpeg', quality: 88 })

// Icon: the model name in the router's banner style, over its selected-menu blue.
const icon = await browser.newPage({ viewport: { width: 180, height: 180 } })
await icon.setContent(`<body style="margin:0;width:180px;height:180px;display:grid;grid-template-rows:1fr 54px;background:linear-gradient(#2b3a3f,#101819 60%,#0a0f10);color:#fff;font-family:Arial,Helvetica,sans-serif">
  <div style="display:grid;place-items:center;font:italic 700 50px/1 Arial,Helvetica,sans-serif;letter-spacing:.04em;color:#cfd8dc;text-shadow:2px 2px 0 #000">BE50</div>
  <div style="display:grid;place-items:center;background:linear-gradient(#8aa6be 0%,#668cad 44%,#4a779d 45%,#3a6894 46%,#376c9b 100%);font:700 17px/1 Verdana,sans-serif;text-shadow:1px 1px 0 #000">справочник</div></body>`)
await icon.screenshot({ path: join(pub, 'apple-touch-icon.png'), type: 'png' })

await browser.close()
server.close()
console.log('wrote public/share-card.jpg and public/apple-touch-icon.png')
