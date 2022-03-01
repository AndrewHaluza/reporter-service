/* eslint-disable no-param-reassign */
/* eslint-disable func-names */

export function LogErrorDecorator(bubble = false) {
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function(...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // this.logger.error(`{${propertyKey}} ${error.message}`, error.stack);

        if (bubble) {
          throw error;
        }
      }
    };
  };
}
