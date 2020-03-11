# easybread

[![Total alerts](https://img.shields.io/lgtm/alerts/g/easybread/easybread.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/easybread/easybread/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/easybread/easybread.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/easybread/easybread/context:javascript)

<https://easybread.io/>

<https://github.com/easybread>

<https://www.npmjs.com/org/easybread>

Easily browse, read, edit, add, and delete (BREAD) data from third-party providers in a standard format.

Build an expandable, open-source NPM module for syncing data between third party HR / Identity providers with an easy API to include new third party providers as separate “plugins”. Each module should allow access to the raw data from the third party, as well as a standardized format for reading information that is consistent between third party providers.

An example package that does this type of plugin integration is <https://github.com/editor-js>. EditorJS allows you to pull in the primary “editor” as its own module, and then you can include “plugins” to extend the functionality. This project should model that approach.

The project and all modules should use TypeScript as the primary language. The code should be validated using husky pre-commit (to prevent committing bad code) and pre-push (to prevent pushing bad code) hooks. Utilize TSLint for lint checking.

Editor config should be used along with .vscode/settings.json to enforce two space indent, trailing whitespace, insert a final newline, format on saving, enable spelling, etc.

All code will be published via forking and opening a pull request to repositories at <https://github.com/easybread>

All pull requests and commits should go through automated testing and code quality analysis using <https://lgtm.com/> and <https://circleci.com/> or <https://travis-ci.org/> to run tests.

## Standardized CRUD Format

Each third party will require a plugin to talk in their own format. The goal is to transform these different requests/responses into a standardized format to make pulling and updating information to and from these services a breeze. Should use <https://schema.org/> for our schema when building out the "Standardized" set of information we pull. Basically any response we get from third-party providers, we should map to schema.org objects.

There should be a list of standard API calls that you can call to communicate with each third-party provider to put and pull information in a consistent format. Any extra information or APIs you would like to include as part of the standard module should not interfere with the standard API calls.

## Standardized Auth Flow

Each plugin may require the user to authenticate to communicate with the service. Authentication should be standardized between the different third party providers. There may be “background” or “server-side” processes that happen and “foreground” or “in-browser” processes that occur.

An example foreground process would be when a user inside a web application clicks on “Import from Google” and they are presented with a popup dialog to authenticate with their Google account. Once they authenticate, if possible, all communication with the API should be possible in both the browser and the server. If not, the auth tokens should be passed to a standardized endpoint that forwards the tokens to whatever plugin requested the authentication. The plugins should not implement their own REST API for fetching the tokens, however, the plugins may implement their own internal server APIs to communicate with the third-party providers. This should be done in a standardized manner using APIs from the main package for things like GET and POST requests. These requests should be debuggable and loggable from the primary package.

## Database / Storage

Easy bread should be database agnostic. The user should have the ability to choose a store for tokens/keys. We should build a standard storage using MongoDB by default

## Other Ideas

Everything should be testable and put into a validatable format. For example, jsonschema or simple-schema should be used to validate the objects passed by users and when formatted to the standard format from the third-party API.

## Plugins

Current “plugins” on the roadmap to build:
![plugins](https://i.imgur.com/ANhtccQ.png)

### ADP

Import from ADP should allow easy access to sync worker information from ADP in a standard format.
<https://developers.adp.com/articles/api/workers-v2-api>
<https://developers.adp.com/articles/api/worker-demographics-v2-api>

### Google

Import from Google should allow easy access to sync G Suite users, contacts, etc., from Google into a standard format. Google stores contacts and users in different places. This plugin should allow you to pull contacts from your own contact list, as well as an employee directory if using G Suite.
<https://developers.google.com/people>
Email contacts from Gmail and other Google services may require separate plugins: easybread-gsuite, easybread-gmail, etc.

### Microsoft

Microsoft has several different sources of information. We need to determine what these are and how we can import from them. Examples would include Active Directory, Azure Activity Directory, Outlook Online, etc. We may need to split these into separate plugins, e.g. easybread/outlook, easybread/azuread, etc.

### BambooHR

Bamboo has an “employee” directory. We need to determine what different API endpoints are available to pull employee information.
<https://documentation.bamboohr.com/docs/getting-started>
