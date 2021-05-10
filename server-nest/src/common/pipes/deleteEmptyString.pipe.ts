import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DeleteEmptyStringPipe<T = any> implements PipeTransform {
    constructor() {
        console.log('Delete empty string pipe activate');
    }
    private cleanObject(obj: T) {
        return Object.keys(obj).reduce((prev, curr) => {
            let prop = obj[curr];
            if (typeof prop === 'string' && prop === '') {
                return { ...prev };
            } else if (typeof prop === 'object') {
                prop = this.cleanObject(prop);
            }
            return { ...prev, [curr]: prop };
        }, {});
    }

    transform(value: T, metadata: ArgumentMetadata): any {
        return this.cleanObject(value);
    }
}
