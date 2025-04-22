public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getRelatedOpportunities(Id accountId) {
        return [SELECT Id, Name, StageName, CloseDate FROM Opportunity WHERE AccountId = :accountId];
    }
}