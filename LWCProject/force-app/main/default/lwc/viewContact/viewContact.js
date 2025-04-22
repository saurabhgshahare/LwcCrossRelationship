import { LightningElement, api } from 'lwc';

export default class ViewContact extends LightningElement {
    @api contactId;
    @api isViewModalOpen;
    fields = ['FirstName', 'LastName', 'Email', 'Phone']; 

    handleClose() {
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent); 
    }
}