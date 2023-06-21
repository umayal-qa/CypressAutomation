class FlipkartHomePage
{
getProduct(product){
    return cy.get('a[title='+product+']')
}
getGender(){
    return cy.get('select')
}
getInlineRadio(){
    return cy.get("#inlineRadio3")
}
getShopTab(){
    return cy.get('a[href="/angularpractice/shop"]')
}
}
export default FlipkartHomePage;