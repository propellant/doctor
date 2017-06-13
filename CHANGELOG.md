# 0.9.0
- Enable merging props from mixins, can be disabled via `ignoreMixins` prop
- **BREAKING CHANGE** - Change `propdoc.getDoc()` output from an array to an object, it now matches the data structure of Vue's native props

# 0.8.2
- Add named slots for customized content in native _propdoc_ output
- Add `data-lang="vue"` to _token_ field output

# 0.8.1
- Remove usage of `Object.entries`

# 0.8.0
- Add `propdoc.getDoc(component, documentation)` method for getting _propdoc_ output into customized components

# 0.7.0
- Initial release