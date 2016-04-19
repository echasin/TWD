'use strict';

describe('Portfolio e2e test', function () {

    var username = element(by.id('username'));
    var password = element(by.id('password'));
    var entityMenu = element(by.id('entity-menu'));
    var accountMenu = element(by.id('account-menu'));
    var login = element(by.id('login'));
    var logout = element(by.id('logout'));

    beforeAll(function () {
        browser.get('/');
        browser.driver.wait(protractor.until.elementIsVisible(element(by.css('h1'))));

        accountMenu.click();
        login.click();

        username.sendKeys('admin');
        password.sendKeys('admin');
        element(by.css('button[type=submit]')).click();
    });

    it('should load Portfolios', function () {
        entityMenu.click();
        element(by.css('[ui-sref="portfolio"]')).click().then(function() {
            expect(element.all(by.css('h2')).first().getText()).toMatch(/Portfolios/);
        });
    });

    it('should load create Portfolio dialog', function () {
        element(by.css('[ui-sref="portfolio.new"]')).click().then(function() {
            expect(element(by.css('h4.modal-title')).getText()).toMatch(/Create or edit a Portfolio/);
            element(by.css('button.close')).click();
        });
    });

    afterAll(function () {
        accountMenu.click();
        logout.click();
    });
});
