public with sharing class AccountContactCreator {

    @AuraEnabled(cacheable=true)
    public static List<String> getAccountFieldValues(String fieldName) {
        Set<String> fieldValues = new Set<String>();

        List<Account> accounts = [SELECT Type, Industry, Rating FROM Account];

        for (Account acc : accounts) {
            if (fieldName == 'Type' && acc.Type != null) {
                fieldValues.add(acc.Type);
            } else if (fieldName == 'Industry' && acc.Industry != null) {
                fieldValues.add(acc.Industry);
            } else if (fieldName == 'Rating' && acc.Rating != null) {
                fieldValues.add(acc.Rating);
            }
        }
        return new List<String>(fieldValues);
    }

    @AuraEnabled
    public static Id createAccount(String accountName, String accountPhone, String type,
            String industry, String rating) {
        Account acc = new Account(Name = accountName, Phone = accountPhone, Type = type, Industry = industry, Rating = rating);
        insert acc;
       return acc.Id;
    }

    @AuraEnabled
    public static String createContactAndLinkToAccount(String firstName, String lastName, String email, String department, Id accountId) {
        Contact con = new Contact(FirstName = firstName, LastName = lastName, Email = email, Department = department, AccountId = accountId);
        insert con;
        return con.Id;
    }
}