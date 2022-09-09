# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.2](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.2.1...v2.2.2) (2022-09-09)

### Bug Fixes

- ignore errors if bad components in DI ([49e9496](https://github.com/EndyKaufman/nestjs-custom-injector/commit/49e9496bf03df9d9be78843968fad4740b27d328))

### [2.2.1](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.2.0...v2.2.1) (2022-09-09)

### Bug Fixes

- add updateBuildableProjectDepsInPackageJson=false for disable append deps version to lib package json file ([77fc566](https://github.com/EndyKaufman/nestjs-custom-injector/commit/77fc566b57658a14450dd0419286b1f521674c0f))

## [2.2.0](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.1.2...v2.2.0) (2022-09-09)

### Features

- update deps, nest version 14.6.5 ([5f4382a](https://github.com/EndyKaufman/nestjs-custom-injector/commit/5f4382a56be86971589274276bb509952fbf45db))

### [2.1.2](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.1.1...v2.1.2) (2022-09-09)

### Bug Fixes

- remove peerDependencies ([730f6cd](https://github.com/EndyKaufman/nestjs-custom-injector/commit/730f6cd70ac0aa6d5b9f6dcd8d3cc6f07b4bea36))

### [2.1.1](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.1.0...v2.1.1) (2022-07-26)

### Bug Fixes

- add check metadata key name of providers in initAllNeedProviders before run asyncInit ([efc67d9](https://github.com/EndyKaufman/nestjs-custom-injector/commit/efc67d971edf55eea7074558cbb4703a74008480))

## [2.1.0](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.0.2...v2.1.0) (2022-07-17)

### Features

- removed global storage for custom injector metadata, now use reflect metadata storage over classes for it, now ignore custom injected providers when its not included in DI tree NestJS ([5c9b1b7](https://github.com/EndyKaufman/nestjs-custom-injector/commit/5c9b1b7919c25bcf4b0aa22035f3106693cb9106))

### [2.0.2](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.0.1...v2.0.2) (2022-07-15)

### Bug Fixes

- append DiscoveryModule to imports of CustomInjectorCoreModule ([55a4cab](https://github.com/EndyKaufman/nestjs-custom-injector/commit/55a4cab519d21b21148a4783b07f749214c900a4))
- restore peerDependencies of lib ([1913477](https://github.com/EndyKaufman/nestjs-custom-injector/commit/1913477d8f32ba00c2af84f273e04fc0c49f6f23))

### [2.0.1](https://github.com/EndyKaufman/nestjs-custom-injector/compare/v2.0.0...v2.0.1) (2022-07-14)

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
