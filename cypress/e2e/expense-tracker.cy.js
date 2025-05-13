describe('Expense Tracker Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('allows user to log in successfully', () => {
    // Login credentials input
    cy.get('input[name="username"]').type('haleem')
    cy.get('input[name="password"]').type('haleem123')
    
    // Submit login form
    cy.get('button[type="submit"]').click()

    // Verify redirect to dashboard/expense tracker
    cy.url().should('include', '/dashboard')
    
    // Check for key dashboard elements
    cy.get('[data-testid="expense-tracker"]').should('be.visible')
  })

  it('shows error for invalid login', () => {
    cy.get('input[name="username"]').type('wronguser')
    cy.get('input[name="password"]').type('wrongpassword')
    
    cy.get('button[type="submit"]').click()

  
  })

 
})