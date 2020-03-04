import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

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

        let packages: string = core.getInput('packages');
        let args: string[] = ['-m', 'pip', 'install', packages];
        console.log(`Running: ${python} ${args.toString()}`);
        
        let stdout: string = '';
        let stderr: string = '';

        const options = {
            listeners: {
                stdout: (data: Buffer) => {
                    stdout += data.toString();
                },
                stderr: (data: Buffer) => {
                    stderr += data.toString();
                }
            }
        };

        core.info(stdout);
        if (stderr.length > 0)
            core.setFailed(stderr);

        await exec.exec(python, args, options);
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();
