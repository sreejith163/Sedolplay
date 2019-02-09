import { KeyValue } from './key-value.model';
import { TimeZone } from './timezone.model';

export class GenericContent {
    currencies: KeyValue[];
    timezones: TimeZone[];
    countries: KeyValue[];
}
