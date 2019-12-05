const source = (size) => require(`./resource/emoji.${size}.json`);

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions = {}) => {
    const active = !!pluginOptions.active;

    if (!active) return Promise.resolve();

    const classAttribute = pluginOptions.class
            ? ` class="${pluginOptions.class}" `
            : "",
          size = pluginOptions.size || 64,
          styleAttribute = Object.keys(pluginOptions.styles || {})
            .filter(key => '_PARENT' !== key)
            .map((key) => `${key}: ${pluginOptions.styles[key]}`)
            .join('; '),
          emojis = source(size);

    Object.keys(emojis).forEach((key) => {
      const emoji = emojis[key],
            pattern = pluginOptions.requireWhiteSpace ? new RegExp(`(?<=[\\s\\n])${emoji.pattern}(?:[\\s\\n])`, 'g') : new RegExp(emoji.pattern, 'g'),
            replacement = `<img${classAttribute} alt="emoji-${key}" data-icon="emoji-${key}" style="${styleAttribute}" src="data:image/png;base64, ${emojis[key].data}" title="emoji-${key}" />`;

      markdownNode.internal.content = markdownNode.internal.content.replace(
        pattern,
        replacement
      );
    });

    return Promise.resolve();
  }
}
