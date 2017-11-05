const emojis = require('./resource/emoji.json');

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions) => {
    const active = undefined !== pluginOptions
            && pluginOptions.hasOwnProperty('active')
            && false !== pluginOptions.active;

    if (!active) return Promise.resolve();

    const classAttribute = pluginOptions && pluginOptions.class
            ? `class="${pluginOptions.class}"`
            : null,
          styleAttribute = Object.keys(pluginOptions && pluginOptions.styles || {})
            .filter(key => '_PARENT' !== key)
            .map((key) => `${key}: ${pluginOptions.styles[key]}`)
            .join('; ');

    Object.keys(emojis).forEach((key) => {
      const emoji = emojis[key],
            pattern = new RegExp(emoji.pattern, 'g'),
            replacement = `<img ${classAttribute} data-icon="emoji-${key}" style="${styleAttribute}" src="data:image/png;base64, ${emojis[key][64]}" />`;

      markdownNode.internal.content = markdownNode.internal.content.replace(pattern, replacement);
    });

    return Promise.resolve();
  }
}
