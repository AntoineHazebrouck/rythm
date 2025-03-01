import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './dist/main.js',
  output: {
    file: 'bundle.js'
  },
  plugins: [nodeResolve()]
};