import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

export function getStringInput(name: string, options?: core.InputOptions | undefined): string | undefined {
    let tmp: string = core.getInput(name, options);
    if (tmp.length > 0) {
        return tmp;
    } else {
        return undefined;
    }
}

export function getBooleanInput(name: string, options?: core.InputOptions | undefined): boolean {
    let tmp: string = core.getInput(name, options);
    if (tmp == 'true' || tmp == '1') {
        return true;
    } else if (tmp == 'false' || tmp == '0' || tmp == '') {
        return false;
    } else {
        throw new Error('Invalid value for input ' + name);
    }
}

export let packages: string[] | undefined;
export let requirements: string | undefined;
export let constraints: string | undefined;
export let no_deps: boolean = false;
export let pre: boolean = false;
export let editable: string | undefined;
export let platform: string | undefined;
export let upgrade: boolean = false;
export let extra: string | undefined;

export function processInputs() {
    let pkgTmp: string | undefined = getStringInput('packages');
    if (pkgTmp) {
        packages = pkgTmp.split(/\s+/);
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
    extra = getStringInput('extra');
}

export function getArgs(): string[] {
    let args: string[] = ['-m', 'pip', 'install'];

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

    if (extra) {
        args = args.concat(extra);
    }

    if (packages) {
        args = args.concat(packages);
    }

    return args;
}

export async function run() {
    try {
        let pythonPath: string | undefined = process.env.pythonLocation;
        if (!pythonPath) {
            throw new Error('Python is not found');
        }

        processInputs();
        let python: string = path.join(pythonPath, 'python');
        let args: string[] = getArgs();

        await exec.exec(python, args);
    } catch (err) {
        core.setFailed(err.message);
    }
}
