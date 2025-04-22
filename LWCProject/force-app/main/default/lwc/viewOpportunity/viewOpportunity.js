import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';

export default class ViewOpportunity extends LightningElement {
    @api opportunityId;
    @track opportunity; 
    @track error; 
    @api isViewModalOpen = false; 
    
    @wire(getRecord, {
        recordId: '$opportunityId',
        fields: [NAME_FIELD, STAGE_FIELD, CLOSE_DATE_FIELD]
    })
    wiredOpportunity({ error, data }) {
        if (data) {
            this.opportunity = data.fields;
            this.error = undefined;
        } else if (error) {
            this.error = error; 
            this.opportunity = undefined;
        }
    }

    handleClose() {
        this.isViewModalOpen = false;
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent); 
    }
}