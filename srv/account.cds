using { com.satinfotech.team as db } from '../db/schema';

service team{
    entity accountdoc as projection on db.accountdoc;
}

annotate team.accountdoc with @odata.draft.enabled;