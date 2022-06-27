import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export const Match = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => string | number,
  validationOptions?: ValidationOptions,
) => {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: string | number, args: ValidationArguments): boolean {
    const [fn] = args.constraints;
    return fn(args.object) === value;
  }

  defaultMessage(args: ValidationArguments): string {
    const [fn] = args.constraints;
    return `${fn(args.object)} and ${args.property} fields does not match`;
  }
}
