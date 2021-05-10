import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe<T = any> implements PipeTransform {
    constructor() {
        console.log('Trim pipe activate');
    }
    private trimObject(obj: T) {
        return Object.keys(obj).reduce((prev, curr) => {
            let prop = obj[curr];
            if (typeof prop === 'string') {
                prop = prop.trim().replace(/\s/g, '');
            } else if (typeof prop === 'object') {
                prop = this.trimObject(prop);
            }
            return { ...prev, [curr]: prop };
        }, {});
    }

    transform(value: T, metadata: ArgumentMetadata): any {
        return this.trimObject(value);
    }
}
