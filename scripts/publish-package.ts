import { ensureFile, existsSync, readJson, writeFile } from 'fs-extra';
import { join } from 'path';
import semver from 'semver';

import { getDistTags } from './utils/npm';
import { runCommand } from './utils/spawn';

const CWD = process.cwd();

async function createNpmrcFile(
  distRoot: string,
  npmToken: string
): Promise<void> {
  const npmFilePath = join(distRoot, '.npmrc');

  await ensureFile(npmFilePath);
  await writeFile(npmFilePath, `//registry.npmjs.org/:_authToken=${npmToken}`);
}

export async function publishPackagesDist() {
  const npmToken: string = process.env.NPM_TOKEN!;

  if (!npmToken) {
    throw new Error(
      'Environment variable "NPM_TOKEN" not set! Abort publishing to NPM.'
    );
  }

  const version = (await readJson(join(CWD, 'package.json'))).version;

  const distTags = await getDistTags('@skyux/docs-tools');

  const semverData = semver.parse(version);
  const isPrerelease = semverData ? semverData.prerelease.length > 0 : false;
  const majorVersion = semverData!.major;

  let npmPublishTag = `lts-v${majorVersion}`;
  if (isPrerelease) {
    if (semver.gt(version, distTags.next)) {
      npmPublishTag = 'next';
    } else {
      npmPublishTag += '-next';
    }
  } else {
    if (semver.gt(version, distTags.latest)) {
      npmPublishTag = 'latest';
    }
  }

  const commandArgs = ['publish', '--access', 'public', '--tag', npmPublishTag];

  console.log(`
==============================================================
> Run: npm ${commandArgs.join(' ')}
==============================================================
`);

  const distRoot = join(CWD, '/dist');

  if (!existsSync(distRoot)) {
    throw new Error(
      `Path '${distRoot}' does not exist. Did you run 'npm run build' and 'npm run postbuild'?`
    );
  }

  await createNpmrcFile(distRoot, npmToken);

  await runCommand('npm', commandArgs, {
    cwd: distRoot,
    stdio: 'inherit',
  });
}
