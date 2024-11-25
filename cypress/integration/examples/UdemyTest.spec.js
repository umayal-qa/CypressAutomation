/// <reference types="Cypress" />
import FlipkartHomePage from '../pageObjects/FlipkartHomePage'
import FlipkartMobilePage from '../pageObjects/FlipkartMobilePage'

describe('Udemy Test', function() 
{

before(function(){
cy.fixture('flipkart').then(function(data){
this.data=data
})
})

it('Verification of Udemy Search Filter Functionality',function() {
const flipkartMobilePage = new FlipkartMobilePage()
const flipkartHomePage = new FlipkartHomePage()
// cy.visit( Cypress.env('udemyurl'))
// cy.visit('https://altimetrik.udemy.com/organization/home/')
// cy.wait(2000)
cy.visit('https://www.google.com/')
cy.get('[name="q"]').type("udemy.com")
cy.wait(4000)
cy.contains('udemy.com').click()
// cy.contains('Online Courses').click()
cy.wait(4000)

})
})

