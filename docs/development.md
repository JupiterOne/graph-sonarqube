# Development

## Prerequisites

### Docker

You need [docker](https://www.docker.com/get-started) installed to run Sonarqube
in a container.

### Sonarqube Container Image

You need to have the sonarqube docker image running:

```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

When you go to `localhost:9000` Sonarqube will prompt you to login (default
credentials `admin:admin`) and update the default credentials.

### Sonarqube Setup for Integration

To have a useful set of data to test against you'll want to setup at least one
ALM integration. You can find documentation for
[Github](https://docs.sonarqube.org/latest/analysis/github-integration/) and
other ALMs in the developer [documents](https://docs.sonarqube.org/latest/)
under ALM Integration. After setting up an integration you'll be able to create
projects that are backed by a repository on your ALM.

## Execute the Integration

With `<graph-sonarqube>/.env` in place, simply run `yarn start`!

## Running Tests

Many of the tests are written to make API requests, with requests and responses
recorded by Polly.js to allow for playback in CI/CD environments. An
[integration configuration for testing](../test/integrationInstanceConfig.ts)
works to ensure that there is an appropriate configuration to replay the
recordings.

During development, the API clients will use the `<graph-sonarqube>/.env` file
(thanks to `jest.config.js`).
