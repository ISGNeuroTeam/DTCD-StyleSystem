# **CHANGELOG**

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

### Added

- BaseLabel custom component
- BaseLink custom component
- BaseIconButton custom component
- BaseChip custom component
- BaseTabs custom component
- BaseTooltip custom component
- BaseRadio and BaseRadioGroup custom components
- BaseRange custom component

### Changed

- BaseButton styles and size logic
- BaseCheckbox styles and inner logic
- BaseChip styles
- BaseInput styles
- BaseSwitch styles and inner logic

### Removed

- BaseButton `text-color`, `back-color`, `hover-color` and `active-color` attributes
- BaseCheckbox `color` attribute
- BaseSwitch `color` attribute

## [0.3.1]

### Fixed

- README.md file

## [0.3.0]

### Added

- init hook to get themes from server
- manifest file for dependencies
- BaseButton custom component
- Proxima Nova font
- BaseTextarea custom component
- BaseCheckbox custom component
- BaseSwitch custom component
- BaseColorPicker custom
- BaseInput value setter and getter
- DataSourceSelect
- GaugeSegmentBuilder

### Changed

- _getThemes_ method just returns theme object and no longer requesys themes from server
- deployment section in [README.md](Readme.md)
- SDK version to 0116

### Fixed

- rollup build path for development
- setVariables function in setVariablesToElement method
- rollup building directory path
- BaseCheckbox icon

## [0.2.0] - 2021-02-11

### Changed

- [Makefile](Makefile) to current project structure
- downloading DTCD-SDK from nexus
- changed paths in source files to DTCD-SDK
- renamed code source directory from StyleSystem to DTCD-StyleSystem

### Fixed

- [LICENSE.md](LICENSE.md) file text content
- [Jenkinsfile](Jenkinsfile) text content

## [0.1.0] - 2021-02-09

- Added main functional
