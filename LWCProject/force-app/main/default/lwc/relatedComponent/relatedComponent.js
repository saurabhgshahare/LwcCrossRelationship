import { LightningElement, wire, track } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/AccountMessageChannel__c';

export default class RelatedComponent extends LightningElement {
    @track selectedAccountId;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.subscribeToMessageChannel();
    }

    disconnectedCallback(){
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel(){
        console.log('Subscribing to message Channel');
        if(!this.subscription){
            this.subscription = subscribe(
                this.messageContext,
                ACCOUNT_MESSAGE_CHANNEL,
                (message) => this.handleMessage(message),
            );
        }
    }

    unsubscribeToMessageChannel(){
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message){
        console.log('Message service:',message);
        if(message.selectedAccountId===null){
            this.selectedAccountId = null;
            console.log('Cleared selectedAccountId in relatedComponent:',this.selectedAccountId);
        }else{
            this.selectedAccountId = message.selectedAccountId;
            console.log('Received selectedAccountId in relatedComponent:', this.selectedAccountId);
        }
    }
}