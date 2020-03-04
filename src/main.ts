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
        let args: string[] = ['-m', 'pip', 'install'].concat(packages.split(' '));
        console.log(`Running: ${python} ${args.join(' ')}`);
        
        let success: boolean = true;

        const options = {
            listeners: {
                stdout: (data: Buffer) => {
                    console.info(data.toString());
                },
                stderr: (data: Buffer) => {
                    console.error(data.toString());
                    success = false;
                }
            }
        };

        if (!success)
            core.setFailed('Package installation failed');

        await exec.exec(python, args, options);
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();
