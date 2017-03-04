var utilImpl = {
    clickButton: function(text, move) {
        var button = element(by.buttonText(text));
        if (move) {
            browser.actions().mouseMove(button).perform();
            browser.actions().click().perform();
        }
        button.click();
    },

    modelText: function(m, text) {
        var m = element(by.model(m));
        m.clear();
        m.sendKeys(text);
    },

    dateText: function(m, v) {
        element(by.model(m)).element(by.css('.md-datepicker-input')).sendKeys(v);
    },

    selectText: function(m, v) {
        element(by.model(m)).click();
        //browser.waitForAngular();
        element(by.cssContainingText('.md-text', v)).click();
    },

    getRandomString: function(length) {
        var string = '';
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' //Include numbers if you want
        for (i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    },
    clickGridRow: function(tab, index) {
        this.findGridRow(tab).$$('.ui-grid-selection-row-header-buttons')[index]().click();
    },
    findGridRow: function(tab){
    	return element.all(by.tagName('md-tab-content')).get(tab);
    },
    wait: function() {
        browser.waitForAngular();
    }
};

for (var k in utilImpl) {
    module.exports[k] = utilImpl[k];
}
