# Zed Extensions GitHub Action

This action for automatically bump Zed Extensions version after a release.

## Usage

Create a `release.yml` file in `.github/workflows` directory with the following content:

```yml
on:
  push:
    tags:
      - 'v*'

jobs:
  homebrew:
    name: Release Zed Extension
    runs-on: ubuntu-latest
    steps:
      - uses: huacnlee/zed-extension-action@v1
        with:
          extension-name: your-extension-name
          # extension-path: extensions/${{ extension-name }}
          push-to: your-name/extensions
        env:
          # the personal access token should have "repo" & "workflow" scopes
          COMMITTER_TOKEN: ${{ secrets.COMMITTER_TOKEN }}
```

## Inputs

| Name             | Description                                                  | Required | Default                          |
| ---------------- | ------------------------------------------------------------ | -------- | -------------------------------- |
| `extension-name` | The name of your Zed extension.                              | `true`   | -                                |
| `extension-path` | If you have a different path, you can set it.                | `false`  | `extensions/${ extension-name }` |
| `push-to`        | The forked repository of the zed-industries/extensions repo. | `true`   | -                                |

The `COMMITTER_TOKEN` is a personal access token with `repo` and `workflow` scopes. You can create one in your [GitHub settings](https://github.com/settings/tokens).

## How it works

When a new tag is pushed, the action will:

1. Check if the tag is a valid version number.
2. Create a Pull Request with the new version to [Zed Extensions](https://github.com/zed-industries/extensions/pulls) repository.
3. Merge the Pull Request if it's approved, then the extension version will released.

See example: https://github.com/zed-industries/extensions/pull/217

## License

MIT
