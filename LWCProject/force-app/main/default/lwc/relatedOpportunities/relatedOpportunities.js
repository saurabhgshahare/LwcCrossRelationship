import { LightningElement, api, track, wire } from 'lwc';
import getRelatedOpportunities from '@salesforce/apex/OpportunityController.getRelatedOpportunities';
import { refreshApex } from '@salesforce/apex'; 

export default class RelatedOpportunities extends LightningElement {
    @api accountId;
    @track opportunities = [];
    @track error;
    @track isCreateModalOpen = false;
    @track isViewModalOpen = false;
    @track selectedOpportunityId;

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text', 
          cellAttributes: { iconName: { fieldName: 'iconName' }, iconPosition: 'left' } },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date', typeAttributes: { year: 'numeric', month: '2-digit', day: '2-digit' } },
        {
            type: 'button-icon',
            fixedWidth: 50,
            typeAttributes: {
                iconName: 'utility:preview',
                alternativeText: 'View Opportunity',
                title: 'View Opportunity',
                variant: 'border-filled',
                name: 'view'
            }
        }
    ];

    wiredOpportunitiesResult; 

    @wire(getRelatedOpportunities, { accountId: '$accountId' })
    wiredOpportunities(result) {
        this.wiredOpportunitiesResult = result;
        if (result.data) {
            this.opportunities = result.data.map(opportunity => {
                return {
                    ...opportunity,
                    iconName: this.getIconName(opportunity.StageName, opportunity.CreatedDate)
                };
            });
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.opportunities = [];
        }
    }

    get hasNoOpportunities() {
        return this.opportunities.length === 0 && !this.error;
    }

    getIconName(stageName, createdDate) {
        const now = new Date();
        const createdDateObj = new Date(createdDate);
        const daysOld = Math.floor((now - createdDateObj) / (1000 * 60 * 60 * 24));

        if (stageName === 'Closed Won') {
            return 'utility:success';
        } else if (stageName === 'Closed Lost') {
            return 'utility:error';
        } else if (daysOld > 7) {
            return 'utility:warning';
        }
        return 'utility:announcement';
    }

    handleCreateOpportunity() {
        this.isCreateModalOpen = true;
    }

    closeCreateModal() {
        this.isCreateModalOpen = false;
    }

    handleSaveOpportunity(event) {
        this.closeCreateModal();
        return refreshApex(this.wiredOpportunitiesResult); 
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view') {
            this.selectedOpportunityId = row.Id;
            console.log('selectedOpportunityId is:', this.selectedOpportunityId);
            this.isViewModalOpen = true;
            console.log('isViewModalOpen is to be:',this.isViewModalOpen);
        }
    }

    closeViewModal() {
        this.isViewModalOpen = false;
    }
}