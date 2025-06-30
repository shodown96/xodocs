/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ["main"],
  preset: "conventionalcommits",
  plugins: [
    "@semantic-release/commit-analyzer", // determines version bump
    "@semantic-release/release-notes-generator", // generates changelog
    "@semantic-release/changelog", // updates changelog.md
    "@semantic-release/npm", // runs npm publish
    "@semantic-release/git" // creates GitHub release

  ]
};
