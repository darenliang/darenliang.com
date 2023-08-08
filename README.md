# www.darenliang.com

This website uses Hugo and a heavily customized [fork](https://github.com/darenliang/smol) of colorchestra's [smol](https://github.com/colorchestra/smol) theme.

## Documented extensions

### config.toml

```toml
[params]
# Enable temporal banner for various important events
enableTemporal = true # bool

# Enable giscus
giscusRepo = "darenliang/darenliang.com" # str
giscusRepoId = "MDEwOlJlcG9zaXRvcnkyMTEzNjc4MDI=" # str

# Custom message for people that disable JavaScript when
# counting is enabled
noJS = "JS is not enabled" # str

# Show dates on post, good for pages that shouldn't dates
showDatesOnPosts = "2006-01-02" # str

# Add custom CSS
# This is present in the original smol theme, but is undocumented
customCss = [] # [str]
```

### Post header format

```markdown
title: str
date: str
showthedate: bool
nocomments: bool
```

### Script shortcode

A suffix is appended to the script path to refresh cache

```markdown
{{< script "script-path.js" >}}
```

## License

[MIT](https://github.com/darenliang/darenliang.com/blob/master/LICENSE)
