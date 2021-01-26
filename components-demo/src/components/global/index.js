export default function registerComponent(Vue) {
    const modules = require.context('./', false, /\w+\.Vue$/)
    modules.keys().forEach(fileName => {
        const component = modules(fileName)

        const name = fileName.replace(/^\.\/(.*)\.\w+$/, '$1')

        Vue.component(name, component.default)
    })
}