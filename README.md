# SwagSticker.com Assets

- Live site: https://swagsticker.com

## Adding a Product

0. (optional) drag n drop `svgs/slug.svg`
1. drag n drop `pngs/slug.png`
   ~~2. run workflow to generate `thumbnails/slug.jpg` (it will auto-commit)~~
2. generate a thumbnail.jpg locally with [this docker app](https://github.com/spencerlepine/svg-to-sticker-png-app-python) (then upload:`thumbnails/slug.jpg`)
3. Verify upload workflow triggered (to add thumbnail to CDN)
4. Update `catalog.json` [[here](https://github.com/spencerlepine/swagsticker.com-prod/blob/main/src/catalog.json)]

## TODO

Replace [SVGtoStickerPNG Generator](https://github.com/spencerlepine/svg-to-sticker-png-app-python) with GitHub Actions workflow (run the python in github actions in `.github/workflows/generate-thumbnail.yml`)
