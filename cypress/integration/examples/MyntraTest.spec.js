/// <reference types="Cypress" />
import MyntraHomePage from '../pageObjects/MyntraHomePage'
import MyntraWatchPage from '../pageObjects/MyntraWatchPage'

describe('Myntra Test', function() 
{
before(function(){
cy.fixture('myntra').then(function(data){
this.data=data
})
})

it('Verification of Myntra Search Filter Functionality',function() {
const myntraWatchPage = new MyntraWatchPage()
const myntraHomePage = new MyntraHomePage()
cy.visit(Cypress.env('url'), { headers: { "Accept-Encoding": "gzip, deflate" } });
cy.title().should('eq', this.data.homePageTitle)
cy.title().should('include', 'Myntra')
cy.get('a').contains('Fashion Accessories').click({force:true})
cy.get('li').contains('Watches').then(() =>{ 
    myntraHomePage.getProduct(this.data.productName.watch).click({force:true}); 
 });
// Another way to achieve click while user mouse hover (in some places {force: true} will work , in some places invoking show will work)
// cy.get('span').contains('Accessories').invoke('show');   
// cy.title().should('eq', this.data.fashionAccessoriesPageTitle)
// cy.title().should('include', 'Accessories')
// cy.selectFilterCheckbox(this.data.watch.filters.brand.titan)
// myntraWatchPage.getFilterValueSelected(this.data.watch.filters.brand.titan).should('be.visible')
})
})

