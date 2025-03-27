import { LightningElement, api, track, wire } from 'lwc';
import getRelatedContacts from '@salesforce/apex/ContactController.getRelatedContacts'; 
import { refreshApex } from '@salesforce/apex';

export default class RelatedContacts extends LightningElement {
    @api accountId;
    @track contacts = []; 
    @track error; 
    @track isCreateModalOpen = false;
    @track isViewModalOpen = false; 
    @track selectedContactId;

    columns = [
        { label: 'Name', fieldName: 'FullName' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone'},
        {
            type: 'button-icon',
            fixedWidth: 50,
            typeAttributes: {
                iconName: 'utility:preview',
                alternativeText: 'View Contact',
                title: 'View Contact',
                variant: 'border-filled',
                name: 'view'
            }
        }
    ];

    wiredContactsResult; 

    @wire(getRelatedContacts, { accountId: '$accountId' })
    wiredContacts(result) {
        this.wiredContactsResult = result;
        if (result.data) {
            this.contacts = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.contacts = [];
        }
    }

    get hasNoContacts() {
        return this.contacts.length === 0 && !this.error;
    }

    handleCreateContact() {
        this.isCreateModalOpen = true;
    }

    closeCreateModal() {
        this.isCreateModalOpen = false; 
    }

    handleSaveContact(event) {
        this.closeCreateModal();
        return refreshApex(this.wiredContactsResult);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view') {
            this.selectedContactId = row.Id;
            console.log('SelectedRowID', this.selectedContactId);
            this.isViewModalOpen = true; 
            console.log('isViewModalOpen set to be ', this.isViewModalOpen);
        }
    }

    closeViewModal() {
        this.isViewModalOpen = false;
    }
}