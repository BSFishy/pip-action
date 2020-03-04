import * as core from '@actions/core';
import fs = require('fs');
import os = require('os');
import path = require('path');

import main = require('../src/main');

let inSpy: jest.SpyInstance;

function createInputFn(key: string, value: string): (name: string) => string {
    function inputFn(name: string): string {
        return name == key ? value : '';
    }

    if (key == 'packages' || key == 'requirements') {
        return inputFn;
    } else {
        return (name: string) => name == 'packages' ? 'value' : inputFn(name);
    }
}

function createArgFn<T extends string | boolean | undefined>(key: string, value: string, expected: T, ret: () => T): jest.ProvidesCallback {
    return async () => {
        inSpy.mockImplementation(createInputFn(key, value));

        expect(() => main.processInputs()).not.toThrow();
        expect(ret()).toEqual(expected);
    };
}

describe('pip-action', () => {
    beforeEach(() => {
        inSpy = jest.spyOn(core, 'getInput');

        main.packages = undefined;
        main.requirements = undefined;
        main.constraints = undefined;
        main.no_deps = false;
        main.pre = false;
        main.editable = undefined;
        main.platform = undefined;
        main.upgrade = false;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('checks empty input string', async () => {
        inSpy.mockImplementation(() => '');

        expect(main.getStringInput('')).toBeUndefined();
    });

    it('checks input string', async() => {
        inSpy.mockImplementation(() => 'value');

        expect(main.getStringInput('')).toBe('value');
    });

    it('checks false input boolean', async () => {
        inSpy.mockImplementation(() => 'false');

        expect(main.getBooleanInput('')).toBeFalsy();
    });

    it('checks 0 input boolean', async () => {
        inSpy.mockImplementation(() => '0');

        expect(main.getBooleanInput('')).toBeFalsy();
    });

    it('checks empty input boolean', async () => {
        inSpy.mockImplementation(() => '');

        expect(main.getBooleanInput('')).toBeFalsy();
    });

    it('checks false input boolean', async () => {
        inSpy.mockImplementation(() => 'true');

        expect(main.getBooleanInput('')).toBeTruthy();
    });

    it('checks 0 input boolean', async () => {
        inSpy.mockImplementation(() => 'true');

        expect(main.getBooleanInput('')).toBeTruthy();
    });

    it('checks error input boolean', async () => {
        inSpy.mockImplementation(() => 'error');

        expect(() => main.getBooleanInput('')).toThrow();
    });


    it('checks no arguments', async () => {
        inSpy.mockImplementation(createInputFn('packages', ''));

        expect(() => main.processInputs()).toThrow();
    });


    it('checks single package', async () => {
        inSpy.mockImplementation(createInputFn('packages', 'value'));

        expect(() => main.processInputs()).not.toThrow();
        expect(main.packages).toEqual(['value']);
    });

    it('checks multiple packages', async () => {
        inSpy.mockImplementation(createInputFn('packages', 'value1\n  value2'));

        expect(() => main.processInputs()).not.toThrow();
        expect(main.packages).toEqual(['value1', 'value2']);
    });


    it('checks requirements', async () => {
        inSpy.mockImplementation(createInputFn('requirements', 'value'));

        expect(() => main.processInputs()).not.toThrow();
        expect(main.requirements).toEqual('value');
    });


    it('checks empty constraints', createArgFn('constraints', '', undefined, () => main.constraints));

    it('checks constraints', createArgFn('constraints', 'value', 'value', () => main.constraints));


    it('checks true no-deps', createArgFn('no-deps', 'true', true, () => main.no_deps));

    it('checks false no-deps', createArgFn('no-deps', 'false', false, () => main.no_deps));


    it('checks true pre', createArgFn('pre', 'true', true, () => main.pre));

    it('checks false pre', createArgFn('pre', 'false', false, () => main.pre));


    it('checks empty editable', createArgFn('editable', '', undefined, () => main.editable));

    it('checks editable', createArgFn('editable', 'value', 'value', () => main.editable));


    it('checks empty platform', createArgFn('platform', '', undefined, () => main.platform));

    it('checks platform', createArgFn('platform', 'value', 'value', () => main.platform));


    it('checks true upgrade', createArgFn('upgrade', 'true', true, () => main.upgrade));

    it('checks false upgrade', createArgFn('upgrade', 'false', false, () => main.upgrade));



    it('checks args', async () => {
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install']);
    });

    it('checks packages args', async () => {
        main.packages = ['value'];
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', 'value']);
    });

    it('checks requirements args', async () => {
        main.requirements = 'value';
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--requirement', 'value']);
    });

    it('checks constraints args', async () => {
        main.constraints = 'value';
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--constraint', 'value']);
    });

    it('checks no-deps args', async () => {
        main.no_deps = true;
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--no-deps']);
    });

    it('checks pre args', async () => {
        main.pre = true;
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--pre']);
    });

    it('checks editable args', async () => {
        main.editable = 'value';
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--editable', 'value']);
    });

    it('checks platform args', async () => {
        main.platform = 'value';
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--platform', 'value']);
    });

    it('checks upgrade args', async () => {
        main.upgrade = true;
        
        expect(main.getArgs()).toEqual(['-m', 'pip', 'install', '--upgrade']);
    });

    // it('', async () => {});
});
