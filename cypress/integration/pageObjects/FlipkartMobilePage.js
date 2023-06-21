class FlipkartMobilePage
{
    
getFilterValueSelected(value){
    return   cy.get('div').contains("✕").next().then(function(element){
        cy.get(element).contains(''+value+'')
})
}
}
export default FlipkartMobilePage;