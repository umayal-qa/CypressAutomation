class MyntraWatchPage
{
    
getFilterValueSelected(value){
    return   cy.get('label.vertical-filters-label').then(function(element){
        cy.get(element).contains(''+value+'')
})
}
}
export default MyntraWatchPage;