# Gatsby Remark Emojis [![CircleCI](https://circleci.com/gh/matchilling/gatsby-remark-emojis.svg?style=svg)](https://circleci.com/gh/matchilling/gatsby-remark-emojis)

Processes emoji in markdown and inlines `<img>` tags with the corresponding base64 corresponding of the image.

See all available [emoji](https://github.com/matchilling/gatsby-remark-emojis/blob/master/emoji.md)

## Install

`npm install --save gatsby-remark-emojis`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      // In your gatsby-transformer-remark plugin array
      plugins: [{
        resolve: 'gatsby-remark-emojis',
        options: {
          // Deactivate the plugin globally (default: true)
          active : true,
          // Require blank space on both sides of emoji (default false)
          requireWhiteSpace: false,
          // Add a custom css class
          class  : 'emoji-icon',
          // In order to avoid pattern mismatch you can specify
          // an escape character which will be prepended to the
          // actual pattern (e.g. `#:poop:`).
          escapeCharacter : '#', // (default: '')
          // Select the size (available size: 16, 24, 32, 64)
          size   : 64,
          // Add custom styles
          styles : {
            display      : 'inline',
            margin       : '0',
            'margin-top' : '1px',
            position     : 'relative',
            top          : '5px',
            width        : '25px'
          }
        }
      }]
    }
  }
]
```

## License

This distribution is covered by the **GNU GENERAL PUBLIC LICENSE**, Version 3, 29 June 2007.

## Support & Contact

Having trouble with this repository? Check out the documentation at the [repository's site](https://github.com/matchilling/gatsby-remark-emojis) or contact [m@matchilling.com](https://www.matchilling.com/) and we’ll help you sort it out.

Happy Coding

:v:
