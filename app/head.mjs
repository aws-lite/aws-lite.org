import { getStyles }  from '@enhance/arc-plugin-styles'

const { linkTag } = getStyles

export default function Head () {
  return /* html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>aws-lite</title>
      ${linkTag()}
      <!-- <link rel="icon" href="/_public/favicon.svg"> -->
      <meta name="description" content="">
    </head>
`
}
