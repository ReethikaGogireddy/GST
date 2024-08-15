using { com.satinfotech.team as db } from '../db/schema';

service team{
    entity accountdoc as projection on db.accountdoc;
    entity docitem as projection on db.docitem;
}

annotate team.accountdoc with @odata.draft.enabled;
