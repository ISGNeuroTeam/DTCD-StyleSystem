# **CHANGELOG**

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

### Added

- 'autoCLose' parameter of BaseSelect
- date range in BaseDateTimePicker
- buttons for select of time windows in BaseDateTimePicker
- BaseDateTimePicker documentation

### Changed

- how `invalid` property works. Edited BaseInput, BaseSelect, BaseTextarea
- BaseSelect rendering so that it doesn't get cut off

## [0.14.0]

### Added

- toggle event in BaseExpander
- attribute `data-active-tab` in BaseTabs
- closing the BaseDataTimePicker on the cancel button
- variable in storybook global styles
- displaying of tooltip in storybook
- tooltip scss in separate file

### Changed

- adding of label to BaseSelect
- tooltip title color
- tooltip rendering so that it doesn't get cut off
- updated Storybook

### Fixed 

- autoheight of BaseTextarea
- height of BaseFileLoader
- position of dropdown in BaseDateTimePicker
- style of canvas in Storybook docs

## [0.13.0]

### Added 

- maxlength and minlength in BaseInput and BaseTextarea
- info about event 'toggle' in documentation of BaseDropdown
- property for correct displaying of DatasourceSelect

## [0.12.0]

### Added 

- color variables in BaseSelect icon and text
- color variables in BaseColorPicker, BaseDataTimePicker, BaseDropdown, BaseLabel for correct displaying in dark theme

## [0.11.0]

### Changed

- version of DatasourcePanel in DataSourceSelect

## [0.10.0]

### Added

- adaptive height of BaseTextarea
- maximum width of 100% BaseTextarea during resizing

### Fixed

- bug opening of BaseSelect in disabled mode

## [0.9.0]

### Changed

- value setting of BaseSelect

### Fixed

- small bug in displaying BaseSelect

## [0.8.1]

### Fixed

- added setter for active tab in base-tabs component

## [0.8.0]

### Added

- new themes of BaseExpander
- new theme of BaseIconButton

### Changed

- BaseExpander docs about slot 'icon'
- BaseExpander styles of arrow icon

### Fixed

- visibility of text and icon in disabled BaseButton in dark theme

## [0.7.0]

### Added

- enabling check BaseInput, BaseTextarea, BaseSelect after connection to page
- label in BaseSwitch

### Changed

- 'display:none' with 'padding:0' in error message of BaseInput, BaseTextarea and BaseSelect
- setting boolean attributes (required, etc.)

### Fixed

- synced typed value in datetime picker
- long value in BaseSelect component
- DataSourceSelect create button not work

## [0.6.0]

### Added

- left and right icon slot for BaseInput
- script for saving the selected theme after page reload
- tracking of the active tab for BaseTabs

### Changed

- launch commands of Storybook
- colors with transparency in Storybook
- docs of BaseFileLoader
- display error message of BaseInput, BaseTextarea and BaseSelect

### Fixed

- BaseSelect option list correct opening
- BaseColorPicker outside click in Chrome

## [0.5.0]

### Added

- integration Storybook to project for UI-kit
- information about Storybook to README.md
- BaseExpander and BaseExpanderGroup
- BaseHeading custom component
- new styles of BaseButton
- animate error message of BaseInput
- BaseSelect new API
- BaseButton with icon
- Label in BaseColorPicker
- documentation of base components to Storybook
- BaseFileLoader component
- generic dropdown list (BaseDropdown)
- jest config

### Changed

- improved backward compatibility of BaseButton API
- command "make clean", gitignore, Storybook config
- improved BaseChip property "close"
- added new styles BaseIconButton and new API
- improved base styles of BaseInput and its API
- improved view of "BaseSelect"
- styles of BaseCheckbox
- styles of BaseColorPicker
- styles, scripts and API of BaseTextarea
- import of fonts and styles in Rollup
- styles, script and layout of GaugeSegmentBuilder
- dispatch of "input" and "change" events
- updated styles of DataSourceSelect

### Fixed

- bug with infinite input recursion in range field (GaugeSegmentBuilder component)
- opening BaseSelect and BaseColorPicker

## [0.4.0]

### Added

- BaseLabel custom component
- BaseLink custom component
- BaseIconButton custom component
- BaseChip custom component
- BaseTabs custom component
- BaseTooltip custom component
- BaseRadio and BaseRadioGroup custom components
- BaseRange custom component
- version of core systems for adapters
- version of core systems for adapters in DataSourceSelect base component

### Changed

- BaseButton styles and size logic
- BaseCheckbox styles and inner logic
- BaseChip styles
- BaseInput styles
- BaseSwitch styles and inner logic
- BaseTextarea styles and inner logic
- build process in order to make directory name with current version of pluing
- getting version for `getRegistrationMeta()` method from `package.json`

### Removed

- BaseButton `text-color`, `back-color`, `hover-color` and `active-color` attributes
- BaseCheckbox `color` attribute
- BaseSwitch `color` attribute
- BaseSwitch `width` attribute

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
