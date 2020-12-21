module.exports = {
  StringNotNull(value, name) {
    if (typeof value !== 'string' || value === 0)
      throw new Error(`You need to fill the field ${name}!`);
  },

  StringMinSize(value, name, minimum) {
    if (value.length < minimum)
      throw new Error(
        `The field ${name} must have at least ${minimum} characters!`
      );
  },

  StringMaxSize(value, name, maximum) {
    if (value.length > maximum)
      throw new Error(
        `The field ${name} must have at most ${maximum} characters!`
      );
  },
};
