import * as core from '@actions/core';
import exec from 'child_process';

async function run() {
  try {
    let version: string = core.getInput('pip-version');
    var command: string = "";
    if (version) {
      if (version.startsWith('2')) {
          command = 'python2 -m pip';
      } else if (version.startsWith('3')) {
          command = 'python3 -m pip';
      } else {
          core.setFailed('Unknown python version ' + version);
          return;
      }
    }

    let packages: string = core.getInput('packages');
    let cmd: string = `${command} install ${packages}`;
    console.log(`Running: ${cmd}`);

    exec.exec(cmd,
        function(error, stdout, stderr) {
            if (error !== null) {
                console.log(stdout);
                console.log(stderr);
                core.setFailed(error.message);
            }
        });
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
