public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<ContactWrapper> getRelatedContacts(Id accountId) {
        // Validate the accountId before querying
        if (accountId == null) {
            return new List<ContactWrapper>(); // Return an empty list if no accountId is provided
        }

        // Fetch contacts related to the account
        List<Contact> contacts = [
            SELECT Id, FirstName, LastName, Email, Phone 
            FROM Contact 
            WHERE AccountId = :accountId
        ];

        // Create a list of ContactWrapper to hold the combined name
        List<ContactWrapper> contactWrappers = new List<ContactWrapper>();
        for (Contact contact : contacts) {
            contactWrappers.add(new ContactWrapper(contact.Id, contact.FirstName, contact.LastName, contact.Email, contact.Phone));
        }
        return contactWrappers;
    }

    // Wrapper class to hold contact details including full name
    public class ContactWrapper {
        @AuraEnabled public String Id { get; set; }
        @AuraEnabled public String FullName { get; set; }
        @AuraEnabled public String Email { get; set; }
        @AuraEnabled public String Phone { get; set; }

        public ContactWrapper(Id id, String firstName, String lastName, String email, String phone) {
            this.Id = id;
            this.FullName = firstName + ' ' + lastName;
            this.Email = email;
            this.Phone = phone;
        }
    }
}