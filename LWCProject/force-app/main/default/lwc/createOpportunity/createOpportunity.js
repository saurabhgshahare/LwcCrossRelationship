import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateOpportunity extends LightningElement {
    @api accountId; 

    handleClose() {
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent); 
    }

    handleSuccess(event) {
        const saveEvent = new CustomEvent('save', { detail: event.detail.id });
        this.dispatchEvent(saveEvent); 

        
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Opportunity created successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);

        this.handleClose(); 
    }

    handleError(event) {
        console.error('Error creating opportunity:', event.detail);

        
        const toastEvent = new ShowToastEvent({
            title: 'Error',
            message: 'Error creating opportunity',
            variant: 'error'
        });
        this.dispatchEvent(toastEvent);
    }

    handleSave() {
        this.template.querySelector('lightning-record-edit-form').submit();
    }
}