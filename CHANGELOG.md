# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.0.0-beta.3 2023-05-30

## Changed

- 400 errors resulting from querying more than 10,000 entries have been reduced
  and converted to warnings.

## 1.0.0-beta.2 2023-03-09

## Fixed

- Fix Finding converter

## 1.0.0-beta.1 2023-03-06

## Changed

- Introduced getStepStartStates to allow enable/disable of finding ingestion
  step.

## 1.0.0-beta.0 2023-01-27

### Added

- Updated SDK versions to v8

- Entities:

| Resources | Entity `_type`      | Entity `_class` |
| --------- | ------------------- | --------------- |
| Account   | `sonarqube_account` | `Account`       |
| Finding   | `sonarqube_finding` | `Finding`       |

- Relationships:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`  |
| --------------------- | --------------------- | ---------------------- |
| `sonarqube_account`   | **HAS**               | `sonarqube_project`    |
| `sonarqube_account`   | **HAS**               | `sonarqube_user`       |
| `sonarqube_account`   | **HAS**               | `sonarqube_user_group` |
| `sonarqube_project`   | **HAS**               | `sonarqube_finding`    |

## 0.1.0 2021-04-29

### Added

- User Group Entity
- User Entity
- Project Entity
- User Group User Relationship
