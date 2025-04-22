public with sharing class AccountSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(String searchTerm) {
        List<Account> accounts = [SELECT Id, Name, Phone, Industry, Website FROM Account WHERE Name LIKE :('%'+ searchTerm + '%')];
        return accounts;
    }
    @AuraEnabled
    public static void updateAccounts(List<Account> accounts) {
        update accounts;
    }
}