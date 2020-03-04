import * as core from '@actions/core';
import fs = require('fs');
import os = require('os');
import path = require('path');

import * as main from '../src/main';

describe('pip-action', () => {
    let inSpy: jest.SpyInstance;

    beforeEach(() => {
        inSpy = jest.spyOn(core, 'getInput');
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
});
