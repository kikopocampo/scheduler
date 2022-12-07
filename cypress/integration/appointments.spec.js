describe("Appointments", () => {
  
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset")
    cy.visit("/")
    cy.contains("Monday")
  });

  it("should book an inteview", () => {

   
    cy.get("[alt='Add']")
      .first()
      .click()

    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones")

    cy.get("[class=interviewers]")
      .get("[alt='Sylvia Palmer']").click()

    cy.contains("Save")
      .click()

    cy.contains(".appointment__card--show", "Lydia Miller-Jones")
    cy.contains(".appointment__card--show", "Sylvia Palmer")
      
  })

  it("should book an inteview", () => {

    cy.get("[alt='Edit']").click({force:true})
      .get("[data-testid=student-name-input]").clear()
      .type("Bob Bobbikins")
      .get("[class=interviewers]")
      .get("[alt='Tori Malcolm']").click()

    cy.contains("Save").click()

    
    cy.contains(".appointment__card--show", "Bob Bobbikins")
    cy.contains(".appointment__card--show", "Tori Malcolm")

  })

  it("should book an inteview", () => {

    cy.get("[alt='Delete']").click({force:true})
    
    cy.contains("Confirm").click()

    cy.contains("Deleting").should("exist")
    cy.contains("Deleting").should("not.exist")

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist")
      
   
  })

});