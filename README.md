# www.darenliang.com

This website uses Hugo and custom [fork](https://github.com/darenliang/smol) of colorchestra's [smol](https://github.com/colorchestra/smol) theme.

## Documented extensions

### config.toml

```toml
[params]

# Enable counter statistics via https://counter.darenliang.com
# counterKey represents the key used to track visit counts
enableCounter = true # bool
counterKey = "website name" # str

# Enable temporal banner for various important events
enableTemporal = true # bool

# Custom message for people that disable JavaScript when
# enableCounter is true
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
```

### Script shortcode

A suffix is appended to the script path to refresh cache

```markdown
{{< script "script-path.js" >}}
```

## License

[MIT](https://github.com/darenliang/darenliang.com/blob/master/LICENSE)
