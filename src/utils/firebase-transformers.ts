import _ from 'lodash-es';

export const firebaseToObject = (value: any) => _.mapValues(_.keyBy(value, 'key'), 'value');

export const firebaseToArray = (items: any) =>
  _.map(items, (item) => ({ ...item.value, id: item.key }));

export const firebaseObjectToArray = (obj: Record<string, any>) =>
  Object.keys(obj).map((key) => ({
    id: key,
    ...obj[key],
  }));
