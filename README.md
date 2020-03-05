# pip-action
[![Test](https://github.com/BSFishy/pip-action/workflows/Test/badge.svg)](https://github.com/BSFishy/pip-action/actions)

This action installs pip packages.

## Usage
See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@v2
- uses: actions/setup-python@v1
- uses: BSFishy/pip-action@v1
  with:
    packages: |
      package1
      package2
- run: python main.py
```

All options:
```yaml
- uses: BSFishy/pip-action@v1
  with:
    packages: package
    requirements: requirements.txt
    constraints: constraints.txt
    no-deps: true
    pre: true
    editable: editable
    platform: ':all:'
    upgrade: true
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
