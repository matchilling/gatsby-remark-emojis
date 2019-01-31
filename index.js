const source = (size) => require(`./resource/emoji.${size}.json`);

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions) => {
    const active = undefined !== pluginOptions
            && pluginOptions.hasOwnProperty('active')
            && false !== pluginOptions.active;

    if (!active) return Promise.resolve();

    const classAttribute = pluginOptions && pluginOptions.class
            ? `class="${pluginOptions.class}"`
            : null,
          size = pluginOptions && pluginOptions.size ? pluginOptions.size : 64,
          styleAttribute = Object.keys(pluginOptions && pluginOptions.styles || {})
            .filter(key => '_PARENT' !== key)
            .map((key) => `${key}: ${pluginOptions.styles[key]}`)
            .join('; '),
          emojis = source(size);

    Object.keys(emojis).forEach((key) => {
      const emoji = emojis[key],
            pattern = new RegExp(emoji.pattern, 'g'),
            replacement = (classAttribute ? `<img ${classAttribute} ` : '<img ') + `alt="emoji-${key}" data-icon="emoji-${key}" style="${styleAttribute}" src="data:image/png;base64, ${emojis[key].data}" title="emoji-${key}" />`;


      markdownNode.internal.content = markdownNode.internal.content.replace(
        pattern,
        replacement
      );
    });

    return Promise.resolve();
  }
}
