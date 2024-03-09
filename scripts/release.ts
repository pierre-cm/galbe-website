import pkg from '../package.json';
import { $ } from 'bun';
import yargs from 'yargs';

const SEMVER_RGX = /^(\d+)\.(\d+)\.(\d+)(?:-([(a-zA-Z0-9\.\-)*]))?(?:\+([a-zA-Z0-9\.-]*))?$/;

const args = (yargs(Bun.argv) as any).argv;
const scope = args._[2];
const build = args.build;
const preRelease = args.pre;
const commit = args.commit;

if (scope && !['patch', 'minor', 'major'].includes(scope)) {
	console.error('Invalid scope (major|minor|patch)');
	process.exit(1);
}

const semverRgx = [...(pkg.version.match(SEMVER_RGX) || [])];
const semver = {
	major: Number(semverRgx[1]),
	minor: Number(semverRgx[2]),
	patch: Number(semverRgx[3]),
	preRelease: semverRgx[4],
	build: semverRgx[5]
};

let v = { ...semver, preRelease, build };

if (scope === 'major') v = { ...v, major: v.major + 1, minor: 0, patch: 0 };
if (scope === 'minor') v = { ...v, minor: v.minor + 1, patch: 0 };
if (scope === 'patch') v = { ...v, patch: v.patch + 1 };

const vStr = `${v.major}.${v.minor}.${v.patch}${v.preRelease ? `-${v.preRelease}` : ''}${v.build ? `+${v.build}` : ''}`;
console.log(`${pkg.version} -> ${vStr}`);

if (commit) {
	let message = vStr;
	if (typeof commit === 'string') message = commit.replace('%v', vStr);
	pkg.version = vStr;
	Bun.write('./package.json', JSON.stringify(pkg, null, 2));
	await $`git add package.json && git commit -m "${vStr}"`;
}
