export default class themeChanger {
    /**
     * @constructor
     * _addDarkTheme()：这会将link标签添加到应用程序的HTML head中
     * _removeDarkTheme()：这将删除已添加到HTML head的link标签
     * _darkThemeSwitch()：这将切换添加和删除方法，以在我们的HTML head中添加和删除link标签
     */
    constructor() {}
    _addDarkTheme() {
        const darkThemeLinkEl = document.createElement('link')
        darkThemeLinkEl.setAttribute('rel', 'stylesheet')
        darkThemeLinkEl.setAttribute('href', './css/dark.css')
        darkThemeLinkEl.setAttribute('id', 'dark-theme-style')
        const docHead = document.querySelector('head')
        docHead.append(darkThemeLinkEl)
    }
    _removeDarkTheme() {
        const darkThemeLinkEl = document.querySelector('#dark-theme-style')
        const parentNode = darkThemeLinkEl.parentNode
        parentNode.removeChild(darkThemeLinkEl)
    }
    _darkThemeSwitch() {
        const darkThemeLinkEl = document.querySelector('#dark-theme-style')
        if (!darkThemeLinkEl) {
            this._addDarkTheme()
        } else {
            this._removeDarkTheme()
        }
    }
}