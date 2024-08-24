# Purpose
Crawl wordpress post and transpile to markdown for astro

# Setup
Node.js 20.13.1
NPM 10.8.2

```shell
npm install
```

## Config
Copy `config.example.cjs` as `config.cjs`

| Name | Description |
| --- | --- |
| dryRun | If true, will not save markdown and images. |
| astroLayoutPath | The path to layout file, relative to saved markdown file. It's optional, just leave it empty. |
| imageLocalDir | The place you wish to save images, relative to `main.cjs`. |
| markdownLocalDir | The place you wish to save markdown files, relative to `main.cjs`. |
| postList | A list of many wordpress post URL. |

# Execute
```shell
node main.cjs
```
It works on Node.js 20.13.1.