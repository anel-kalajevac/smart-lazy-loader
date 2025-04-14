/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist/*.js', label: 'JS distribution' },
          { path: 'dist/types/**/*.d.ts', label: 'Types distribution' },
        ],
      },
    ],
    '@semantic-release/git',
  ],
};
