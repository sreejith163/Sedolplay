import { KeyValue } from '../../models/key-value.model';
import { TimeZone } from '../../models/timezone.model';

export class GenericContent {
    currencies: KeyValue[];
    timezones: TimeZone[];
    countries: KeyValue[];
}
