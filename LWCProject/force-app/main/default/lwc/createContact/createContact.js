import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateContact extends LightningElement {
    @api accountId; 

    handleClose() {
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent); // Dispatch close event to parent
    }

    handleSuccess(event) {
        const saveEvent = new CustomEvent('save', { detail: event.detail.id });
        console.log('Contact created with Id: ' + event.detail.id);
        this.dispatchEvent(saveEvent); 

        
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Contact created successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);

        this.handleClose(); 
    }

    handleError(event) {
        console.error('Error creating contact:', event.detail);

        
        const toastEvent = new ShowToastEvent({
            title: 'Error',
            message: 'Error creating contact',
            variant: 'error'
        });
        this.dispatchEvent(toastEvent);
    }

    handleSave() {
        this.template.querySelector('lightning-record-edit-form').submit();
    }
}