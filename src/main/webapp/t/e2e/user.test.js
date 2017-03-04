var util = require('./util');
browser.driver.manage().window().maximize();

describe('User Test', function() {
    beforeAll(function() {
        browser.get('http://hjcpay.com/tax/w/index.html');
        //browser.get('http://localhost:8080/w/index.html');
        element(by.model('user.name')).sendKeys('a');
        element(by.model('user.password')).sendKeys('a');

        util.clickButton('登录');
        util.wait();
    });

    var userName = util.getRandomString(5),
        mail = userName + '@qq.com';

    it('add user', function() {
        util.clickButton('系统配置');
        $('a[href*="#/user"]').click();

        util.clickButton('新增用户');

        util.modelText('modal.data.name', userName);
        util.dateText('modal.data.birthday', '2017-01-01');
        util.selectText('modal.data.sex', '男');
        util.dateText('modal.data.entryTime', '2017-01-01');
        util.modelText('modal.data.mobile', '15951928787');
        util.modelText('modal.data.phone', '025-88888888');
        util.modelText('modal.data.password', userName);
        util.modelText('modal.data.password2', userName);
        util.modelText('modal.data.idCard', '340321199001017099');
        util.modelText('modal.data.mail', mail);

        util.selectText('modal.data.dept', '财务部');
        util.selectText('modal.data.roles', '会计');

        util.clickButton('确定', true);

        util.wait();

        var newUser = util.findGridRow(0).element(by.cssContainingText('.ui-grid-cell-contents', mail));
        expect(newUser.getText()).toBe(mail);
    });

    it('mod user', function() {
        //choose the last user for modification
        util.clickGridRow(0, 'last');
        util.clickButton('修改用户');

        mail += '-updated';
        util.modelText('modal.data.mail', mail);

        util.clickButton('确定');

        util.wait();

        var updatedUser = util.findGridRow(0).element(by.cssContainingText('.ui-grid-cell-contents', mail));
        expect(updatedUser.getText()).toBe(mail);
    });

    it('delete user', function() {
        //choose the last user for delete
        util.clickGridRow(0, 'last');
        util.clickButton('删除用户');
        util.clickButton('继续');

        util.wait();

        //check if user is deleted
        console.log(`delete user ${userName}`);
        util.findGridRow(0).$$('.ui-grid-cell-contents').each(function(e,i){
            expect(e.getText()).not.toBe(userName);
        });
    });
});
