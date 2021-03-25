
const {Builder, By, Key} = require('selenium-webdriver');
const assert = require('assert');

(async function myFunction() {
    let driver = await new Builder().forBrowser('chrome').build();


//********************  Add  automated test cases for login  *******************************************
    await driver.get('https://www.saucedemo.com');
    await driver.findElement(By.id("user-name")).sendKeys('standard_user');
    await driver.findElement(By.id("password")).sendKeys('secret_sauce', Key.ENTER);


//*****************  If the Item costs less than $15 add to card  **************************************
    let pricebars = await driver.findElements(By.className("pricebar"));

    for(let i of pricebars) {
        let item = await i.findElement(By.className("inventory_item_price"))
        if (parseFloat((await item.getText()).slice(1))<15) {
            await i.findElement(By.className("btn_primary btn_inventory")).sendKeys(Key.ENTER);
        }
    }


//**********  Check price calculation in the shopping card *****************************************
    await driver.get('https://www.saucedemo.com/cart.html');

    let pricesInCart = await driver.findElements(By.className("inventory_item_price"));
    for(let i of pricesInCart) {
        const price = parseFloat(await i.getText())
        try{
            assert(price < 15,'test if the price of each cart item is less than 15');
        } catch(e) {
            throw new Error('Item price is grater than or equal to 15');
        }
    }


//****************** Proceed to checkout *************************************************************
    await driver.findElement(By.className("btn_action checkout_button")).sendKeys(Key.ENTER);

    await driver.findElement(By.id("first-name")).sendKeys('Sevak');
    await driver.findElement(By.id("last-name")).sendKeys('Yer');
    await driver.findElement(By.id("postal-code")).sendKeys(19703, Key.ENTER);

    await driver.findElement(By.className("btn_action cart_button")).sendKeys(Key.ENTER);

    
//******************* Make sure the order is created *************************************************
    const orderCreationMessage = await driver.findElement(By.className("complete-header")).getText();
    try{
        assert.strictEqual(orderCreationMessage, 'THANK YOU FOR YOUR ORDER');
    } catch(e) {
        throw new Error('Order is not created');
    }

})();


