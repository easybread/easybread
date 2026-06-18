# @easybread/data-mapper

The property-mapping engine that powers [`@easybread/data-adapter`](../data-adapter).

## Install

```shell
pnpm add @easybread/data-mapper
```

## What's inside

A small, configurable mapper that transforms one object shape into another based on a
declarative property map. It supports direct property resolvers as well as the explicit
`'NO_MAP'` resolver for fields that should be intentionally skipped.

Most consumers use the higher-level `breadDataAdapter` rather than this package
directly, but it can be used standalone wherever you need predictable object mapping.

## Development

Run `nx test data-mapper` to execute the unit tests and `nx build data-mapper` to build.
