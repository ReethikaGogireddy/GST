using { com.satinfotech.team as db } from '../db/schema';
using { API_OPLACCTGDOCITEMCUBE_SRV as gstapi } from './external/API_OPLACCTGDOCITEMCUBE_SRV';

service team @(requires: 'authenticated-user') {

    entity ext as projection on gstapi.A_OperationalAcctgDocItemCube
    

    entity gst as projection on db.gst;
}

annotate team.gst with @odata.draft.enabled;
