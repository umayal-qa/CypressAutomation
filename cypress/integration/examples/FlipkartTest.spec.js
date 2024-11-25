/// <reference types="Cypress" />
import FlipkartHomePage from '../pageObjects/FlipkartHomePage'
import FlipkartMobilePage from '../pageObjects/FlipkartMobilePage'

describe('Flipkart Test', function() 
{

before(function(){
cy.fixture('flipkart').then(function(data){
this.data=data
})
})

it('Verification of Flipkart Search Filter Functionality',function() {
const flipkartMobilePage = new FlipkartMobilePage()
const flipkartHomePage = new FlipkartHomePage()
cy.visit( Cypress.env('url'))
cy.title().should('eq', this.data.homePageTitle)
cy.title().should('include', 'Flipkart.com')
cy.get('span').contains('Electronics').click()
flipkartHomePage.getProduct(this.data.productName.mobile).click({force:true})
cy.wait(1000)
// Another way to achieve click while user mouse hover (in some places {force: true} will work , in some places invoking show will work)
// cy.get('span').contains('Electronics').invoke('show');   
// flipkartHomePage.getProduct(this.data.productName.mobile).click()
cy.title().should('eq', this.data.mobilePageTitle)
cy.title().should('include', 'Mobile')
cy.selectFilterCheckbox(this.data.mobile.filters.RAM.eightGBandabove)
flipkartMobilePage.getFilterValueSelected(this.data.mobile.filters.RAM.eightGBandabove).should('be.visible')
})
})

