type Loggable = string | number | boolean | object | null | undefined | symbol;

const info = (...params: Loggable[]) => {
  if (process.env.NODE_ENV !== "test") console.log(...params);
};

const error = (...params: Loggable[]) => {
  if (process.env.NODE_ENV !== "test") console.error(...params);
};

export default { info, error };
