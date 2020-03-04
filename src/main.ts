import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

function getStringInput(name: string, options?: core.InputOptions | undefined): string | undefined {
    let tmp: string = core.getInput(name, options);
    if (tmp.length > 0) {
        return tmp;
    } else {
        return undefined;
    }
}

function getBooleanInput(name: string, options?: core.InputOptions | undefined): boolean {
    let tmp: string = core.getInput(name, options);
    if (tmp == 'true' || tmp == '1') {
        return true;
    } else if (tmp == 'false' || tmp == '0') {
        return false;
    } else {
        throw new Error('Invalid value for input ' + name);
    }
}

let packages: string[] | undefined;
let requirements: string | undefined;
let constraints: string | undefined;
let no_deps: boolean = false;
let pre: boolean = false;
let editable: string | undefined;
let platform: string | undefined;
let upgrade: boolean = false;

function processInputs() {
    let pkgTmp: string | undefined = getStringInput('packages');
    if (pkgTmp) {
        packages = pkgTmp.split(/\n/);
    } else {
        packages = undefined;
    }

    requirements = getStringInput('requirements');

    if (!packages && !requirements) {
        throw new Error('You must specify either packages or a requirements file');
    }

    constraints = getStringInput('constraints');
    no_deps = getBooleanInput('no-deps');
    pre = getBooleanInput('pre');
    editable = getStringInput('editable');
    platform = getStringInput('platform');
    upgrade = getBooleanInput('upgrade');
}

function getArgs(): string[] {
    let args: string[] = ['-m', 'pip', 'install'];

    if (packages) {
        args = args.concat(packages);
    }

    if (requirements) {
        args = args.concat('--requirement', requirements);
    }

    if (constraints) {
        args = args.concat('--constraint', constraints);
    }

    if (no_deps) {
        args = args.concat('--no-deps');
    }

    if (pre) {
        args = args.concat('--pre');
    }

    if (editable) {
        args = args.concat('--editable', editable);
    }

    if (platform) {
        args = args.concat('--platform', platform);
    }

    if (upgrade) {
        args = args.concat('--upgrade');
    }

    return args;
}

async function run() {
    try {
        let pythonPath: string | undefined = process.env.pythonLocation;
        let python: string = '';
        if (pythonPath !== undefined) {
            python = path.join(pythonPath, 'python');
        } else {
            core.setFailed('Python is not found');
            return;
        }

        processInputs();

        let args: string[] = getArgs();

        await exec.exec(python, args);
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();
