import { Directive, Attribute  } from '@angular/core';
import { Validator,  NG_VALIDATORS } from '@angular/forms';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[compare-password]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordResetDirective, multi: true}]
})

export class PasswordResetDirective implements Validator {

  constructor(@Attribute('compare-password') public comparer: string,
              @Attribute('parent') public parent: string){}

  validate(c: any): {[key: string]: any} {
    const e = c.root.get(this.comparer);

    if (e && c.value !== e.value && !this.isParent) {
      return { compare: true };
    }

    if (e && c.value === e.value && this.isParent) {
        delete e.errors.compare;
        if (!Object.keys(e.errors).length) {
            e.setErrors(null);
        }
    }

    if (e && c.value !== e.value && this.isParent) {
        e.setErrors({ compare: true });
    }
  }

  private get isParent() {
    if (!this.parent) {
        return false;
    }
    return this.parent === 'true' ? true : false;
  }
}
