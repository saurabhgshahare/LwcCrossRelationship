public with sharing class ContactSearchController {

    /**
     * Searches contacts based on the provided criteria (First Name, Last Name, SSN).
     * At least one of the parameters must be provided to perform the search.
     *
     * @param firstName (Optional) First Name of the Contact.
     * @param lastName (Optional) Last Name of the Contact.
     * @param ssn (Optional) SSN (Custom Field) of the Contact.
     * @return List<Contact> - List of contacts matching the criteria.
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String firstName, String lastName, String ssn) {
        // Validate that at least one search criteria is provided
        if (String.isBlank(firstName) && String.isBlank(lastName) && String.isBlank(ssn)) {
            throw new AuraHandledException('Please provide at least one search criteria.');
        }

        // Build the SOQL query dynamically based on provided input
        String query = 'SELECT Id, FirstName, LastName, Phone, Email, SSN__c FROM Contact WHERE ';
        List<String> filters = new List<String>();
       
        // Add filters for each field if provided
        if (!String.isBlank(firstName)) {
            filters.add('FirstName LIKE \'%' + String.escapeSingleQuotes(firstName) + '%\'');
        }
        if (!String.isBlank(lastName)) {
            filters.add('LastName LIKE \'%' + String.escapeSingleQuotes(lastName) + '%\'');
        }
        if (!String.isBlank(ssn)) {
            filters.add('SSN__c = \'' + String.escapeSingleQuotes(ssn) + '\'');
        }
       
        // Join the filters with AND and append to the query
        query += String.join(filters, ' AND ');

        // Execute the query and return results
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException('Error while searching contacts: ' + e.getMessage());
        }
    }
}