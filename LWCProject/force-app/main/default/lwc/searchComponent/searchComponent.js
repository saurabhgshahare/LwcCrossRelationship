import { LightningElement, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/AccountMessageChannel__c';

export default class SearchComponent extends LightningElement {
    @track searchTerm = '';
    @track isSearchPerformed = false;
    @track searchKey = '';

    @wire(MessageContext)
    messageContext;

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    }

    handleSearch() {
        if (this.searchTerm && this.searchTerm !== '') {
            this.isSearchPerformed = true;
            this.searchKey = this.searchTerm;
        } else {
            this.isSearchPerformed = false;
            this.publishClearMessage();
            
        }
    }

    publishClearMessage(){
        const message={selectedAccountId: null};
        publish(this.messageContext, ACCOUNT_MESSAGE_CHANNEL, message);
    }
}