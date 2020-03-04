// import * as core from '@actions/core';
var core = require('@actions/core');
// import * as path from 'path';
var path = require('path');
// import * as exec from 'child_process';
var exec = require('child_process').exec;

async function run() {
  try {
    let version = core.getInput('pip-version');
    var command;
    if (version) {
      if (version.startsWith('2')) {
          command = 'python2 -m pip';
      } else if (version.startsWith('3')) {
          command = 'python3 -m pip';
      } else {
          core.setFailed('Unknown python version ' + version);
      }
    }

    let packages = core.getInput('packages');
    var child = exec.exec(`${command} ${packages}`,
        function(error, stdout, stderr) {
            if (error !== null) {
                console.log(stdout);
                console.log(stderr);
                core.setFailed(error);
            }
        });
    child();

    // const matchersPath = path.join(__dirname, '..', '.github');
    // console.log(`##[add-matcher]${path.join(matchersPath, 'python.json')}`);
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
