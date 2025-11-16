import next from "eslint-config-next";

const config = [
  {
    ignores: ["node_modules"],
  },
  ...next,
];

export default config;
