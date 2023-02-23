const { execSync } = require("child_process");

const repo = process.argv[2];

if (!repo) {
  console.log("Repository not provided. Exiting.");
  process.exit(1);
}

const origin = `origin-${repo}`;
const branch = `merge-${repo}`;
const address = `git@github.com:ordo-pink/${repo}.git`;

console.log(`Migrate script started for "${repo}"`);

execSync(`git remote add ${origin} ${address}`);
execSync(`git fetch ${origin}`);
execSync(`git checkout -b ${branch} ${origin}/main`);
execSync("rm -rf node_modules");
execSync(`mkdir ${repo}`);
execSync(`mv * ${repo}`);
execSync("rm -rf node_modules");
console.log(`npm i && git merge ${branch} --allow-unrelated-histories`);
execSync(`git commit -m ":truck: Move in ${repo}"`);
console.log(`rm -rf ${repo} && git add . && git commit`);
console.log(
  `git branch -D ${branch} && git remote remove ${origin} && git push origin merge-repos`
);
