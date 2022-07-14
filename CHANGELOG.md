# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v1.0.1...v2.0.0) (2022-07-14)

### ⚠ BREAKING CHANGES

- more types, remove getLastComponentByName, getLastComponentByClass, getComponentsByName, getComponentsByClass, change generic for property of object

### Features

- add types for more methods and classes, add tests for all logics and options ([#6](https://github.com/EndyKaufman/nestjs-custom-injector/issues/6)) ([07dfa0e](https://github.com/EndyKaufman/nestjs-custom-injector/commit/07dfa0e1d76fe07c90b44ffd6ca0f9bb27988e53))
- append throw errors if provider not set, append support Promise default value, append support set factory for create instance of provider, append support Promise for factory, append init all need providers after load applications, append support typing for set propertyName on use service or decorators ([#6](https://github.com/EndyKaufman/nestjs-custom-injector/issues/6)) ([1a28dd2](https://github.com/EndyKaufman/nestjs-custom-injector/commit/1a28dd26b2fe6ada49d69e9d73a4cc3d487f19e9))

### [1.0.1](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v1.0.0...v1.0.1) (2022-02-23)

## 1.0.0 (2022-02-23)

### Features

- create library with all needed basic logic ([11f5a93](https://github.com/EndyKaufman/nestjs-custom-injector/commit/11f5a93bde47f479456df5258118c8291267bc4c))
