class MyntraHomePage
{
getProduct(product){
    return cy.get('input[type="checkbox"][value='+product+']')
}
}
export default MyntraHomePage;