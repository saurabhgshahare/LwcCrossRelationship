import { LightningElement, api, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountSearchController.getAccountList';
import updateAccounts from '@salesforce/apex/AccountSearchController.updateAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import {publish, MessageContext} from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/AccountMessageChannel__c'; 

const columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Industry', fieldName: 'Industry', editable: true },
    { label: 'Phone', fieldName: 'Phone', editable: true },
];

export default class SearchResult extends LightningElement {
    @api searchKey;
    @track accounts = [];
    @track columns = columns;
    @track selectedRows = [];
    @track selectedAccountId;
    wiredAccountsResult;
    draftValues = [];
    error;

    @wire(getAccounts, { searchTerm: '$searchKey' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.accounts = [];
            this.error = error;
        }
    }

    @wire(MessageContext)
    messageContext;

    handleSave(event) {
        const updatedFields = event.detail.draftValues;
        if (updatedFields && updatedFields.length > 0) {
            updateAccounts({ accounts: updatedFields })
                .then(() => {
                    this.showToast('Success', 'Records Updated Successfully!', 'success');
                    this.draftValues = [];
                    return refreshApex(this.wiredAccountsResult);
                })
                .catch(error => {
                    this.showToast('Error', 'An error occurred while updating records', 'error');
                    console.error(error);
                });
        } else {
            this.showToast('Info', 'No changes to save', 'info');
        }
    }

    handleCancel() {
        this.draftValues = [];
        this.showToast('Info', 'Changes have been cancelled', 'info');
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        const selectedIds = selectedRows.map(row => row.Id);
        const message= {selectedAccountId: selectedIds[0]};
        console.log('Publishing message:', message); 
        publish(this.messageContext, ACCOUNT_MESSAGE_CHANNEL, message);
        console.log('selectedRows:', JSON.stringify(selectedRows, null, 2));
        console.log('selectedIds:', JSON.stringify(selectedIds, null, 2));
        console.log('accountSelectEvent:', selectedIds[0]);
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}