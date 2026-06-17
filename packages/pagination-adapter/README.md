# @easybread/pagination-adapter

Normalizes provider-specific pagination into EasyBREAD's unified pagination model.

## Install

```shell
pnpm add @easybread/pagination-adapter
```

## What's inside

Different APIs paginate differently (page numbers, cursors, offsets …). The pagination
adapter maps those provider specifics onto the unified pagination contract used by
EasyBREAD operations, so application code can rely on consistent `prev` / `next`
pointers in paginated operation output.

```ts
const results = await client.invoke(OperationName.USERS_SEARCH, {
  breadId,
  params: { query },
  pagination: { type: 'PREV_NEXT', page },
});

const { payload, pagination: { next, prev } } = results;
```

## Development

Run `nx test pagination-adapter` and `nx build pagination-adapter`.
