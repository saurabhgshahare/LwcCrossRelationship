public with sharing class AccountHandler {
    @AuraEnabled
    public static Account createAccount(Account account) {
            insert account;
            return account;
        
    }
}